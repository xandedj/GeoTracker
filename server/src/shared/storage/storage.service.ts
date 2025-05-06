import { Injectable } from '@nestjs/common';
import { storage, IStorage } from '../../../storage';

@Injectable()
export class StorageService implements IStorage {
  // Pass through all storage methods to the existing storage implementation
  
  // Users
  getUserById(id: string) {
    return storage.getUserById(id);
  }
  
  getUserByEmail(email: string) {
    return storage.getUserByEmail(email);
  }
  
  createUser(user: any) {
    return storage.createUser(user);
  }
  
  updateUser(id: string, data: any) {
    return storage.updateUser(id, data);
  }
  
  deleteUser(id: string) {
    return storage.deleteUser(id);
  }
  
  // Organizations
  getOrganizationById(id: string) {
    return storage.getOrganizationById(id);
  }
  
  getOrganizationsByAdminId(adminId: string) {
    return storage.getOrganizationsByAdminId(adminId);
  }
  
  createOrganization(org: any) {
    return storage.createOrganization(org);
  }
  
  updateOrganization(id: string, data: any) {
    return storage.updateOrganization(id, data);
  }
  
  deleteOrganization(id: string) {
    return storage.deleteOrganization(id);
  }
  
  // Vehicles
  getVehicleById(id: string) {
    return storage.getVehicleById(id);
  }
  
  getVehiclesByOwnerId(ownerId: string) {
    return storage.getVehiclesByOwnerId(ownerId);
  }
  
  getVehiclesByOrganizationId(organizationId: string) {
    return storage.getVehiclesByOrganizationId(organizationId);
  }
  
  getAllVehicles() {
    return storage.getAllVehicles();
  }
  
  createVehicle(vehicle: any) {
    return storage.createVehicle(vehicle);
  }
  
  updateVehicle(id: string, data: any) {
    return storage.updateVehicle(id, data);
  }
  
  deleteVehicle(id: string) {
    return storage.deleteVehicle(id);
  }
  
  getVehicleWithLastLocation(id: string) {
    return storage.getVehicleWithLastLocation(id);
  }
  
  getAllVehiclesWithLastLocation() {
    return storage.getAllVehiclesWithLastLocation();
  }
  
  // Tracking devices
  getDeviceById(id: string) {
    return storage.getDeviceById(id);
  }
  
  getDevicesByVehicleId(vehicleId: string) {
    return storage.getDevicesByVehicleId(vehicleId);
  }
  
  createDevice(device: any) {
    return storage.createDevice(device);
  }
  
  updateDevice(id: string, data: any) {
    return storage.updateDevice(id, data);
  }
  
  deleteDevice(id: string) {
    return storage.deleteDevice(id);
  }
  
  // Location history
  getLocationById(id: string) {
    return storage.getLocationById(id);
  }
  
  getLocationsByDeviceId(deviceId: string, limit?: number) {
    return storage.getLocationsByDeviceId(deviceId, limit);
  }
  
  getLocationsByVehicleId(vehicleId: string, limit?: number, startDate?: Date, endDate?: Date) {
    return storage.getLocationsByVehicleId(vehicleId, limit, startDate, endDate);
  }
  
  getLastLocationByVehicleId(vehicleId: string) {
    return storage.getLastLocationByVehicleId(vehicleId);
  }
  
  createLocation(location: any) {
    return storage.createLocation(location);
  }
  
  // Alerts
  getAlertById(id: string) {
    return storage.getAlertById(id);
  }
  
  getAlertsByVehicleId(vehicleId: string) {
    return storage.getAlertsByVehicleId(vehicleId);
  }
  
  getActiveAlerts() {
    return storage.getActiveAlerts();
  }
  
  getAllAlerts() {
    return storage.getAllAlerts();
  }
  
  createAlert(alert: any) {
    return storage.createAlert(alert);
  }
  
  acknowledgeAlert(id: string) {
    return storage.acknowledgeAlert(id);
  }
  
  deleteAlert(id: string) {
    return storage.deleteAlert(id);
  }
  
  // Geofences
  getGeofenceById(id: string) {
    return storage.getGeofenceById(id);
  }
  
  getGeofencesByCreatorId(creatorId: string) {
    return storage.getGeofencesByCreatorId(creatorId);
  }
  
  getGeofencesByOrganizationId(organizationId: string) {
    return storage.getGeofencesByOrganizationId(organizationId);
  }
  
  getAllGeofences() {
    return storage.getAllGeofences();
  }
  
  createGeofence(geofence: any) {
    return storage.createGeofence(geofence);
  }
  
  updateGeofence(id: string, data: any) {
    return storage.updateGeofence(id, data);
  }
  
  deleteGeofence(id: string) {
    return storage.deleteGeofence(id);
  }
  
  // Vehicle-Geofence relationship
  assignVehicleToGeofence(vehicleId: string, geofenceId: string) {
    return storage.assignVehicleToGeofence(vehicleId, geofenceId);
  }
  
  removeVehicleFromGeofence(vehicleId: string, geofenceId: string) {
    return storage.removeVehicleFromGeofence(vehicleId, geofenceId);
  }
  
  getGeofencesByVehicleId(vehicleId: string) {
    return storage.getGeofencesByVehicleId(vehicleId);
  }
  
  getVehiclesByGeofenceId(geofenceId: string) {
    return storage.getVehiclesByGeofenceId(geofenceId);
  }
  
  // Maintenance records
  getMaintenanceRecordById(id: string) {
    return storage.getMaintenanceRecordById(id);
  }
  
  getMaintenanceRecordsByVehicleId(vehicleId: string) {
    return storage.getMaintenanceRecordsByVehicleId(vehicleId);
  }
  
  getAllMaintenanceRecords() {
    return storage.getAllMaintenanceRecords();
  }
  
  createMaintenanceRecord(record: any) {
    return storage.createMaintenanceRecord(record);
  }
  
  updateMaintenanceRecord(id: string, data: any) {
    return storage.updateMaintenanceRecord(id, data);
  }
  
  deleteMaintenanceRecord(id: string) {
    return storage.deleteMaintenanceRecord(id);
  }
}