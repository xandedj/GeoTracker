import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { useVehicles } from "@/hooks/useVehicles";
import { MaintenanceType } from "@shared/schema";
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
  FileBarChart2,
  Search,
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Download,
  Car,
  Wrench,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dummyMaintenanceData = [
  {
    id: "1",
    vehicleId: "v1",
    vehiclePlate: "ABC1234",
    type: MaintenanceType.OIL_CHANGE,
    odometerReading: 25000,
    serviceDate: new Date(2023, 8, 15),
    description: "Troca de óleo e filtros",
    cost: 350.0,
    createdAt: new Date(2023, 8, 15),
  },
  {
    id: "2",
    vehicleId: "v2",
    vehiclePlate: "DEF5678",
    type: MaintenanceType.TIRE_ROTATION,
    odometerReading: 15000,
    serviceDate: new Date(2023, 9, 2),
    description: "Rodízio de pneus",
    cost: 120.0,
    createdAt: new Date(2023, 9, 2),
  },
  {
    id: "3",
    vehicleId: "v1",
    vehiclePlate: "ABC1234",
    type: MaintenanceType.INSPECTION,
    odometerReading: 30000,
    serviceDate: new Date(2023, 11, 10),
    description: "Revisão geral dos 30.000 km",
    cost: 950.0,
    createdAt: new Date(2023, 11, 10),
  },
];

const dummyUpcomingMaintenance = [
  {
    id: "4",
    vehicleId: "v3",
    vehiclePlate: "GHI9012",
    type: MaintenanceType.OIL_CHANGE,
    description: "Troca de óleo necessária em 500 km",
    dueDate: new Date(2023, 12, 15),
  },
  {
    id: "5",
    vehicleId: "v2",
    vehiclePlate: "DEF5678",
    type: MaintenanceType.INSPECTION,
    description: "Revisão dos 40.000 km",
    dueDate: new Date(2023, 12, 28),
  },
];

