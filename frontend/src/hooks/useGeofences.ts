import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Geofence, InsertGeofence } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useGeofences() {
  const { toast } = useToast();

  const {
    data: geofences,
    isLoading,
    isError,
    error,
  } = useQuery<Geofence[]>({
    queryKey: ["/api/geofences"],
  });

  const createGeofence = useMutation({
    mutationFn: async (geofence: InsertGeofence) => {
      const res = await apiRequest("POST", "/api/geofences", geofence);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Cerca virtual criada",
        description: "A cerca virtual foi criada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível criar a cerca virtual: ${error.message}`,
      });
    },
  });

  const updateGeofence = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGeofence> }) => {
      const res = await apiRequest("PATCH", `/api/geofences/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Cerca virtual atualizada",
        description: "A cerca virtual foi atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível atualizar a cerca virtual: ${error.message}`,
      });
    },
  });

  const deleteGeofence = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/geofences/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Cerca virtual removida",
        description: "A cerca virtual foi removida com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível remover a cerca virtual: ${error.message}`,
      });
    },
  });

  const assignVehicleToGeofence = useMutation({
    mutationFn: async ({ geofenceId, vehicleId }: { geofenceId: string; vehicleId: string }) => {
      const res = await apiRequest("POST", `/api/geofences/${geofenceId}/vehicles/${vehicleId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Veículo atribuído",
        description: "O veículo foi atribuído à cerca virtual com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível atribuir o veículo à cerca virtual: ${error.message}`,
      });
    },
  });

  const removeVehicleFromGeofence = useMutation({
    mutationFn: async ({ geofenceId, vehicleId }: { geofenceId: string; vehicleId: string }) => {
      const res = await apiRequest("DELETE", `/api/geofences/${geofenceId}/vehicles/${vehicleId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Veículo removido",
        description: "O veículo foi removido da cerca virtual com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível remover o veículo da cerca virtual: ${error.message}`,
      });
    },
  });

  return {
    geofences,
    isLoading,
    isError,
    error,
    createGeofence,
    updateGeofence,
    deleteGeofence,
    assignVehicleToGeofence,
    removeVehicleFromGeofence,
  };
}
