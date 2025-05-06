import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Car,
  Map,
  Bell,
  Shield,
  Settings,
  Calendar,
  LogOut,
  FileBarChart2,
  ChevronRight,
  Shapes,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const NavItem = ({
    href,
    icon: Icon,
    label,
    notification,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    notification?: boolean;
  }) => {
    const basePath = href.split("/")[1];
    const isActive = window.location.pathname === href || 
                   (window.location.pathname.startsWith(`/${basePath}/`) && basePath !== "");

    return (
      <Link href={href}>
        <a
          className={cn(
            "flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1",
            isActive
              ? "bg-primary-50 text-primary-700"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-primary-600" : "text-gray-500")} />
          {label}
          {notification && (
            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          <ChevronRight
            className={cn(
              "h-4 w-4 ml-auto",
              isActive ? "text-primary-600" : "text-gray-400"
            )}
          />
        </a>
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <FileBarChart2 className="text-primary-600 h-6 w-6 mr-2" />
          <span className="text-lg font-medium">TrackerGeo</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          <NavItem href="/" icon={Home} label="Dashboard" />
          <NavItem href="/vehicles" icon={Car} label="Veículos" />
          <NavItem href="/map" icon={Map} label="Mapa" />
          <NavItem href="/alerts" icon={Bell} label="Alertas" notification={true} />
          <NavItem href="/geofences" icon={Shapes} label="Cercas Virtuais" />
          <NavItem href="/maintenance" icon={Calendar} label="Manutenção" />
          <NavItem href="/settings" icon={Settings} label="Configurações" />
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3 font-medium">
            {user?.fullName?.[0] || "U"}
          </div>
          <div>
            <div className="font-medium">{user?.fullName || "Usuário"}</div>
            <div className="text-sm text-gray-500">{user?.email || ""}</div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}