import { Request, Response } from "express";
import { storage } from "../storage";
import { insertVehicleSchema } from "@shared/schema";

// Get all vehicles with their last known location
export async function getAllVehicles(req: Request, res: Response) {
  try {
    const vehiclesWithLocation = await storage.getAllVehiclesWithLastLocation();
    res.status(200).json(vehiclesWithLocation);
  } catch (error) {
    console.error("Error getting all vehicles:", error);
    res.status(500).json({ message: "An error occurred while retrieving vehicles" });
  }
}

// Get a vehicle by ID with its last known location
export async function getVehicleById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    try {
      const vehicleWithLocation = await storage.getVehicleWithLastLocation(id);
      res.status(200).json(vehicleWithLocation);
    } catch (error) {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    console.error("Error getting vehicle by ID:", error);
    res.status(500).json({ message: "An error occurred while retrieving the vehicle" });
  }
}

// Create a new vehicle
export async function createVehicle(req: Request, res: Response) {
  try {
    // Validate request data
    const result = insertVehicleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    // Extract vehicle data from the validated request
    const vehicleData = result.data;

    // Create the vehicle
    const vehicle = await storage.createVehicle(vehicleData);

    // Return the created vehicle
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ message: "An error occurred while creating the vehicle" });
  }
}

// Update a vehicle
export async function updateVehicle(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // First check if the vehicle exists
    const existingVehicle = await storage.getVehicleById(id);
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Validate request data
    const result = insertVehicleSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    // Extract vehicle data from the validated request
    const vehicleData = result.data;

    // Update the vehicle
    const updatedVehicle = await storage.updateVehicle(id, vehicleData);

    // Return the updated vehicle
    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "An error occurred while updating the vehicle" });
  }
}

// Delete a vehicle
export async function deleteVehicle(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // First check if the vehicle exists
    const existingVehicle = await storage.getVehicleById(id);
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Delete the vehicle
    const success = await storage.deleteVehicle(id);
    if (success) {
      res.status(200).json({ message: "Vehicle deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "An error occurred while deleting the vehicle" });
  }
}
