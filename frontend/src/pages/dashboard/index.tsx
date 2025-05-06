import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import StatCard from "@/components/dashboard/StatCard";
import TrackingMap from "@/components/dashboard/TrackingMap";
import VehicleStatusList from "@/components/dashboard/VehicleStatusList";
import AlertsList from "@/components/dashboard/AlertsList";
import ReportCard from "@/components/dashboard/ReportCard";
import { useVehicles } from "@/hooks/useVehicles";
import {
  Car,
  Route,
  ParkingMeter,
  AlertTriangle,
  BarChart,
  FileText,
  Wrench,
} from "lucide-react";
import { VehicleStatus } from "@shared/schema";

export default function DashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { vehicles, isLoading } = useVehicles();

  const getTotalVehicles = () => {
    return isLoading ? "-" : vehicles ? vehicles.length : 0;
  };

  const getActiveVehicles = () => {
    if (isLoading || !vehicles) return "-";
    return vehicles.filter((v) => v.status === VehicleStatus.ACTIVE).length;
  };

  const getParkedVehicles = () => {
    if (isLoading || !vehicles) return "-";
    return vehicles.filter((v) => v.status === VehicleStatus.PARKED).length;
  };

  const getActiveAlertsCount = () => {
    // In a real implementation, this would come from the alerts hook
    return 3;
  };

  const getActivePercentage = () => {
    if (isLoading || !vehicles || vehicles.length === 0) return "-";
    const active = vehicles.filter(
      (v) => v.status === VehicleStatus.ACTIVE
    ).length;
    return `${Math.round((active / vehicles.length) * 100)}% da frota`;
  };

  const getParkedPercentage = () => {
    if (isLoading || !vehicles || vehicles.length === 0) return "-";
    const parked = vehicles.filter(
      (v) => v.status === VehicleStatus.PARKED
    ).length;
    return `${Math.round((parked / vehicles.length) * 100)}% da frota`;
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

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
          title="Dashboard"
          onMobileMenuToggle={toggleMobileSidebar}
        />

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total de Veículos"
              value={getTotalVehicles()}
              icon={Car}
              iconColor="text-primary-600"
              iconBgColor="bg-primary-100"
              trend={{
                value: "2",
                label: "desde o mês passado",
                positive: true,
              }}
            />
            <StatCard
              title="Em Movimento"
              value={getActiveVehicles()}
              icon={Route}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
              trend={{
                value: getActivePercentage(),
                label: "",
              }}
            />
            <StatCard
              title="Estacionados"
              value={getParkedVehicles()}
              icon={ParkingMeter}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              trend={{
                value: getParkedPercentage(),
                label: "",
              }}
            />
            <StatCard
              title="Alertas Ativos"
              value={getActiveAlertsCount()}
              icon={AlertTriangle}
              iconColor="text-red-600"
              iconBgColor="bg-red-100"
            />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Map section - takes 2/3 width on large screens */}
            <div className="lg:col-span-2">
              <TrackingMap />
            </div>

            {/* Right column - takes 1/3 width on large screens */}
            <div className="lg:col-span-1 space-y-6">
              <VehicleStatusList />
              <AlertsList />
            </div>
          </div>

          {/* Bottom row with report cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mileage Report */}
            <ReportCard
              title="Quilometragem (últimos 7 dias)"
              icon={BarChart}
              exportable
              onExport={() => console.log("Export mileage report")}
            >
              <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                <div className="flex items-end h-32 space-x-3 px-4">
                  <div className="w-8 bg-primary-200 rounded-t" style={{ height: "60%" }}></div>
                  <div className="w-8 bg-primary-300 rounded-t" style={{ height: "40%" }}></div>
                  <div className="w-8 bg-primary-400 rounded-t" style={{ height: "75%" }}></div>
                  <div className="w-8 bg-primary-500 rounded-t" style={{ height: "90%" }}></div>
                  <div className="w-8 bg-primary-600 rounded-t" style={{ height: "50%" }}></div>
                  <div className="w-8 bg-primary-700 rounded-t" style={{ height: "65%" }}></div>
                  <div className="w-8 bg-primary-800 rounded-t" style={{ height: "80%" }}></div>
                </div>
              </div>
              <div className="mt-3 text-center text-sm text-gray-500">
                Total: 1.582 km
              </div>
            </ReportCard>

            {/* Fuel Consumption */}
            <ReportCard
              title="Consumo de Combustível"
              icon={FileText}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500 mb-1">Média</div>
                  <div className="text-xl font-semibold">10.2 km/l</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500 mb-1">Total</div>
                  <div className="text-xl font-semibold">845 l</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500 mb-1">Mais eficiente</div>
                  <div className="text-lg font-medium text-green-600">ABC1234</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500 mb-1">Menos eficiente</div>
                  <div className="text-lg font-medium text-red-600">GHI9012</div>
                </div>
              </div>
            </ReportCard>

            {/* Upcoming Maintenance */}
            <ReportCard
              title="Manutenções Programadas"
              icon={Wrench}
              exportable
              onExport={() => console.log("View all maintenance")}
            >
              <div className="space-y-3">
                <div className="flex items-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg mr-3">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">DEF5678</span>
                      <span className="text-xs text-red-600">Em 2 dias</span>
                    </div>
                    <p className="text-xs text-gray-600">Troca de óleo e filtros</p>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 border border-gray-200 rounded">
                  <div className="p-2 bg-gray-100 text-gray-700 rounded-lg mr-3">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">ABC1234</span>
                      <span className="text-xs text-gray-600">Em 15 dias</span>
                    </div>
                    <p className="text-xs text-gray-600">Revisão de 30.000 km</p>
                  </div>
                </div>
              </div>
            </ReportCard>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
