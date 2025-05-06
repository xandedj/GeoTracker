import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicles } from "@/hooks/useVehicles";
import { VehicleStatus } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function VehicleStatusList() {
  const { vehicles, isLoading } = useVehicles();
  const [, navigate] = useLocation();

  const getStatusDot = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return "Em movimento";
      case VehicleStatus.PARKED:
        return "Estacionado";
      case VehicleStatus.MAINTENANCE:
        return "Em manutenção";
      default:
        return "Desligado";
    }
  };

  const handleVehicleClick = (id: string) => {
    navigate(`/vehicles/${id}`);
  };

  const handleViewAllClick = () => {
    navigate("/vehicles");
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="px-4 py-3 border-b border-gray-200 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium text-gray-800">
          Status dos Veículos
        </CardTitle>
        <Button
          variant="link"
          className="text-primary-600 hover:text-primary-700 text-sm p-0"
          onClick={handleViewAllClick}
        >
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 max-h-80 overflow-auto scrollbar-hide">
          {isLoading ? (
            // Loading skeleton
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-3 flex items-center">
                  <Skeleton className="w-3 h-3 rounded-full mr-3" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-32 mt-1" />
                  </div>
                </div>
              ))
          ) : vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-3 hover:bg-gray-50 flex items-center cursor-pointer"
                onClick={() => handleVehicleClick(vehicle.id)}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full mr-3",
                    getStatusDot(vehicle.status)
                  )}
                  title={getStatusText(vehicle.status)}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800 truncate">
                      {vehicle.plate}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vehicle.lastLocation?.speed
                        ? `${Math.round(vehicle.lastLocation.speed)} km/h`
                        : "0 km/h"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {vehicle.brand} {vehicle.model}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Nenhum veículo encontrado.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
