import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { WebSocketProvider } from "@/context/WebSocketContext";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import VehiclesPage from "@/pages/vehicles";
import VehicleDetailsPage from "@/pages/vehicles/details";
import MapPage from "@/pages/map";
import AlertsPage from "@/pages/alerts";
import GeofencesPage from "@/pages/geofences";
import MaintenancePage from "@/pages/maintenance";
import SettingsPage from "@/pages/settings";
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/vehicles">
        <ProtectedRoute>
          <VehiclesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/vehicles/:id">
        {(params) => (
          <ProtectedRoute>
            <VehicleDetailsPage id={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/map">
        <ProtectedRoute>
          <MapPage />
        </ProtectedRoute>
      </Route>
      <Route path="/alerts">
        <ProtectedRoute>
          <AlertsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/geofences">
        <ProtectedRoute>
          <GeofencesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/maintenance">
        <ProtectedRoute>
          <MaintenancePage />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