export default function MaintenancePage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addMaintenanceDialogOpen, setAddMaintenanceDialogOpen] = useState(false);
  const [maintenanceDetailDialogOpen, setMaintenanceDetailDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const { vehicles } = useVehicles();

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleViewDetails = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setMaintenanceDetailDialogOpen(true);
  };

  const filteredMaintenance = dummyMaintenanceData.filter((record) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      record.vehiclePlate.toLowerCase().includes(searchLower) ||
      record.description.toLowerCase().includes(searchLower) ||
      record.type.toLowerCase().includes(searchLower)
    );
  });

  const getMaintenanceTypeBadge = (type: string) => {
    switch (type) {
      case MaintenanceType.OIL_CHANGE:
        return <Badge className="bg-blue-500">Troca de Óleo</Badge>;
      case MaintenanceType.TIRE_ROTATION:
        return <Badge className="bg-green-500">Rodízio de Pneus</Badge>;
      case MaintenanceType.INSPECTION:
        return <Badge className="bg-purple-500">Inspeção</Badge>;
      case MaintenanceType.REPAIR:
        return <Badge className="bg-red-500">Reparo</Badge>;
      case MaintenanceType.GENERAL_SERVICE:
        return <Badge className="bg-amber-500">Serviço Geral</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="w-64 h-full bg-white">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="flex items-center">
                <FileBarChart2 className="text-primary-600 h-6 w-6 mr-2" />
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
          title="Manutenções"
          onMobileMenuToggle={toggleMobileSidebar}
        />

        {/* Content */}
        <div className="p-4 md:p-6">
          <Tabs defaultValue="history" className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <TabsList>
                <TabsTrigger value="history">Histórico</TabsTrigger>
                <TabsTrigger value="upcoming">Próximas Manutenções</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2 mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar manutenção..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setAddMaintenanceDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
            
            <TabsContent value="history" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Manutenções</CardTitle>
                  <CardDescription>
                    Registro de todas as manutenções realizadas nos veículos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Odômetro</TableHead>
                        <TableHead>Custo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaintenance.length > 0 ? (
                        filteredMaintenance.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.vehiclePlate}</TableCell>
                            <TableCell>{getMaintenanceTypeBadge(record.type)}</TableCell>
                            <TableCell>{record.serviceDate.toLocaleDateString()}</TableCell>
                            <TableCell>{record.odometerReading} km</TableCell>
                            <TableCell>{formatCurrency(record.cost)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleViewDetails(record)}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            Nenhum registro de manutenção encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upcoming" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Manutenções</CardTitle>
                  <CardDescription>
                    Manutenções programadas e recomendações para seus veículos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dummyUpcomingMaintenance.map((item) => (
                      <Card key={item.id} className="border border-amber-200 bg-amber-50">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mr-3">
                              <Wrench className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{item.vehiclePlate}</h3>
                                <span className="text-xs text-amber-600">
                                  {item.dueDate.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="mt-3 flex justify-end">
                                <Button variant="outline" size="sm" className="text-xs h-7">
                                  Agendar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios de Manutenção</CardTitle>
                  <CardDescription>
                    Gere relatórios detalhados sobre as manutenções dos veículos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="text-base">Relatório por Veículo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Gere um relatório detalhado de todas as manutenções realizadas em um veículo específico.
                        </p>
                        <div className="flex flex-col space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Veículo</label>
                            <select className="w-full rounded-md border border-gray-300 p-2">
                              <option value="">Selecione um veículo</option>
                              {vehicles?.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                  {vehicle.plate} - {vehicle.brand} {vehicle.model}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex justify-end">
                            <Button>
                              <Download className="h-4 w-4 mr-2" />
                              Gerar Relatório
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border">
                      <CardHeader>
                        <CardTitle className="text-base">Relatório de Custos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                          Gere um relatório de custos de manutenção por período.
                        </p>
                        <div className="flex flex-col space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Data Inicial</label>
                              <Input type="date" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Data Final</label>
                              <Input type="date" />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button>
                              <Download className="h-4 w-4 mr-2" />
                              Gerar Relatório
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Maintenance Detail Dialog */}
      <Dialog open={maintenanceDetailDialogOpen} onOpenChange={setMaintenanceDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Detalhes da Manutenção
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre o registro de manutenção
            </DialogDescription>
          </DialogHeader>
          
          {selectedMaintenance && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Veículo</h4>
                <p className="font-medium">{selectedMaintenance.vehiclePlate}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                <div>{getMaintenanceTypeBadge(selectedMaintenance.type)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Data do Serviço</h4>
                <p>{selectedMaintenance.serviceDate.toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Odômetro</h4>
                <p>{selectedMaintenance.odometerReading} km</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
                <p>{selectedMaintenance.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Custo</h4>
                <p className="font-semibold">{formatCurrency(selectedMaintenance.cost)}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Gerar PDF
            </Button>
            
            <Button variant="outline" onClick={() => setMaintenanceDetailDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Maintenance Dialog */}
      <Dialog open={addMaintenanceDialogOpen} onOpenChange={setAddMaintenanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Registro de Manutenção</DialogTitle>
            <DialogDescription>
              Registre uma nova manutenção realizada em um veículo
            </DialogDescription>
          </DialogHeader>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Veículo</label>
              <select className="w-full rounded-md border border-gray-300 p-2">
                <option value="">Selecione um veículo</option>
                {vehicles?.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Manutenção</label>
              <select className="w-full rounded-md border border-gray-300 p-2">
                <option value="">Selecione o tipo</option>
                <option value={MaintenanceType.OIL_CHANGE}>Troca de Óleo</option>
                <option value={MaintenanceType.TIRE_ROTATION}>Rodízio de Pneus</option>
                <option value={MaintenanceType.INSPECTION}>Inspeção</option>
                <option value={MaintenanceType.REPAIR}>Reparo</option>
                <option value={MaintenanceType.GENERAL_SERVICE}>Serviço Geral</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data do Serviço</label>
              <Input type="date" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Odômetro (km)</label>
              <Input type="number" placeholder="0" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Input placeholder="Descreva o serviço realizado" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Custo (R$)</label>
              <Input type="number" step="0.01" placeholder="0,00" />
            </div>
          </form>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMaintenanceDialogOpen(false)}>
              Cancelar
            </Button>
            <Button>
              Adicionar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
