import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { LocationHistory } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useLocation() {
  const { toast } = useToast();

  const getLocationHistory = (vehicleId: string, params?: { startDate?: string; endDate?: string; limit?: number }) => {
    let queryParams = new URLSearchParams();
    
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return useQuery<LocationHistory[]>({
      queryKey: [`/api/vehicles/${vehicleId}/locations${queryString}`],
    });
  };

  const getLastLocation = (vehicleId: string) => {
    return useQuery<LocationHistory>({
      queryKey: [`/api/vehicles/${vehicleId}/locations/last`],
    });
  };

  // This would typically be used by the device, not the web UI
  const addLocationUpdate = useMutation({
    mutationFn: async ({ deviceId, data }: { deviceId: string; data: { latitude: number; longitude: number; speed?: number; heading?: number; accuracy?: number; } }) => {
      const res = await apiRequest("POST", `/api/devices/${deviceId}/locations`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/devices/${variables.deviceId}/locations`] });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] }); // This will refresh vehicles with their last locations
      toast({
        title: "Localização atualizada",
        description: "A localização foi atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível atualizar a localização: ${error.message}`,
      });
    },
  });

  return {
    getLocationHistory,
    getLastLocation,
    addLocationUpdate,
  };
}
