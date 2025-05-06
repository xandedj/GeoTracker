import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { useVehicles } from "@/hooks/useVehicles";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertType } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AlertsList() {
  const { alerts, isLoading } = useAlerts();
  const { vehicles } = useVehicles();
  const { toast } = useToast();

  const getVehiclePlate = (vehicleId: string) => {
    if (!vehicles) return "";
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.plate : "";
  };

  const getAlertBorderColor = (type: string) => {
    switch (type) {
      case AlertType.SPEED:
        return "border-red-500";
      case AlertType.GEOFENCE:
        return "border-amber-500";
      case AlertType.MAINTENANCE:
        return "border-purple-500";
      default:
        return "border-gray-500";
    }
  };

  const formatAlertTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    }
    return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
  };

  const markAsSeen = useMutation({
    mutationFn: async (alertId: string) => {
      await apiRequest("POST", `/api/alerts/${alertId}/acknowledge`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerta marcado como visto",
        description: "O alerta foi marcado como visto com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível marcar o alerta como visto: ${error.message}`,
      });
    },
  });

  const handleMarkAsSeen = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsSeen.mutate(alertId);
  };

  const showOnMap = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real implementation, this would center the map on the alert location
    console.log("Show alert on map:", alertId);
    toast({
      title: "Visualizar no mapa",
      description: "Esta funcionalidade não está implementada neste protótipo.",
    });
  };

  const handleAlertClick = (alertId: string) => {
    // Navigate to alert details in a real implementation
    console.log("Navigate to alert details:", alertId);
  };

  const handleConfigureAlerts = () => {
    // Navigate to alert configuration in a real implementation
    console.log("Navigate to alert configuration");
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="px-4 py-3 border-b border-gray-200 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium text-gray-800 flex items-center">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
          Alertas Recentes
        </CardTitle>
        <Button
          variant="link"
          className="text-primary-600 hover:text-primary-700 text-sm p-0"
          onClick={handleConfigureAlerts}
        >
          Configurar
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 max-h-80 overflow-auto scrollbar-hide">
          {isLoading ? (
            // Loading skeleton
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full mt-1" />
                  <div className="mt-2 flex justify-end">
                    <Skeleton className="h-4 w-20 mr-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))
          ) : alerts && alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 border-l-4 cursor-pointer",
                  getAlertBorderColor(alert.type)
                )}
                onClick={() => handleAlertClick(alert.id)}
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">
                    {getVehiclePlate(alert.vehicleId)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatAlertTime(alert.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{alert.description}</p>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-primary-600 hover:text-primary-700 h-auto p-0 mr-3"
                    onClick={(e) => showOnMap(alert.id, e)}
                  >
                    Ver no mapa
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-gray-600 hover:text-gray-800 h-auto p-0"
                    onClick={(e) => handleMarkAsSeen(alert.id, e)}
                    disabled={alert.acknowledged || markAsSeen.isPending}
                  >
                    {markAsSeen.isPending ? "Processando..." : "Marcar como visto"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Nenhum alerta recente.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
