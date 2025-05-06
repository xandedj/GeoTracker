import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Vehicle, InsertVehicle, VehicleWithLastLocation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useVehicles() {
  const { toast } = useToast();

  const {
    data: vehicles,
    isLoading,
    isError,
    error,
  } = useQuery<VehicleWithLastLocation[]>({
    queryKey: ["/api/vehicles"],
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicle: InsertVehicle) => {
      const res = await apiRequest("POST", "/api/vehicles", vehicle);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Veículo adicionado",
        description: "O veículo foi adicionado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível adicionar o veículo: ${error.message}`,
      });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertVehicle> }) => {
      const res = await apiRequest("PATCH", `/api/vehicles/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${variables.id}`] });
      toast({
        title: "Veículo atualizado",
        description: "O veículo foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível atualizar o veículo: ${error.message}`,
      });
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/vehicles/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Veículo removido",
        description: "O veículo foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível remover o veículo: ${error.message}`,
      });
    },
  });

  const getVehicle = (id: string) => {
    return useQuery<VehicleWithLastLocation>({
      queryKey: [`/api/vehicles/${id}`],
    });
  };

  return {
    vehicles,
    isLoading,
    isError,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
  };
}
