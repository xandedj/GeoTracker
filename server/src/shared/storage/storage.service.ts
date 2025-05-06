import { Injectable } from '@nestjs/common';
import { IStorage } from '../../../storage';
import { storage } from '../../../storage';

@Injectable()
export class StorageService implements IStorage {
  // We delegate all methods to the existing storage implementation
  
  // Users
  async getUserById(id: string) {
    return storage.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return storage.getUserByEmail(email);
  }

  async createUser(user: any) {
    return storage.createUser(user);
  }

  async updateUser(id: string, data: any) {
    return storage.updateUser(id, data);
  }

  async deleteUser(id: string) {
    return storage.deleteUser(id);
  }

  // Organizations
  async getOrganizationById(id: string) {
    return storage.getOrganizationById(id);
  }

  async getOrganizationsByAdminId(adminId: string) {
    return storage.getOrganizationsByAdminId(adminId);
  }

  async createOrganization(org: any) {
    return storage.createOrganization(org);
  }

  async updateOrganization(id: string, data: any) {
    return storage.updateOrganization(id, data);
  }

  async deleteOrganization(id: string) {
    return storage.deleteOrganization(id);
  }

  // Vehicles
  async getVehicleById(id: string) {
    return storage.getVehicleById(id);
  }

  async getVehiclesByOwnerId(ownerId: string) {
    return storage.getVehiclesByOwnerId(ownerId);
  }

  async getVehiclesByOrganizationId(organizationId: string) {
    return storage.getVehiclesByOrganizationId(organizationId);
  }

  async getAllVehicles() {
    return storage.getAllVehicles();
  }

  async createVehicle(vehicle: any) {
    return storage.createVehicle(vehicle);
  }

  async updateVehicle(id: string, data: any) {
    return storage.updateVehicle(id, data);
  }

  async deleteVehicle(id: string) {
    return storage.deleteVehicle(id);
  }

  async getVehicleWithLastLocation(id: string) {
    return storage.getVehicleWithLastLocation(id);
  }

  async getAllVehiclesWithLastLocation() {
    return storage.getAllVehiclesWithLastLocation();
  }

  // Tracking devices
  async getDeviceById(id: string) {
    return storage.getDeviceById(id);
  }

  async getDevicesByVehicleId(vehicleId: string) {
    return storage.getDevicesByVehicleId(vehicleId);
  }

  async createDevice(device: any) {
    return storage.createDevice(device);
  }

  async updateDevice(id: string, data: any) {
    return storage.updateDevice(id, data);
  }

  async deleteDevice(id: string) {
    return storage.deleteDevice(id);
  }
  
  // Location history
  async getLocationById(id: string) {
    return storage.getLocationById(id);
  }

  async getLocationsByDeviceId(deviceId: string, limit?: number) {
    return storage.getLocationsByDeviceId(deviceId, limit);
  }

  async getLocationsByVehicleId(vehicleId: string, limit?: number, startDate?: Date, endDate?: Date) {
    return storage.getLocationsByVehicleId(vehicleId, limit, startDate, endDate);
  }

  async getLastLocationByVehicleId(vehicleId: string) {
    return storage.getLastLocationByVehicleId(vehicleId);
  }

  async createLocation(location: any) {
    return storage.createLocation(location);
  }
  
  // Alerts
  async getAlertById(id: string) {
    return storage.getAlertById(id);
  }

  async getAlertsByVehicleId(vehicleId: string) {
    return storage.getAlertsByVehicleId(vehicleId);
  }

  async getActiveAlerts() {
    return storage.getActiveAlerts();
  }

  async getAllAlerts() {
    return storage.getAllAlerts();
  }

  async createAlert(alert: any) {
    return storage.createAlert(alert);
  }

  async acknowledgeAlert(id: string) {
    return storage.acknowledgeAlert(id);
  }

  async deleteAlert(id: string) {
    return storage.deleteAlert(id);
  }
  
  // Geofences
  async getGeofenceById(id: string) {
    return storage.getGeofenceById(id);
  }

  async getGeofencesByCreatorId(creatorId: string) {
    return storage.getGeofencesByCreatorId(creatorId);
  }

  async getGeofencesByOrganizationId(organizationId: string) {
    return storage.getGeofencesByOrganizationId(organizationId);
  }

  async getAllGeofences() {
    return storage.getAllGeofences();
  }

  async createGeofence(geofence: any) {
    return storage.createGeofence(geofence);
  }

  async updateGeofence(id: string, data: any) {
    return storage.updateGeofence(id, data);
  }

  async deleteGeofence(id: string) {
    return storage.deleteGeofence(id);
  }
  
  // Vehicle-Geofence relationship
  async assignVehicleToGeofence(vehicleId: string, geofenceId: string) {
    return storage.assignVehicleToGeofence(vehicleId, geofenceId);
  }

  async removeVehicleFromGeofence(vehicleId: string, geofenceId: string) {
    return storage.removeVehicleFromGeofence(vehicleId, geofenceId);
  }

  async getGeofencesByVehicleId(vehicleId: string) {
    return storage.getGeofencesByVehicleId(vehicleId);
  }

  async getVehiclesByGeofenceId(geofenceId: string) {
    return storage.getVehiclesByGeofenceId(geofenceId);
  }
  
  // Maintenance records
  async getMaintenanceRecordById(id: string) {
    return storage.getMaintenanceRecordById(id);
  }

  async getMaintenanceRecordsByVehicleId(vehicleId: string) {
    return storage.getMaintenanceRecordsByVehicleId(vehicleId);
  }

  async getAllMaintenanceRecords() {
    return storage.getAllMaintenanceRecords();
  }

  async createMaintenanceRecord(record: any) {
    return storage.createMaintenanceRecord(record);
  }

  async updateMaintenanceRecord(id: string, data: any) {
    return storage.updateMaintenanceRecord(id, data);
  }

  async deleteMaintenanceRecord(id: string) {
    return storage.deleteMaintenanceRecord(id);
  }
}