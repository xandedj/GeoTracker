import { 
  User, InsertUser, 
  Organization, InsertOrganization,
  Vehicle, InsertVehicle,
  TrackingDevice, InsertTrackingDevice,
  LocationHistory, InsertLocationHistory,
  Alert, InsertAlert,
  Geofence, InsertGeofence,
  MaintenanceRecord, InsertMaintenanceRecord,
  VehicleStatus
} from "@shared/schema";
import { checkGeofenceViolations } from "./utils/geo";

// Storage interface with all needed CRUD operations
export interface IStorage {
  // Users
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Organizations
  getOrganizationById(id: string): Promise<Organization | undefined>;
  getOrganizationsByAdminId(adminId: string): Promise<Organization[]>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, data: Partial<InsertOrganization>): Promise<Organization | undefined>;
  deleteOrganization(id: string): Promise<boolean>;

  // Vehicles
  getVehicleById(id: string): Promise<Vehicle | undefined>;
  getVehiclesByOwnerId(ownerId: string): Promise<Vehicle[]>;
  getVehiclesByOrganizationId(organizationId: string): Promise<Vehicle[]>;
  getAllVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, data: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;
  getVehicleWithLastLocation(id: string): Promise<{ vehicle: Vehicle, lastLocation: LocationHistory | null }>;
  getAllVehiclesWithLastLocation(): Promise<{ vehicle: Vehicle, lastLocation: LocationHistory | null }[]>;

  // Tracking devices
  getDeviceById(id: string): Promise<TrackingDevice | undefined>;
  getDevicesByVehicleId(vehicleId: string): Promise<TrackingDevice[]>;
  createDevice(device: InsertTrackingDevice): Promise<TrackingDevice>;
  updateDevice(id: string, data: Partial<InsertTrackingDevice>): Promise<TrackingDevice | undefined>;
  deleteDevice(id: string): Promise<boolean>;
  
  // Location history
  getLocationById(id: string): Promise<LocationHistory | undefined>;
  getLocationsByDeviceId(deviceId: string, limit?: number): Promise<LocationHistory[]>;
  getLocationsByVehicleId(vehicleId: string, limit?: number, startDate?: Date, endDate?: Date): Promise<LocationHistory[]>;
  getLastLocationByVehicleId(vehicleId: string): Promise<LocationHistory | undefined>;
  createLocation(location: InsertLocationHistory): Promise<LocationHistory>;
  
  // Alerts
  getAlertById(id: string): Promise<Alert | undefined>;
  getAlertsByVehicleId(vehicleId: string): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  getAllAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: string): Promise<Alert | undefined>;
  deleteAlert(id: string): Promise<boolean>;
  
  // Geofences
  getGeofenceById(id: string): Promise<Geofence | undefined>;
  getGeofencesByCreatorId(creatorId: string): Promise<Geofence[]>;
  getGeofencesByOrganizationId(organizationId: string): Promise<Geofence[]>;
  getAllGeofences(): Promise<Geofence[]>;
  createGeofence(geofence: InsertGeofence): Promise<Geofence>;
  updateGeofence(id: string, data: Partial<InsertGeofence>): Promise<Geofence | undefined>;
  deleteGeofence(id: string): Promise<boolean>;
  
  // Vehicle-Geofence relationship
  assignVehicleToGeofence(vehicleId: string, geofenceId: string): Promise<boolean>;
  removeVehicleFromGeofence(vehicleId: string, geofenceId: string): Promise<boolean>;
  getGeofencesByVehicleId(vehicleId: string): Promise<Geofence[]>;
  getVehiclesByGeofenceId(geofenceId: string): Promise<Vehicle[]>;
  
  // Maintenance records
  getMaintenanceRecordById(id: string): Promise<MaintenanceRecord | undefined>;
  getMaintenanceRecordsByVehicleId(vehicleId: string): Promise<MaintenanceRecord[]>;
  getAllMaintenanceRecords(): Promise<MaintenanceRecord[]>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  updateMaintenanceRecord(id: string, data: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined>;
  deleteMaintenanceRecord(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private organizations: Map<string, Organization>;
  private vehicles: Map<string, Vehicle>;
  private trackingDevices: Map<string, TrackingDevice>;
  private locationHistory: Map<string, LocationHistory>;
  private alerts: Map<string, Alert>;
  private geofences: Map<string, Geofence>;
  private vehicleGeofences: Map<string, Set<string>>;  // Map<vehicleId, Set<geofenceId>>
  private geofenceVehicles: Map<string, Set<string>>;  // Map<geofenceId, Set<vehicleId>>
  private maintenanceRecords: Map<string, MaintenanceRecord>;

  constructor() {
    this.users = new Map();
    this.organizations = new Map();
    this.vehicles = new Map();
    this.trackingDevices = new Map();
    this.locationHistory = new Map();
    this.alerts = new Map();
    this.geofences = new Map();
    this.vehicleGeofences = new Map();
    this.geofenceVehicles = new Map();
    this.maintenanceRecords = new Map();

    // Initialize with some seed data
    this.seedData();
  }

  private seedData() {
    // We'll generate some demo data when the storage is initialized
    const adminUser: User = {
      id: "user-admin-1",
      email: "admin@trackergeo.com",
      hashedPassword: "$2b$10$CwTycUXWue0Thq9StjUM0uQxTto/PHwvqY5K2aQmKBsatpZHKYxAi", // password: admin123
      fullName: "Admin User",
      phone: "(11) 98765-4321",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(adminUser.id, adminUser);
  }

  // Users
  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = `user-${Date.now()}`;
    const now = new Date();
    const user: User = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUserById(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Organizations
  async getOrganizationById(id: string): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  async getOrganizationsByAdminId(adminId: string): Promise<Organization[]> {
    return Array.from(this.organizations.values())
      .filter(org => org.adminId === adminId);
  }

  async createOrganization(orgData: InsertOrganization): Promise<Organization> {
    const id = `org-${Date.now()}`;
    const now = new Date();
    const organization: Organization = {
      id,
      ...orgData,
      createdAt: now,
      updatedAt: now
    };
    this.organizations.set(id, organization);
    return organization;
  }

  async updateOrganization(id: string, data: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const organization = await this.getOrganizationById(id);
    if (!organization) return undefined;

    const updatedOrganization: Organization = {
      ...organization,
      ...data,
      updatedAt: new Date()
    };
    
    this.organizations.set(id, updatedOrganization);
    return updatedOrganization;
  }

  async deleteOrganization(id: string): Promise<boolean> {
    return this.organizations.delete(id);
  }

  // Vehicles
  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getVehiclesByOwnerId(ownerId: string): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values())
      .filter(vehicle => vehicle.ownerId === ownerId);
  }

  async getVehiclesByOrganizationId(organizationId: string): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values())
      .filter(vehicle => vehicle.organizationId === organizationId);
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async createVehicle(vehicleData: InsertVehicle): Promise<Vehicle> {
    const id = `vehicle-${Date.now()}`;
    const now = new Date();
    const vehicle: Vehicle = {
      id,
      ...vehicleData,
      createdAt: now,
      updatedAt: now
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: string, data: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const vehicle = await this.getVehicleById(id);
    if (!vehicle) return undefined;

    const updatedVehicle: Vehicle = {
      ...vehicle,
      ...data,
      updatedAt: new Date()
    };
    
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    // Also clean up any associated tracking devices
    const devices = await this.getDevicesByVehicleId(id);
    for (const device of devices) {
      await this.deleteDevice(device.id);
    }
    
    // Remove from geofence assignments
    if (this.vehicleGeofences.has(id)) {
      const geofenceIds = this.vehicleGeofences.get(id) || new Set();
      for (const geofenceId of geofenceIds) {
        await this.removeVehicleFromGeofence(id, geofenceId);
      }
    }
    
    return this.vehicles.delete(id);
  }

  async getVehicleWithLastLocation(id: string): Promise<{ vehicle: Vehicle, lastLocation: LocationHistory | null }> {
    const vehicle = await this.getVehicleById(id);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
    
    const lastLocation = await this.getLastLocationByVehicleId(id);
    
    return {
      vehicle,
      lastLocation: lastLocation || null
    };
  }

  async getAllVehiclesWithLastLocation(): Promise<{ vehicle: Vehicle, lastLocation: LocationHistory | null }[]> {
    const vehicles = await this.getAllVehicles();
    const result = [];
    
    for (const vehicle of vehicles) {
      const lastLocation = await this.getLastLocationByVehicleId(vehicle.id);
      result.push({
        vehicle,
        lastLocation: lastLocation || null
      });
    }
    
    return result;
  }

  // Tracking devices
  async getDeviceById(id: string): Promise<TrackingDevice | undefined> {
    return this.trackingDevices.get(id);
  }

  async getDevicesByVehicleId(vehicleId: string): Promise<TrackingDevice[]> {
    return Array.from(this.trackingDevices.values())
      .filter(device => device.vehicleId === vehicleId);
  }

  async createDevice(deviceData: InsertTrackingDevice): Promise<TrackingDevice> {
    const id = `device-${Date.now()}`;
    const now = new Date();
    const device: TrackingDevice = {
      id,
      ...deviceData,
      lastConnection: deviceData.lastConnection || now,
      createdAt: now,
      updatedAt: now
    };
    this.trackingDevices.set(id, device);
    return device;
  }

  async updateDevice(id: string, data: Partial<InsertTrackingDevice>): Promise<TrackingDevice | undefined> {
    const device = await this.getDeviceById(id);
    if (!device) return undefined;

    const updatedDevice: TrackingDevice = {
      ...device,
      ...data,
      updatedAt: new Date()
    };
    
    this.trackingDevices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDevice(id: string): Promise<boolean> {
    return this.trackingDevices.delete(id);
  }

  // Location history
  async getLocationById(id: string): Promise<LocationHistory | undefined> {
    return this.locationHistory.get(id);
  }

  async getLocationsByDeviceId(deviceId: string, limit?: number): Promise<LocationHistory[]> {
    const locations = Array.from(this.locationHistory.values())
      .filter(location => location.deviceId === deviceId)
      .sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
    
    return limit ? locations.slice(0, limit) : locations;
  }

  async getLocationsByVehicleId(vehicleId: string, limit?: number, startDate?: Date, endDate?: Date): Promise<LocationHistory[]> {
    // First, get all devices for this vehicle
    const devices = await this.getDevicesByVehicleId(vehicleId);
    const deviceIds = devices.map(device => device.id);
    
    // Then get locations for all these devices
    let locations = Array.from(this.locationHistory.values())
      .filter(location => deviceIds.includes(location.deviceId));
    
    // Apply date filters if provided
    if (startDate) {
      locations = locations.filter(location => 
        new Date(location.eventTime) >= startDate
      );
    }
    
    if (endDate) {
      locations = locations.filter(location => 
        new Date(location.eventTime) <= endDate
      );
    }
    
    // Sort by time, newest first
    locations.sort((a, b) => 
      new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()
    );
    
    // Apply limit if provided
    return limit ? locations.slice(0, limit) : locations;
  }

  async getLastLocationByVehicleId(vehicleId: string): Promise<LocationHistory | undefined> {
    const locations = await this.getLocationsByVehicleId(vehicleId, 1);
    return locations.length > 0 ? locations[0] : undefined;
  }

  async createLocation(locationData: InsertLocationHistory): Promise<LocationHistory> {
    const id = `location-${Date.now()}`;
    const now = new Date();
    
    const location: LocationHistory = {
      id,
      ...locationData,
      eventTime: locationData.eventTime || now
    };
    
    this.locationHistory.set(id, location);
    
    // Check if this location update should change vehicle status
    const device = await this.getDeviceById(location.deviceId);
    if (device) {
      const vehicle = await this.getVehicleById(device.vehicleId);
      if (vehicle) {
        // Update device last connection time
        await this.updateDevice(device.id, { 
          lastConnection: new Date(location.eventTime) 
        });
        
        // Update vehicle status based on speed
        let newStatus = vehicle.status;
        if (location.speed && location.speed > 0) {
          newStatus = VehicleStatus.ACTIVE;
        } else if (location.speed === 0) {
          newStatus = VehicleStatus.PARKED;
        }
        
        if (newStatus !== vehicle.status) {
          await this.updateVehicle(vehicle.id, { status: newStatus });
        }
        
        // Check for geofence violations
        await this.checkGeofenceViolations(vehicle.id, location);
      }
    }
    
    return location;
  }

  // Helper method to check geofence violations
  private async checkGeofenceViolations(vehicleId: string, location: LocationHistory): Promise<void> {
    const geofences = await this.getGeofencesByVehicleId(vehicleId);
    if (geofences.length === 0) return;
    
    const violations = checkGeofenceViolations(location, geofences);
    
    for (const violation of violations) {
      // Create alert for the violation
      await this.createAlert({
        vehicleId,
        type: "geofence",
        description: `Vehicle left geofence: ${violation.name}`,
        data: { 
          geofenceId: violation.id,
          location: { 
            latitude: location.latitude, 
            longitude: location.longitude 
          }
        },
        acknowledged: false
      });
    }
  }

  // Alerts
  async getAlertById(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async getAlertsByVehicleId(vehicleId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const id = `alert-${Date.now()}`;
    const now = new Date();
    
    const alert: Alert = {
      id,
      ...alertData,
      createdAt: now,
      acknowledgedAt: alertData.acknowledged ? now : undefined
    };
    
    this.alerts.set(id, alert);
    return alert;
  }

  async acknowledgeAlert(id: string): Promise<Alert | undefined> {
    const alert = await this.getAlertById(id);
    if (!alert) return undefined;
    
    const now = new Date();
    const acknowledgedAlert: Alert = {
      ...alert,
      acknowledged: true,
      acknowledgedAt: now
    };
    
    this.alerts.set(id, acknowledgedAlert);
    return acknowledgedAlert;
  }

  async deleteAlert(id: string): Promise<boolean> {
    return this.alerts.delete(id);
  }

  // Geofences
  async getGeofenceById(id: string): Promise<Geofence | undefined> {
    return this.geofences.get(id);
  }

  async getGeofencesByCreatorId(creatorId: string): Promise<Geofence[]> {
    return Array.from(this.geofences.values())
      .filter(geofence => geofence.creatorId === creatorId);
  }

  async getGeofencesByOrganizationId(organizationId: string): Promise<Geofence[]> {
    return Array.from(this.geofences.values())
      .filter(geofence => geofence.organizationId === organizationId);
  }

  async getAllGeofences(): Promise<Geofence[]> {
    return Array.from(this.geofences.values());
  }

  async createGeofence(geofenceData: InsertGeofence): Promise<Geofence> {
    const id = `geofence-${Date.now()}`;
    const now = new Date();
    
    const geofence: Geofence = {
      id,
      ...geofenceData,
      createdAt: now,
      updatedAt: now
    };
    
    this.geofences.set(id, geofence);
    return geofence;
  }

  async updateGeofence(id: string, data: Partial<InsertGeofence>): Promise<Geofence | undefined> {
    const geofence = await this.getGeofenceById(id);
    if (!geofence) return undefined;
    
    const updatedGeofence: Geofence = {
      ...geofence,
      ...data,
      updatedAt: new Date()
    };
    
    this.geofences.set(id, updatedGeofence);
    return updatedGeofence;
  }

  async deleteGeofence(id: string): Promise<boolean> {
    // Remove vehicle associations
    if (this.geofenceVehicles.has(id)) {
      const vehicleIds = this.geofenceVehicles.get(id) || new Set();
      for (const vehicleId of vehicleIds) {
        await this.removeVehicleFromGeofence(vehicleId, id);
      }
    }
    
    return this.geofences.delete(id);
  }

  // Vehicle-Geofence relationship
  async assignVehicleToGeofence(vehicleId: string, geofenceId: string): Promise<boolean> {
    // Check if vehicle and geofence exist
    const vehicle = await this.getVehicleById(vehicleId);
    const geofence = await this.getGeofenceById(geofenceId);
    
    if (!vehicle || !geofence) {
      return false;
    }
    
    // Get or create the sets for both maps
    if (!this.vehicleGeofences.has(vehicleId)) {
      this.vehicleGeofences.set(vehicleId, new Set());
    }
    
    if (!this.geofenceVehicles.has(geofenceId)) {
      this.geofenceVehicles.set(geofenceId, new Set());
    }
    
    // Add to both maps for bi-directional lookup
    this.vehicleGeofences.get(vehicleId)!.add(geofenceId);
    this.geofenceVehicles.get(geofenceId)!.add(vehicleId);
    
    return true;
  }

  async removeVehicleFromGeofence(vehicleId: string, geofenceId: string): Promise<boolean> {
    // Remove from vehicleGeofences map
    if (this.vehicleGeofences.has(vehicleId)) {
      this.vehicleGeofences.get(vehicleId)!.delete(geofenceId);
    }
    
    // Remove from geofenceVehicles map
    if (this.geofenceVehicles.has(geofenceId)) {
      this.geofenceVehicles.get(geofenceId)!.delete(vehicleId);
    }
    
    return true;
  }

  async getGeofencesByVehicleId(vehicleId: string): Promise<Geofence[]> {
    if (!this.vehicleGeofences.has(vehicleId)) {
      return [];
    }
    
    const geofenceIds = Array.from(this.vehicleGeofences.get(vehicleId)!);
    const geofences: Geofence[] = [];
    
    for (const id of geofenceIds) {
      const geofence = await this.getGeofenceById(id);
      if (geofence) {
        geofences.push(geofence);
      }
    }
    
    return geofences;
  }

  async getVehiclesByGeofenceId(geofenceId: string): Promise<Vehicle[]> {
    if (!this.geofenceVehicles.has(geofenceId)) {
      return [];
    }
    
    const vehicleIds = Array.from(this.geofenceVehicles.get(geofenceId)!);
    const vehicles: Vehicle[] = [];
    
    for (const id of vehicleIds) {
      const vehicle = await this.getVehicleById(id);
      if (vehicle) {
        vehicles.push(vehicle);
      }
    }
    
    return vehicles;
  }

  // Maintenance records
  async getMaintenanceRecordById(id: string): Promise<MaintenanceRecord | undefined> {
    return this.maintenanceRecords.get(id);
  }

  async getMaintenanceRecordsByVehicleId(vehicleId: string): Promise<MaintenanceRecord[]> {
    return Array.from(this.maintenanceRecords.values())
      .filter(record => record.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
  }

  async getAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    return Array.from(this.maintenanceRecords.values())
      .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
  }

  async createMaintenanceRecord(recordData: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const id = `maintenance-${Date.now()}`;
    const now = new Date();
    
    const record: MaintenanceRecord = {
      id,
      ...recordData,
      createdAt: now,
      updatedAt: now
    };
    
    this.maintenanceRecords.set(id, record);
    return record;
  }

  async updateMaintenanceRecord(id: string, data: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const record = await this.getMaintenanceRecordById(id);
    if (!record) return undefined;
    
    const updatedRecord: MaintenanceRecord = {
      ...record,
      ...data,
      updatedAt: new Date()
    };
    
    this.maintenanceRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteMaintenanceRecord(id: string): Promise<boolean> {
    return this.maintenanceRecords.delete(id);
  }
}

export const storage = new MemStorage();
