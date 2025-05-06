import { Request, Response } from "express";
import { storage } from "../storage";
import { insertAlertSchema } from "@shared/schema";

// Get all alerts
export async function getAllAlerts(req: Request, res: Response) {
  try {
    const alerts = await storage.getAllAlerts();
    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error getting all alerts:", error);
    res.status(500).json({ message: "An error occurred while retrieving alerts" });
  }
}

// Create a new alert
export async function createAlert(req: Request, res: Response) {
  try {
    // Validate request data
    const result = insertAlertSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
    }

    // Extract alert data from the validated request
    const alertData = result.data;

    // Create the alert
    const alert = await storage.createAlert(alertData);

    // Emit the alert via WebSocket if available
    if (req.app.locals.wss) {
      req.app.locals.wss.clients.forEach((client: any) => {
        if (client.readyState === 1) { // 1 = WebSocket.OPEN
          client.send(JSON.stringify({
            type: 'NEW_ALERT',
            data: alert
          }));
        }
      });
    }

    // Return the created alert
    res.status(201).json(alert);
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "An error occurred while creating the alert" });
  }
}

// Acknowledge an alert
export async function acknowledgeAlert(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the alert exists
    const alert = await storage.getAlertById(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // Acknowledge the alert
    const updatedAlert = await storage.acknowledgeAlert(id);
    if (!updatedAlert) {
      return res.status(500).json({ message: "Failed to acknowledge alert" });
    }

    // Emit the acknowledged alert via WebSocket if available
    if (req.app.locals.wss) {
      req.app.locals.wss.clients.forEach((client: any) => {
        if (client.readyState === 1) { // 1 = WebSocket.OPEN
          client.send(JSON.stringify({
            type: 'ALERT_ACKNOWLEDGED',
            data: updatedAlert
          }));
        }
      });
    }

    // Return the updated alert
    res.status(200).json(updatedAlert);
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    res.status(500).json({ message: "An error occurred while acknowledging the alert" });
  }
}

// Delete an alert
export async function deleteAlert(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the alert exists
    const alert = await storage.getAlertById(id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // Delete the alert
    const success = await storage.deleteAlert(id);
    if (success) {
      res.status(200).json({ message: "Alert deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete alert" });
    }
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ message: "An error occurred while deleting the alert" });
  }
}
