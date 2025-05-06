import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InsertVehicle, VehicleStatus } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

interface VehicleFormProps {
  onSubmit: (data: InsertVehicle) => Promise<void>;
  initialData?: Partial<InsertVehicle>;
  isSubmitting: boolean;
  mode?: "create" | "edit";
}

const vehicleFormSchema = z.object({
  plate: z.string().min(1, { message: "Placa é obrigatória" }).max(10),
  brand: z.string().min(1, { message: "Marca é obrigatória" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1900, {
    message: "Ano inválido",
  }),
  color: z.string().optional(),
  nickname: z.string().optional(),
  status: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export default function VehicleForm({
  onSubmit,
  initialData,
  isSubmitting,
  mode = "create",
}: VehicleFormProps) {
  const { user } = useAuth();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plate: initialData?.plate || "",
      brand: initialData?.brand || "",
      model: initialData?.model || "",
      year: initialData?.year ? initialData.year.toString() : "",
      color: initialData?.color || "",
      nickname: initialData?.nickname || "",
      status: initialData?.status || VehicleStatus.INACTIVE,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        plate: initialData.plate || "",
        brand: initialData.brand || "",
        model: initialData.model || "",
        year: initialData.year ? initialData.year.toString() : "",
        color: initialData.color || "",
        nickname: initialData.nickname || "",
        status: initialData.status || VehicleStatus.INACTIVE,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: VehicleFormValues) => {
    if (!user) return;

    try {
      await onSubmit({
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: parseInt(data.year),
        color: data.color || "",
        nickname: data.nickname || "",
        ownerId: user.id,
        status: (data.status as VehicleStatus) || VehicleStatus.INACTIVE,
        organizationId: initialData?.organizationId || user.id, // Default to user ID if no org
      });
      
      if (mode === "create") {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting vehicle form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="ABC1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Corolla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input placeholder="2020" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <FormControl>
                  <Input placeholder="Prata" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Carro da Família" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "edit" && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={VehicleStatus.ACTIVE}>
                      Em movimento
                    </SelectItem>
                    <SelectItem value={VehicleStatus.PARKED}>
                      Estacionado
                    </SelectItem>
                    <SelectItem value={VehicleStatus.INACTIVE}>
                      Inativo
                    </SelectItem>
                    <SelectItem value={VehicleStatus.MAINTENANCE}>
                      Em manutenção
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Salvando..."
              : mode === "create"
              ? "Adicionar Veículo"
              : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
