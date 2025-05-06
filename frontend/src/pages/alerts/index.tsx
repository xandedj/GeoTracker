import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { useAlerts } from "@/hooks/useAlerts";
import { useVehicles } from "@/hooks/useVehicles";
import { AlertType } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Search,
  MoreVertical,
  Eye,
  MapPin,
  Bell,
  Check,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function AlertsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "acknowledged">("all");
  const [filterTypes, setFilterTypes] = useState<Record<string, boolean>>({
    [AlertType.SPEED]: true,
    [AlertType.GEOFENCE]: true,
    [AlertType.MAINTENANCE]: true,
    [AlertType.ENGINE]: true,
    [AlertType.BATTERY]: true,
    [AlertType.UNAUTHORIZED_ACCESS]: true,
  });
  const [alertDetailDialog, setAlertDetailDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  
  const { alerts, isLoading, acknowledgeAlert } = useAlerts();
  const { vehicles } = useVehicles();

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const getVehiclePlate = (vehicleId: string) => {
    if (!vehicles) return "";
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? vehicle.plate : "";
  };

  const getAlertTypeBadge = (type: string) => {
    switch (type) {
      case AlertType.SPEED:
        return <Badge className="bg-red-500">Velocidade</Badge>;
      case AlertType.GEOFENCE:
        return <Badge className="bg-amber-500">Cerca Virtual</Badge>;
      case AlertType.MAINTENANCE:
        return <Badge className="bg-purple-500">Manutenção</Badge>;
      case AlertType.ENGINE:
        return <Badge className="bg-blue-500">Motor</Badge>;
      case AlertType.BATTERY:
        return <Badge className="bg-green-500">Bateria</Badge>;
      case AlertType.UNAUTHORIZED_ACCESS:
        return <Badge className="bg-gray-800">Acesso Não Autorizado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case AlertType.SPEED:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case AlertType.GEOFENCE:
        return <MapPin className="h-5 w-5 text-amber-500" />;
      case AlertType.MAINTENANCE:
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatAlertTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    }
    return formatDistanceToNow(date, { locale: ptBR, addSuffix: true });
  };

  const handleViewAlertDetails = (alert: any) => {
    setSelectedAlert(alert);
    setAlertDetailDialog(true);
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await acknowledgeAlert.mutateAsync(id);
      if (selectedAlert?.id === id) {
        setSelectedAlert((prev: any) => ({ ...prev, acknowledged: true }));
      }
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const handleFilterTypeChange = (type: string) => {
    setFilterTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const filteredAlerts = alerts?.filter((alert) => {
    // Filter by search query
    const vehiclePlate = getVehiclePlate(alert.vehicleId);
    const searchMatches = vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const statusMatches = filterStatus === "all" ||
                         (filterStatus === "active" && !alert.acknowledged) ||
                         (filterStatus === "acknowledged" && alert.acknowledged);
    
    // Filter by type
    const typeMatches = filterTypes[alert.type];
    
    return searchMatches && statusMatches && typeMatches;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="w-64 h-full bg-white">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex items-center">
                <AlertTriangle className="text-primary-600 h-6 w-6 mr-2" />
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
          title="Alertas"
          onMobileMenuToggle={toggleMobileSidebar}
        />

        {/* Content */}
        <div className="p-4 md:p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Alertas</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os alertas do sistema
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar alerta..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <h4 className="mb-2 font-medium">Tipos de Alerta</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox 
                            id="filter-speed" 
                            checked={filterTypes[AlertType.SPEED]} 
                            onCheckedChange={() => handleFilterTypeChange(AlertType.SPEED)}
                          />
                          <label htmlFor="filter-speed" className="ml-2 text-sm">Velocidade</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="filter-geofence" 
                            checked={filterTypes[AlertType.GEOFENCE]} 
                            onCheckedChange={() => handleFilterTypeChange(AlertType.GEOFENCE)}
                          />
                          <label htmlFor="filter-geofence" className="ml-2 text-sm">Cerca Virtual</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="filter-maintenance" 
                            checked={filterTypes[AlertType.MAINTENANCE]} 
                            onCheckedChange={() => handleFilterTypeChange(AlertType.MAINTENANCE)}
                          />
                          <label htmlFor="filter-maintenance" className="ml-2 text-sm">Manutenção</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="filter-engine" 
                            checked={filterTypes[AlertType.ENGINE]} 
                            onCheckedChange={() => handleFilterTypeChange(AlertType.ENGINE)}
                          />
                          <label htmlFor="filter-engine" className="ml-2 text-sm">Motor</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="filter-battery" 
                            checked={filterTypes[AlertType.BATTERY]} 
                            onCheckedChange={() => handleFilterTypeChange(AlertType.BATTERY)}
                          />
                          <label htmlFor="filter-battery" className="ml-2 text-sm">Bateria</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="filter-unauthorized" 
                            checked={filterTypes[AlertType.UNAUTHORIZED_ACCESS]} 
                            onCheckedChange={() => handleFilterTypeChange(AlertType.UNAUTHORIZED_ACCESS)}
                          />
                          <label htmlFor="filter-unauthorized" className="ml-2 text-sm">Acesso Não Autorizado</label>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="all" 
                onValueChange={(value) => setFilterStatus(value as "all" | "active" | "acknowledged")}
                className="mb-4"
              >
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="acknowledged">Resolvidos</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredAlerts && filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id} className={alert.acknowledged ? "opacity-60" : ""}>
                        <TableCell className="font-medium">
                          {getVehiclePlate(alert.vehicleId)}
                        </TableCell>
                        <TableCell>{getAlertTypeBadge(alert.type)}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {alert.description}
                        </TableCell>
                        <TableCell>{formatAlertTime(alert.createdAt)}</TableCell>
                        <TableCell>
                          {alert.acknowledged ? (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              <Check className="h-3 w-3 mr-1" />
                              Resolvido
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500">Ativo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewAlertDetails(alert)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {}}
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                Ver no Mapa
                              </DropdownMenuItem>
                              {!alert.acknowledged && (
                                <DropdownMenuItem
                                  onClick={() => handleAcknowledgeAlert(alert.id)}
                                  disabled={acknowledgeAlert.isPending}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Marcar como Resolvido
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Nenhum alerta encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Alert Detail Dialog */}
          <Dialog open={alertDetailDialog} onOpenChange={setAlertDetailDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {selectedAlert && getAlertIcon(selectedAlert.type)}
                  <span className="ml-2">Detalhes do Alerta</span>
                </DialogTitle>
                <DialogDescription>
                  Informações detalhadas sobre o alerta
                </DialogDescription>
              </DialogHeader>
              
              {selectedAlert && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Veículo</h4>
                    <p className="font-medium">{getVehiclePlate(selectedAlert.vehicleId)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                    <div>{getAlertTypeBadge(selectedAlert.type)}</div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
                    <p>{selectedAlert.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Horário</h4>
                    <p>{new Date(selectedAlert.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <div>
                      {selectedAlert.acknowledged ? (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Resolvido em {selectedAlert.acknowledgedAt ? new Date(selectedAlert.acknowledgedAt).toLocaleString() : 'N/A'}
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500">Ativo</Badge>
                      )}
                    </div>
                  </div>
                  
                  {selectedAlert.data && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Dados Adicionais</h4>
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-24">
                        {JSON.stringify(selectedAlert.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter className="sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => {}}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Button>
                
                {selectedAlert && !selectedAlert.acknowledged && (
                  <Button 
                    onClick={() => handleAcknowledgeAlert(selectedAlert.id)}
                    disabled={acknowledgeAlert.isPending}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar como Resolvido
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
