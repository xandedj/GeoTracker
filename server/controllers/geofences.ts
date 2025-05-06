import { Request, Response } from "express";
import { storage } from "../storage";
import { insertGeofenceSchema } from "@shared/schema";

// Get all geofences
export async function getAllGeofences(req: Request, res: Response) {
  try {
    const geofences = await storage.getAllGeofences();
    res.status(200).json(geofences);
  } catch (error) {
    console.error("Error getting all geofences:", error);
    res.status(500).json({ message: "An error occurred while retrieving geofences" });
  }
}

// Create a new geofence
export async function createGeofence(req: Request, res: Response) {
  try {
    // Validate request data
    const result = insertGeofenceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    // Extract geofence data from the validated request
    const geofenceData = result.data;

    // Create the geofence
    const geofence = await storage.createGeofence(geofenceData);

    // Return the created geofence
    res.status(201).json(geofence);
  } catch (error) {
    console.error("Error creating geofence:", error);
    res.status(500).json({ message: "An error occurred while creating the geofence" });
  }
}

// Update a geofence
export async function updateGeofence(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // First check if the geofence exists
    const existingGeofence = await storage.getGeofenceById(id);
    if (!existingGeofence) {
      return res.status(404).json({ message: "Geofence not found" });
    }

    // Validate request data
    const result = insertGeofenceSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    // Extract geofence data from the validated request
    const geofenceData = result.data;

    // Update the geofence
    const updatedGeofence = await storage.updateGeofence(id, geofenceData);

    // Return the updated geofence
    res.status(200).json(updatedGeofence);
  } catch (error) {
    console.error("Error updating geofence:", error);
    res.status(500).json({ message: "An error occurred while updating the geofence" });
  }
}

// Delete a geofence
export async function deleteGeofence(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // First check if the geofence exists
    const existingGeofence = await storage.getGeofenceById(id);
    if (!existingGeofence) {
      return res.status(404).json({ message: "Geofence not found" });
    }

    // Delete the geofence
    const success = await storage.deleteGeofence(id);
    if (success) {
      res.status(200).json({ message: "Geofence deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete geofence" });
    }
  } catch (error) {
    console.error("Error deleting geofence:", error);
    res.status(500).json({ message: "An error occurred while deleting the geofence" });
  }
}

// Assign a vehicle to a geofence
export async function assignVehicleToGeofence(req: Request, res: Response) {
  try {
    const { geofenceId, vehicleId } = req.params;

    // Check if both vehicle and geofence exist
    const vehicle = await storage.getVehicleById(vehicleId);
    const geofence = await storage.getGeofenceById(geofenceId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (!geofence) {
      return res.status(404).json({ message: "Geofence not found" });
    }

    // Assign the vehicle to the geofence
    const success = await storage.assignVehicleToGeofence(vehicleId, geofenceId);
    if (success) {
      res.status(200).json({ message: "Vehicle assigned to geofence successfully" });
    } else {
      res.status(500).json({ message: "Failed to assign vehicle to geofence" });
    }
  } catch (error) {
    console.error("Error assigning vehicle to geofence:", error);
    res.status(500).json({ message: "An error occurred while assigning vehicle to geofence" });
  }
}

// Remove a vehicle from a geofence
export async function removeVehicleFromGeofence(req: Request, res: Response) {
  try {
    const { geofenceId, vehicleId } = req.params;

    // Check if both vehicle and geofence exist
    const vehicle = await storage.getVehicleById(vehicleId);
    const geofence = await storage.getGeofenceById(geofenceId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (!geofence) {
      return res.status(404).json({ message: "Geofence not found" });
    }

    // Remove the vehicle from the geofence
    const success = await storage.removeVehicleFromGeofence(vehicleId, geofenceId);
    if (success) {
      res.status(200).json({ message: "Vehicle removed from geofence successfully" });
    } else {
      res.status(500).json({ message: "Failed to remove vehicle from geofence" });
    }
  } catch (error) {
    console.error("Error removing vehicle from geofence:", error);
    res.status(500).json({ message: "An error occurred while removing vehicle from geofence" });
  }
}
