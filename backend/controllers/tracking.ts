import { Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";

// Get location history for a vehicle
export async function getLocationHistory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const querySchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
      endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    });

    // Validate and parse query parameters
    const result = querySchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid query parameters", errors: result.error.format() });
    }

    const { limit, startDate, endDate } = result.data;

    // Check if the vehicle exists
    const vehicle = await storage.getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Get location history for the vehicle
    const locationHistory = await storage.getLocationsByVehicleId(id, limit, startDate, endDate);

    // Return the location history
    res.status(200).json(locationHistory);
  } catch (error) {
    console.error("Error getting location history:", error);
    res.status(500).json({ message: "An error occurred while retrieving location history" });
  }
}

// Get the last known location for a vehicle
export async function getLastLocation(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the vehicle exists
    const vehicle = await storage.getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Get the last known location for the vehicle
    const lastLocation = await storage.getLastLocationByVehicleId(id);
    if (!lastLocation) {
      return res.status(404).json({ message: "No location data found for this vehicle" });
    }

    // Return the last location
    res.status(200).json(lastLocation);
  } catch (error) {
    console.error("Error getting last location:", error);
    res.status(500).json({ message: "An error occurred while retrieving the last location" });
  }
}

// Add a new location update for a tracking device
export async function addLocationUpdate(req: Request, res: Response) {
  try {
    const { id } = req.params; // Device ID

    // Validate request data
    const locationSchema = z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      speed: z.number().optional(),
      heading: z.number().optional(),
      accuracy: z.number().optional(),
      metadata: z.record(z.any()).optional(),
    });

    const result = locationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid location data", errors: result.error.format() });
    }

    // Check if the device exists
    const device = await storage.getDeviceById(id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Extract location data from the validated request
    const locationData = result.data;

    // Create the location record
    const location = await storage.createLocation({
      deviceId: id,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      speed: locationData.speed,
      heading: locationData.heading,
      accuracy: locationData.accuracy,
      metadata: locationData.metadata,
    });

    // Return the created location
    res.status(201).json(location);
  } catch (error) {
    console.error("Error adding location update:", error);
    res.status(500).json({ message: "An error occurred while adding the location update" });
  }
}
