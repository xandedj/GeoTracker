import { Request, Response } from "express";
import { storage } from "../storage";
import { insertMaintenanceRecordSchema } from "@shared/schema";

// Get all maintenance records
export async function getAllMaintenanceRecords(req: Request, res: Response) {
  try {
    const records = await storage.getAllMaintenanceRecords();
    res.status(200).json(records);
  } catch (error) {
    console.error("Error getting all maintenance records:", error);
    res.status(500).json({ message: "An error occurred while retrieving maintenance records" });
  }
}

// Get maintenance records for a specific vehicle
export async function getVehicleMaintenanceRecords(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the vehicle exists
    const vehicle = await storage.getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Get maintenance records for the vehicle
    const records = await storage.getMaintenanceRecordsByVehicleId(id);
    res.status(200).json(records);
  } catch (error) {
    console.error("Error getting vehicle maintenance records:", error);
    res.status(500).json({ message: "An error occurred while retrieving vehicle maintenance records" });
  }
}

// Create a new maintenance record
export async function createMaintenanceRecord(req: Request, res: Response) {
  try {
    // Validate request data
    const result = insertMaintenanceRecordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    // Extract maintenance record data from the validated request
    const recordData = result.data;

    // Check if the vehicle exists
    const vehicle = await storage.getVehicleById(recordData.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Create the maintenance record
    const record = await storage.createMaintenanceRecord(recordData);

    // Return the created record
    res.status(201).json(record);
  } catch (error) {
    console.error("Error creating maintenance record:", error);
    res.status(500).json({ message: "An error occurred while creating the maintenance record" });
  }
}

// Update a maintenance record
export async function updateMaintenanceRecord(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // First check if the maintenance record exists
    const existingRecord = await storage.getMaintenanceRecordById(id);
    if (!existingRecord) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    // Validate request data
    const result = insertMaintenanceRecordSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    // Extract maintenance record data from the validated request
    const recordData = result.data;

    // If vehicleId is being updated, check if the vehicle exists
    if (recordData.vehicleId && recordData.vehicleId !== existingRecord.vehicleId) {
      const vehicle = await storage.getVehicleById(recordData.vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
    }

    // Update the maintenance record
    const updatedRecord = await storage.updateMaintenanceRecord(id, recordData);

    // Return the updated record
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    res.status(500).json({ message: "An error occurred while updating the maintenance record" });
  }
}

// Delete a maintenance record
export async function deleteMaintenanceRecord(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // First check if the maintenance record exists
    const existingRecord = await storage.getMaintenanceRecordById(id);
    if (!existingRecord) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    // Delete the maintenance record
    const success = await storage.deleteMaintenanceRecord(id);
    if (success) {
      res.status(200).json({ message: "Maintenance record deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete maintenance record" });
    }
  } catch (error) {
    console.error("Error deleting maintenance record:", error);
    res.status(500).json({ message: "An error occurred while deleting the maintenance record" });
  }
}
