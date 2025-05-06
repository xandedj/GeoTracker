import { Geofence, LocationHistory } from "@shared/schema";

interface Point {
  lat: number;
  lng: number;
}

interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two points in kilometers using the Haversine formula
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Check if a point is inside a circle geofence
 */
function isPointInCircle(
  point: GeoPoint, 
  center: Point, 
  radiusInMeters: number
): boolean {
  // Convert radius from meters to kilometers
  const radiusInKm = radiusInMeters / 1000;
  
  // Calculate distance between point and center
  const distance = calculateDistance(
    point.latitude, 
    point.longitude, 
    center.lat, 
    center.lng
  );
  
  // Point is inside if distance is less than radius
  return distance <= radiusInKm;
}

/**
 * Check if a point is inside a polygon geofence using ray casting algorithm
 */
function isPointInPolygon(
  point: GeoPoint, 
  polygon: Point[]
): boolean {
  // Ray casting algorithm
  let inside = false;
  const x = point.longitude;
  const y = point.latitude;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;
    
    const intersect = ((yi > y) !== (yj > y)) && 
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Check if a point is inside a rectangle geofence
 */
function isPointInRectangle(
  point: GeoPoint, 
  southWest: Point, 
  northEast: Point
): boolean {
  return (
    point.latitude >= southWest.lat && 
    point.latitude <= northEast.lat && 
    point.longitude >= southWest.lng && 
    point.longitude <= northEast.lng
  );
}

/**
 * Check if a location is outside any of the geofences
 * Returns an array of violated geofences
 */
export function checkGeofenceViolations(
  location: LocationHistory, 
  geofences: Geofence[]
): Geofence[] {
  const violations: Geofence[] = [];
  
  for (const geofence of geofences) {
    let isInside = false;
    
    // Check if inside based on geofence type
    if (geofence.type === "circle" && geofence.coordinates.center && geofence.coordinates.radius) {
      isInside = isPointInCircle(
        location, 
        geofence.coordinates.center, 
        geofence.coordinates.radius
      );
    } else if (geofence.type === "polygon" && geofence.coordinates.points) {
      isInside = isPointInPolygon(
        location, 
        geofence.coordinates.points
      );
    } else if (geofence.type === "rectangle" && geofence.coordinates.bounds) {
      isInside = isPointInRectangle(
        location, 
        geofence.coordinates.bounds.southWest, 
        geofence.coordinates.bounds.northEast
      );
    }
    
    // If not inside, it's a violation
    if (!isInside) {
      violations.push(geofence);
    }
  }
  
  return violations;
}
