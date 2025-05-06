import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ReportCardProps {
  title: string;
  icon?: LucideIcon;
  exportable?: boolean;
  onExport?: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function ReportCard({
  title,
  icon: Icon,
  exportable,
  onExport,
  className,
  children,
}: ReportCardProps) {
  return (
    <Card className={cn("border border-gray-200", className)}>
      <CardHeader className="p-4 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium text-gray-800 flex items-center">
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {title}
        </CardTitle>
        {exportable && (
          <Button
            variant="link"
            className="text-primary-600 hover:text-primary-700 text-sm p-0"
            onClick={onExport}
          >
            Exportar
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
