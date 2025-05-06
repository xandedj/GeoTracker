import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import VehicleForm from "@/components/vehicles/VehicleForm";
import { useVehicles } from "@/hooks/useVehicles";
import { useLocation as useLocationHistory } from "@/hooks/useLocation";
import { InsertVehicle } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Car,
  MapPin,
  Calendar,
  AlertTriangle,
  History,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface VehicleDetailsPageProps {
  id: string;
}

export default function VehicleDetailsPage({ id }: VehicleDetailsPageProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [, navigate] = useLocation();
  const { getVehicle, updateVehicle } = useVehicles();
  const { data: vehicle, isLoading, error } = getVehicle(id);
  const { getLocationHistory } = useLocationHistory();
  const { data: locationHistory, isLoading: isLocationHistoryLoading } = getLocationHistory(id, { limit: 10 });

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleBack = () => {
    navigate("/vehicles");
  };

  const handleSubmit = async (data: InsertVehicle) => {
    await updateVehicle.mutateAsync({ id, data });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Em movimento</Badge>;
      case "parked":
        return <Badge className="bg-blue-500">Estacionado</Badge>;
      case "maintenance":
        return <Badge className="bg-amber-500">Em manutenção</Badge>;
      default:
        return <Badge className="bg-gray-500">Inativo</Badge>;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Não foi possível carregar as informações do veículo.</p>
            <Button className="mt-4" onClick={handleBack}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="w-64 h-full bg-white">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex items-center">
                <Car className="text-primary-600 h-6 w-6 mr-2" />
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
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <Header
          title={`Veículo ${vehicle?.vehicle?.plate || ""}`}
          onMobileMenuToggle={toggleMobileSidebar}
        />

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="mb-6 flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">
              {isLoading ? "Carregando..." : `${vehicle?.vehicle?.brand} ${vehicle?.vehicle?.model}`}
              {vehicle?.vehicle?.nickname && ` - ${vehicle.vehicle.nickname}`}
            </h1>
            {vehicle?.vehicle?.status && (
              <div className="ml-3">{getStatusBadge(vehicle.vehicle.status)}</div>
            )}
          </div>

          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="location">Localização</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Informações do Veículo
                  </CardTitle>
                  <CardDescription>
                    Visualize e edite as informações do veículo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <VehicleForm
                      initialData={vehicle?.vehicle}
                      onSubmit={handleSubmit}
                      isSubmitting={updateVehicle.isPending}
                      mode="edit"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Localização Atual
                  </CardTitle>
                  <CardDescription>
                    Veja a posição atual do veículo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : vehicle?.lastLocation ? (
                    <div>
                      <div className="h-[400px] bg-gray-100 rounded-md mb-4 flex items-center justify-center relative">
                        <iframe
                          className="w-full h-full rounded-md"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                            vehicle.lastLocation.longitude - 0.01
                          },${vehicle.lastLocation.latitude - 0.01},${
                            vehicle.lastLocation.longitude + 0.01
                          },${
                            vehicle.lastLocation.latitude + 0.01
                          }&layer=mapnik&marker=${vehicle.lastLocation.latitude},${
                            vehicle.lastLocation.longitude
                          }`}
                        ></iframe>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Latitude</div>
                          <div className="font-semibold">{vehicle.lastLocation.latitude.toFixed(6)}</div>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Longitude</div>
                          <div className="font-semibold">{vehicle.lastLocation.longitude.toFixed(6)}</div>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Velocidade</div>
                          <div className="font-semibold">{vehicle.lastLocation.speed || 0} km/h</div>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Direção</div>
                          <div className="font-semibold">{vehicle.lastLocation.heading || 0}°</div>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Precisão</div>
                          <div className="font-semibold">{vehicle.lastLocation.accuracy || 0} m</div>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Última Atualização</div>
                          <div className="font-semibold">{formatDateTime(vehicle.lastLocation.eventTime)}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Não há dados de localização disponíveis para este veículo.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Histórico de Localização
                  </CardTitle>
                  <CardDescription>
                    Últimas localizações registradas do veículo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLocationHistoryLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : locationHistory && locationHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Data/Hora</th>
                            <th className="text-left py-2 px-4">Latitude</th>
                            <th className="text-left py-2 px-4">Longitude</th>
                            <th className="text-left py-2 px-4">Velocidade</th>
                            <th className="text-left py-2 px-4">Direção</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locationHistory.map((location) => (
                            <tr key={location.id} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">
                                {formatDateTime(location.eventTime)}
                              </td>
                              <td className="py-2 px-4">{location.latitude.toFixed(6)}</td>
                              <td className="py-2 px-4">{location.longitude.toFixed(6)}</td>
                              <td className="py-2 px-4">{location.speed || 0} km/h</td>
                              <td className="py-2 px-4">{location.heading || 0}°</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Não há histórico de localização disponível para este veículo.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Registros de Manutenção
                  </CardTitle>
                  <CardDescription>
                    Histórico de manutenções do veículo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    Não há registros de manutenção disponíveis para este veículo.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Alertas
                  </CardTitle>
                  <CardDescription>
                    Alertas relacionados a este veículo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    Não há alertas disponíveis para este veículo.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
