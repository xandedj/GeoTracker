import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InsertGeofence, GeofenceType } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

interface GeofenceFormProps {
  onSubmit: (data: InsertGeofence) => Promise<void>;
  initialData?: Partial<InsertGeofence>;
  isSubmitting: boolean;
  mode?: "create" | "edit";
}

const geofenceFormSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  type: z.string().min(1, { message: "Tipo é obrigatório" }),
  coordinates: z.string().min(1, { message: "Coordenadas são obrigatórias" }),
  schedule: z.string().optional(),
});

type GeofenceFormValues = z.infer<typeof geofenceFormSchema>;

export default function GeofenceForm({
  onSubmit,
  initialData,
  isSubmitting,
  mode = "create",
}: GeofenceFormProps) {
  const { user } = useAuth();

  const form = useForm<GeofenceFormValues>({
    resolver: zodResolver(geofenceFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || GeofenceType.CIRCLE,
      coordinates: initialData?.coordinates 
        ? JSON.stringify(initialData.coordinates, null, 2)
        : "",
      schedule: initialData?.schedule 
        ? JSON.stringify(initialData.schedule, null, 2)
        : "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        type: initialData.type || GeofenceType.CIRCLE,
        coordinates: initialData.coordinates 
          ? JSON.stringify(initialData.coordinates, null, 2)
          : "",
        schedule: initialData.schedule 
          ? JSON.stringify(initialData.schedule, null, 2)
          : "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: GeofenceFormValues) => {
    if (!user) return;

    try {
      let parsedCoordinates;
      let parsedSchedule = null;

      try {
        parsedCoordinates = JSON.parse(data.coordinates);
      } catch (error) {
        form.setError("coordinates", {
          type: "manual",
          message: "Formato de coordenadas inválido. Use formato JSON válido."
        });
        return;
      }

      if (data.schedule) {
        try {
          parsedSchedule = JSON.parse(data.schedule);
        } catch (error) {
          form.setError("schedule", {
            type: "manual",
            message: "Formato de agenda inválido. Use formato JSON válido."
          });
          return;
        }
      }

      await onSubmit({
        name: data.name,
        type: data.type as GeofenceType,
        coordinates: parsedCoordinates,
        schedule: parsedSchedule,
        creatorId: user.id,
        organizationId: initialData?.organizationId || user.id, // Default to user ID if no org
      });
      
      if (mode === "create") {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting geofence form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Área Comercial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={GeofenceType.CIRCLE}>
                    Círculo
                  </SelectItem>
                  <SelectItem value={GeofenceType.POLYGON}>
                    Polígono
                  </SelectItem>
                  <SelectItem value={GeofenceType.RECTANGLE}>
                    Retângulo
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coordinates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coordenadas</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='{"center": {"lat": -23.55, "lng": -46.63}, "radius": 500}'
                  className="font-mono text-sm h-24"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                {field.value === GeofenceType.CIRCLE
                  ? 'Formato: {"center": {"lat": -23.55, "lng": -46.63}, "radius": 500}'
                  : field.value === GeofenceType.POLYGON
                  ? 'Formato: {"points": [{"lat": -23.55, "lng": -46.63}, ...]}'
                  : 'Formato: {"bounds": {"southWest": {"lat": -23.55, "lng": -46.63}, "northEast": {"lat": -23.54, "lng": -46.62}}}'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cronograma (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='{"days": [1,2,3,4,5], "startTime": "08:00", "endTime": "18:00"}'
                  className="font-mono text-sm h-24"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Defina quando a cerca virtual está ativa. Deixe vazio para estar sempre ativa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Salvando..."
              : mode === "create"
              ? "Criar Cerca Virtual"
              : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
