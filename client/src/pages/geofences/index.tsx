import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import GeofenceForm from "@/components/geofences/GeofenceForm";
import { useGeofences } from "@/hooks/useGeofences";
import { useVehicles } from "@/hooks/useVehicles";
import { GeofenceType, InsertGeofence } from "@shared/schema";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ShapesIcon,
  Search,
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GeofencesPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addGeofenceDialogOpen, setAddGeofenceDialogOpen] = useState(false);
  const [editGeofenceDialogOpen, setEditGeofenceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGeofence, setSelectedGeofence] = useState<any>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const { geofences, isLoading, createGeofence, updateGeofence, deleteGeofence } = useGeofences();
  const { vehicles } = useVehicles();

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleAddGeofence = async (data: InsertGeofence) => {
    await createGeofence.mutateAsync(data);
    setAddGeofenceDialogOpen(false);
  };

  const handleEditGeofence = async (data: InsertGeofence) => {
    if (selectedGeofence) {
      await updateGeofence.mutateAsync({ id: selectedGeofence.id, data });
      setEditGeofenceDialogOpen(false);
      setSelectedGeofence(null);
    }
  };

  const handleDeleteGeofence = async () => {
    if (selectedGeofence) {
      await deleteGeofence.mutateAsync(selectedGeofence.id);
      setDeleteDialogOpen(false);
      setSelectedGeofence(null);
    }
  };

  const handleEditClick = (geofence: any) => {
    setSelectedGeofence(geofence);
    setEditGeofenceDialogOpen(true);
  };

  const handleDeleteClick = (geofence: any) => {
    setSelectedGeofence(geofence);
    setDeleteDialogOpen(true);
  };

  const handleViewOnMap = (geofence: any) => {
    setSelectedGeofence(geofence);
    setMapDialogOpen(true);
  };

  const filteredGeofences = geofences?.filter((geofence) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      geofence.name.toLowerCase().includes(searchLower)
    );
  });

  const getGeofenceTypeBadge = (type: string) => {
    switch (type) {
      case GeofenceType.CIRCLE:
        return <Badge>Círculo</Badge>;
      case GeofenceType.POLYGON:
        return <Badge>Polígono</Badge>;
      case GeofenceType.RECTANGLE:
        return <Badge>Retângulo</Badge>;
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
                <ShapesIcon className="text-primary-600 h-6 w-6 mr-2" />
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
          title="Cercas Virtuais"
          onMobileMenuToggle={toggleMobileSidebar}
        />

        {/* Content */}
        <div className="p-4 md:p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Cercas Virtuais</CardTitle>
                <CardDescription>
                  Crie e gerencie cercas virtuais para monitorar seus veículos
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar cerca virtual..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setAddGeofenceDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Veículos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : filteredGeofences && filteredGeofences.length > 0 ? (
                    filteredGeofences.map((geofence) => (
                      <TableRow key={geofence.id}>
                        <TableCell className="font-medium">
                          {geofence.name}
                        </TableCell>
                        <TableCell>{getGeofenceTypeBadge(geofence.type)}</TableCell>
                        <TableCell>
                          {new Date(geofence.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">0 veículos</Badge>
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
                                onClick={() => handleViewOnMap(geofence)}
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                Ver no mapa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(geofence)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(geofence)}
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
                      <TableCell colSpan={5} className="text-center py-4">
                        Nenhuma cerca virtual encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Add Geofence Dialog */}
          <Dialog open={addGeofenceDialogOpen} onOpenChange={setAddGeofenceDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Cerca Virtual</DialogTitle>
                <DialogDescription>
                  Crie uma nova cerca virtual para monitorar seus veículos
                </DialogDescription>
              </DialogHeader>
              <GeofenceForm
                onSubmit={handleAddGeofence}
                isSubmitting={createGeofence.isPending}
                mode="create"
              />
            </DialogContent>
          </Dialog>

          {/* Edit Geofence Dialog */}
          <Dialog open={editGeofenceDialogOpen} onOpenChange={setEditGeofenceDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar Cerca Virtual</DialogTitle>
                <DialogDescription>
                  Modifique as configurações da cerca virtual
                </DialogDescription>
              </DialogHeader>
              <GeofenceForm
                onSubmit={handleEditGeofence}
                initialData={selectedGeofence}
                isSubmitting={updateGeofence.isPending}
                mode="edit"
              />
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Cerca Virtual</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta cerca virtual? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteGeofence}
                  disabled={deleteGeofence.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteGeofence.isPending ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Map View Dialog */}
          <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
            <DialogContent className="sm:max-w-[700px] sm:h-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {selectedGeofence?.name}
                </DialogTitle>
                <DialogDescription>
                  Visualização da cerca virtual no mapa
                </DialogDescription>
              </DialogHeader>
              
              {selectedGeofence && (
                <div className="h-96 bg-gray-100 rounded-md flex items-center justify-center">
                  {selectedGeofence.type === GeofenceType.CIRCLE && selectedGeofence.coordinates.center && (
                    <iframe
                      className="w-full h-full rounded-md"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        selectedGeofence.coordinates.center.lng - 0.05
                      },${selectedGeofence.coordinates.center.lat - 0.05},${
                        selectedGeofence.coordinates.center.lng + 0.05
                      },${
                        selectedGeofence.coordinates.center.lat + 0.05
                      }&layer=mapnik&marker=${selectedGeofence.coordinates.center.lat},${
                        selectedGeofence.coordinates.center.lng
                      }`}
                    ></iframe>
                  )}
                  
                  {selectedGeofence.type === GeofenceType.RECTANGLE && selectedGeofence.coordinates.bounds && (
                    <div className="text-center">
                      <p>Retângulo: Sudoeste ({selectedGeofence.coordinates.bounds.southWest.lat.toFixed(6)}, {selectedGeofence.coordinates.bounds.southWest.lng.toFixed(6)}) até Nordeste ({selectedGeofence.coordinates.bounds.northEast.lat.toFixed(6)}, {selectedGeofence.coordinates.bounds.northEast.lng.toFixed(6)})</p>
                    </div>
                  )}
                  
                  {selectedGeofence.type === GeofenceType.POLYGON && selectedGeofence.coordinates.points && (
                    <div className="text-center">
                      <p>Polígono com {selectedGeofence.coordinates.points.length} pontos</p>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setMapDialogOpen(false)}>
                  Fechar
                </Button>
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
