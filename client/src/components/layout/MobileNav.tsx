import { Link } from "wouter";
import {
  LayoutDashboard,
  Map,
  Car,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
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
            "flex flex-col items-center p-2",
            isActive ? "text-primary-600" : "text-gray-500"
          )}
        >
          <div className="relative">
            <Icon className="text-xl h-6 w-6" />
            {notification && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
          <span className="text-xs mt-1">{label}</span>
        </a>
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10",
        className
      )}
    >
      <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
      <NavItem href="/map" icon={Map} label="Mapa" />
      <NavItem href="/vehicles" icon={Car} label="Veículos" />
      <NavItem
        href="/alerts"
        icon={AlertTriangle}
        label="Alertas"
        notification={true}
      />
      <NavItem href="/menu" icon={MoreHorizontal} label="Mais" />
    </div>
  );
}
