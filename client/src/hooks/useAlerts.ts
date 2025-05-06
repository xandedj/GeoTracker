import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Alert, InsertAlert } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAlerts() {
  const { toast } = useToast();

  const {
    data: alerts,
    isLoading,
    isError,
    error,
  } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const createAlert = useMutation({
    mutationFn: async (alert: InsertAlert) => {
      const res = await apiRequest("POST", "/api/alerts", alert);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerta criado",
        description: "O alerta foi criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível criar o alerta: ${error.message}`,
      });
    },
  });

  const acknowledgeAlert = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/alerts/${id}/acknowledge`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerta reconhecido",
        description: "O alerta foi marcado como visto com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível reconhecer o alerta: ${error.message}`,
      });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/alerts/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alerta removido",
        description: "O alerta foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível remover o alerta: ${error.message}`,
      });
    },
  });

  return {
    alerts,
    isLoading,
    isError,
    error,
    createAlert,
    acknowledgeAlert,
    deleteAlert,
  };
}
