import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { useVehicles } from "@/hooks/useVehicles";
import { useGeofences } from "@/hooks/useGeofences";
import { VehicleStatus } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  MapPin,
  Layers,
  Plus,
  Minus,
  Navigation,
  Info,
  Car,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MapPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showAllVehicles, setShowAllVehicles] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any>({});
  const geofencesRef = useRef<any>({});
  
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { geofences, isLoading: geofencesLoading } = useGeofences();

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

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
      if (mapType === "street") {
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
        
        // Skip if not showing all vehicles and this is not the selected one
        if (!showAllVehicles && selectedVehicle && markerKey !== selectedVehicle) {
          // Remove marker if it exists
          if (existingMarkers[markerKey]) {
            map.removeLayer(existingMarkers[markerKey]);
            delete existingMarkers[markerKey];
          }
          return;
        }
        
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

        // Make selected vehicle marker bigger
        const size = markerKey === selectedVehicle ? 16 : 12;
        const borderWidth = markerKey === selectedVehicle ? 3 : 2;

        // Define icon
        const vehicleIcon = L.divIcon({
          html: `<div style="background-color:${markerColor}; width:${size}px; height:${size}px; border-radius:50%; border:${borderWidth}px solid white; box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
          className: "",
          iconSize: [size, size],
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
              `<div style="min-width: 200px;">
                <div class="font-bold mb-1">${vehicle.plate}</div>
                <div class="text-sm mb-2">${vehicle.brand} ${vehicle.model}</div>
                <div class="text-sm">
                  <div class="mb-1"><strong>Status:</strong> ${
                    vehicle.status === VehicleStatus.ACTIVE
                      ? "Em movimento"
                      : vehicle.status === VehicleStatus.PARKED
                      ? "Estacionado"
                      : vehicle.status === VehicleStatus.MAINTENANCE
                      ? "Em manutenção"
                      : "Inativo"
                  }</div>
                  <div class="mb-1"><strong>Velocidade:</strong> ${Math.round(vehicle.lastLocation.speed || 0)} km/h</div>
                  <div class="mb-1"><strong>Atualização:</strong> ${new Date(vehicle.lastLocation.eventTime).toLocaleString()}</div>
                </div>
              </div>`
            );
          
          marker.on("click", () => {
            setSelectedVehicle(markerKey);
          });
          
          existingMarkers[markerKey] = marker;
        }
      });

      // Remove markers for vehicles that no longer exist or should not be shown
      Object.keys(existingMarkers).forEach((key) => {
        const stillExists = vehicles.some((v) => v.id === key);
        const shouldShow = showAllVehicles || key === selectedVehicle;
        
        if (!stillExists || !shouldShow) {
          map.removeLayer(existingMarkers[key]);
          delete existingMarkers[key];
        }
      });
    };

    updateMarkers();
  }, [vehicles, vehiclesLoading, mapReady, selectedVehicle, showAllVehicles]);

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

  const handleMapTypeChange = (type: "street" | "satellite") => {
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
      // If there's a selected vehicle, center on that
      if (selectedVehicle) {
        const vehicle = vehicles.find(v => v.id === selectedVehicle);
        if (vehicle?.lastLocation) {
          leafletMapRef.current.setView(
            [vehicle.lastLocation.latitude, vehicle.lastLocation.longitude],
            14
          );
          return;
        }
      }
      
      // Otherwise find the first vehicle with location
      const vehicleWithLocation = vehicles.find((v) => v.lastLocation);
      
      if (vehicleWithLocation?.lastLocation) {
        leafletMapRef.current.setView(
          [vehicleWithLocation.lastLocation.latitude, vehicleWithLocation.lastLocation.longitude],
          13
        );
      }
    }
  };

  const handleVehicleSelect = (vehicleId: string | null) => {
    setSelectedVehicle(vehicleId);
    
    if (vehicleId && vehicles) {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle?.lastLocation && mapReady && leafletMapRef.current) {
        leafletMapRef.current.setView(
          [vehicle.lastLocation.latitude, vehicle.lastLocation.longitude],
          14
        );
        
        // Open the popup for this vehicle
        const marker = markersRef.current[vehicleId];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return "bg-green-500";
      case VehicleStatus.PARKED:
        return "bg-blue-500";
      case VehicleStatus.MAINTENANCE:
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="w-64 h-full bg-white">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex items-center">
                <MapPin className="text-primary-600 h-6 w-6 mr-2" />
                <span className="text-lg font-medium">TrackerGeo</span>
              </div>
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col h-screen">
        <Header
          title="Mapa de Rastreamento"
          onMobileMenuToggle={toggleMobileSidebar}
        />

        {/* Map Container */}
        <div className="flex-1 relative">
          {(vehiclesLoading || geofencesLoading || !mapReady) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div ref={mapRef} className="w-full h-full"></div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="bg-white shadow-md">
                  <Layers className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleMapTypeChange("street")}
                  className={mapType === "street" ? "bg-primary-50 text-primary-600" : ""}
                >
                  Mapa de Ruas
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleMapTypeChange("satellite")}
                  className={mapType === "satellite" ? "bg-primary-50 text-primary-600" : ""}
                >
                  Satélite
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="bg-white rounded-md shadow-md flex flex-col">
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
              variant="secondary"
              size="icon"
              className="bg-white shadow-md"
              onClick={handleCenterMap}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md text-xs z-10">
            <div className="flex items-center mb-1">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>Em movimento</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span>Estacionado</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
              <span>Em manutenção</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
              <span>Inativo</span>
            </div>
          </div>
          
          {/* Vehicles Sidebar */}
          <Card className="absolute top-4 left-4 w-64 z-10 max-h-[calc(100%-8rem)] overflow-hidden flex flex-col">
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-medium text-sm flex items-center">
                <Car className="w-4 h-4 mr-1" />
                Veículos
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => setShowAllVehicles(!showAllVehicles)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showAllVehicles ? "Mostrar apenas veículo selecionado" : "Mostrar todos os veículos"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="p-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left mb-1 ${
                    selectedVehicle === null ? "bg-primary-50 text-primary-600" : ""
                  }`}
                  onClick={() => handleVehicleSelect(null)}
                >
                  <span className="truncate">Todos os veículos</span>
                </Button>
                {vehicles && vehicles.map((vehicle) => (
                  <Button
                    key={vehicle.id}
                    variant="ghost"
                    className={`w-full justify-start text-left mb-1 ${
                      selectedVehicle === vehicle.id ? "bg-primary-50 text-primary-600" : ""
                    }`}
                    onClick={() => handleVehicleSelect(vehicle.id)}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(vehicle.status)}`}></div>
                    <span className="truncate">{vehicle.plate}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-2 border-t">
              <Button 
                variant={showAllVehicles ? "secondary" : "outline"} 
                size="sm" 
                className="w-full"
                onClick={() => setShowAllVehicles(!showAllVehicles)}
              >
                {showAllVehicles ? "Mostrar apenas selecionado" : "Mostrar todos"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
