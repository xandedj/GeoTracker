import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authMiddleware } from "./middleware/auth";

// Controllers
import * as authController from "./controllers/auth";
import * as vehiclesController from "./controllers/vehicles";
import * as alertsController from "./controllers/alerts";
import * as geofencesController from "./controllers/geofences";
import * as trackingController from "./controllers/tracking";
import * as maintenanceController from "./controllers/maintenance";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Authentication routes
  app.post("/api/auth/register", authController.register);
  app.post("/api/auth/login", authController.login);
  app.post("/api/auth/logout", authController.logout);
  app.get("/api/auth/me", authMiddleware, authController.getCurrentUser);

  // Vehicles routes
  app.get("/api/vehicles", authMiddleware, vehiclesController.getAllVehicles);
  app.get("/api/vehicles/:id", authMiddleware, vehiclesController.getVehicleById);
  app.post("/api/vehicles", authMiddleware, vehiclesController.createVehicle);
  app.patch("/api/vehicles/:id", authMiddleware, vehiclesController.updateVehicle);
  app.delete("/api/vehicles/:id", authMiddleware, vehiclesController.deleteVehicle);

  // Tracking and location routes
  app.get("/api/vehicles/:id/locations", authMiddleware, trackingController.getLocationHistory);
  app.get("/api/vehicles/:id/locations/last", authMiddleware, trackingController.getLastLocation);
  app.post("/api/devices/:id/locations", trackingController.addLocationUpdate);

  // Alerts routes
  app.get("/api/alerts", authMiddleware, alertsController.getAllAlerts);
  app.post("/api/alerts", authMiddleware, alertsController.createAlert);
  app.post("/api/alerts/:id/acknowledge", authMiddleware, alertsController.acknowledgeAlert);
  app.delete("/api/alerts/:id", authMiddleware, alertsController.deleteAlert);

  // Geofences routes
  app.get("/api/geofences", authMiddleware, geofencesController.getAllGeofences);
  app.post("/api/geofences", authMiddleware, geofencesController.createGeofence);
  app.patch("/api/geofences/:id", authMiddleware, geofencesController.updateGeofence);
  app.delete("/api/geofences/:id", authMiddleware, geofencesController.deleteGeofence);
  app.post("/api/geofences/:geofenceId/vehicles/:vehicleId", authMiddleware, geofencesController.assignVehicleToGeofence);
  app.delete("/api/geofences/:geofenceId/vehicles/:vehicleId", authMiddleware, geofencesController.removeVehicleFromGeofence);

  // Maintenance routes
  app.get("/api/maintenance", authMiddleware, maintenanceController.getAllMaintenanceRecords);
  app.get("/api/vehicles/:id/maintenance", authMiddleware, maintenanceController.getVehicleMaintenanceRecords);
  app.post("/api/maintenance", authMiddleware, maintenanceController.createMaintenanceRecord);
  app.patch("/api/maintenance/:id", authMiddleware, maintenanceController.updateMaintenanceRecord);
  app.delete("/api/maintenance/:id", authMiddleware, maintenanceController.deleteMaintenanceRecord);

  return httpServer;
}
