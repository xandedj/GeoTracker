import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Plus, Minus, Navigation } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { useGeofences } from "@/hooks/useGeofences";
import { VehicleStatus } from "@shared/schema";

// Since we're using Leaflet directly, we'll need to import it dynamically
// as it relies on window object which isn't available during SSR
export default function TrackingMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any>({});
  const geofencesRef = useRef<any>({});
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<"traffic" | "satellite">("traffic");
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { geofences, isLoading: geofencesLoading } = useGeofences();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapReady) return;

    const initMap = async () => {
      try {
        // Dynamic import of Leaflet
        const L = (await import("leaflet")).default;
        
        // CSS imports
        await import("leaflet/dist/leaflet.css");

        if (!mapRef.current) return;

        // Create map instance
        const map = L.map(mapRef.current).setView([-23.5505, -46.6333], 13);

        const mainLayer = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        );

        const satelliteLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          }
        );

        mainLayer.addTo(map);
        leafletMapRef.current = map;
        setMapReady(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, [mapRef, mapReady]);

  // Handle map type change
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current) return;

    const updateMapType = async () => {
      const L = (await import("leaflet")).default;
      const map = leafletMapRef.current;

      // Clear existing layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // Add new layer based on selected map type
      if (mapType === "traffic") {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      } else {
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          }
        ).addTo(map);
      }
    };

    updateMapType();
  }, [mapType, mapReady]);

  // Update vehicle markers when vehicles data changes
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || vehiclesLoading || !vehicles) return;

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default;
      const map = leafletMapRef.current;
      const existingMarkers = markersRef.current;

      // Create or update markers for each vehicle
      vehicles.forEach((vehicle) => {
        if (!vehicle.lastLocation) return;

        const { latitude, longitude } = vehicle.lastLocation;
        
        if (!latitude || !longitude) return;

        const markerKey = vehicle.id;
        
        // Get marker color based on vehicle status
        let markerColor = "#6B7280"; // gray for default
        switch (vehicle.status) {
          case VehicleStatus.ACTIVE:
            markerColor = "#10B981"; // green
            break;
          case VehicleStatus.PARKED:
            markerColor = "#3B82F6"; // blue
            break;
          case VehicleStatus.MAINTENANCE:
            markerColor = "#F59E0B"; // amber
            break;
        }

        // Define icon
        const vehicleIcon = L.divIcon({
          html: `<div style="background-color:${markerColor}; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
          className: "",
          iconSize: [12, 12],
        });

        // Create or update marker
        if (existingMarkers[markerKey]) {
          // Update existing marker position
          existingMarkers[markerKey]
            .setLatLng([latitude, longitude])
            .setIcon(vehicleIcon);
        } else {
          // Create new marker
          const marker = L.marker([latitude, longitude], {
            icon: vehicleIcon,
          })
            .addTo(map)
            .bindPopup(
              `<b>${vehicle.plate}</b><br>${vehicle.brand} ${vehicle.model}<br>${
                vehicle.status === VehicleStatus.ACTIVE
                  ? "Em movimento"
                  : vehicle.status === VehicleStatus.PARKED
                  ? "Estacionado"
                  : "Inativo"
              }`
            );
          existingMarkers[markerKey] = marker;
        }
      });

      // Remove markers for vehicles that no longer exist
      Object.keys(existingMarkers).forEach((key) => {
        const stillExists = vehicles.some((v) => v.id === key);
        if (!stillExists) {
          map.removeLayer(existingMarkers[key]);
          delete existingMarkers[key];
        }
      });
    };

    updateMarkers();
  }, [vehicles, vehiclesLoading, mapReady]);

  // Update geofences when geofences data changes
  useEffect(() => {
    if (!mapReady || !leafletMapRef.current || geofencesLoading || !geofences) return;

    const updateGeofences = async () => {
      const L = (await import("leaflet")).default;
      const map = leafletMapRef.current;
      const existingGeofences = geofencesRef.current;

      // Remove existing geofences
      Object.values(existingGeofences).forEach((geofence: any) => {
        map.removeLayer(geofence);
      });
      geofencesRef.current = {};

      // Create new geofences
      geofences.forEach((geofence) => {
        const { id, name, type, coordinates } = geofence;
        
        let geofenceLayer;
        
        try {
          if (type === "circle" && coordinates.center && coordinates.radius) {
            geofenceLayer = L.circle(
              [coordinates.center.lat, coordinates.center.lng],
              {
                radius: coordinates.radius,
                color: "#EF4444",
                fillColor: "#FEE2E2",
                fillOpacity: 0.3,
                weight: 2,
              }
            ).addTo(map);
          } else if (type === "polygon" && coordinates.points) {
            const points = coordinates.points.map((p: any) => [p.lat, p.lng]);
            geofenceLayer = L.polygon(points, {
              color: "#EF4444",
              fillColor: "#FEE2E2",
              fillOpacity: 0.3,
              weight: 2,
            }).addTo(map);
          } else if (type === "rectangle" && coordinates.bounds) {
            geofenceLayer = L.rectangle(
              [
                [coordinates.bounds.southWest.lat, coordinates.bounds.southWest.lng],
                [coordinates.bounds.northEast.lat, coordinates.bounds.northEast.lng]
              ],
              {
                color: "#EF4444",
                fillColor: "#FEE2E2",
                fillOpacity: 0.3,
                weight: 2,
              }
            ).addTo(map);
          }
          
          if (geofenceLayer) {
            geofenceLayer.bindPopup(`<b>${name}</b>`);
            geofencesRef.current[id] = geofenceLayer;
          }
        } catch (error) {
          console.error("Error creating geofence:", error);
        }
      });
    };

    updateGeofences();
  }, [geofences, geofencesLoading, mapReady]);

  const handleMapTypeChange = (type: "traffic" | "satellite") => {
    setMapType(type);
  };

  const handleZoomIn = () => {
    if (mapReady && leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapReady && leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleCenterMap = () => {
    if (mapReady && leafletMapRef.current && vehicles && vehicles.length > 0) {
      // Find the first vehicle with location
      const vehicleWithLocation = vehicles.find((v) => v.lastLocation);
      
      if (vehicleWithLocation?.lastLocation) {
        leafletMapRef.current.setView(
          [vehicleWithLocation.lastLocation.latitude, vehicleWithLocation.lastLocation.longitude],
          13
        );
      }
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200">
      <CardHeader className="p-4 border-b border-gray-200 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium text-gray-800">
          Mapa de Rastreamento
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={mapType === "traffic" ? "secondary" : "ghost"}
            size="sm"
            className={mapType === "traffic" ? "bg-primary-100 text-primary-700" : "text-gray-500"}
            onClick={() => handleMapTypeChange("traffic")}
          >
            Tráfego
          </Button>
          <Button
            variant={mapType === "satellite" ? "secondary" : "ghost"}
            size="sm"
            className={mapType === "satellite" ? "bg-primary-100 text-primary-700" : "text-gray-500"}
            onClick={() => handleMapTypeChange("satellite")}
          >
            Satélite
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative h-[500px]">
        {(vehiclesLoading || geofencesLoading || !mapReady) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full"></div>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-md shadow-md flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-gray-600 hover:bg-gray-100 border-b border-gray-200"
            onClick={handleZoomIn}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon" 
            className="p-2 text-gray-600 hover:bg-gray-100"
            onClick={handleZoomOut}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="default"
          size="icon"
          className="absolute top-4 right-16 bg-white text-gray-600 hover:bg-gray-100 shadow-md p-2"
          onClick={handleCenterMap}
        >
          <Navigation className="h-4 w-4" />
        </Button>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md text-xs">
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span>Em movimento</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span>Estacionado</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
            <span>Desligado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
