import { pgTable, text, serial, integer, boolean, jsonb, timestamp, uuid, real, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const UserRole = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Vehicle status enum
export const VehicleStatus = {
  ACTIVE: "active",
  PARKED: "parked",
  INACTIVE: "inactive",
  MAINTENANCE: "maintenance",
} as const;

export type VehicleStatusType = typeof VehicleStatus[keyof typeof VehicleStatus];

// Device status enum
export const DeviceStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  MAINTENANCE: "maintenance",
} as const;

export type DeviceStatusType = typeof DeviceStatus[keyof typeof DeviceStatus];

// Alert type enum
export const AlertType = {
  SPEED: "speed",
  GEOFENCE: "geofence",
  MAINTENANCE: "maintenance",
  ENGINE: "engine",
  BATTERY: "battery",
  UNAUTHORIZED_ACCESS: "unauthorized_access",
} as const;

export type AlertTypeType = typeof AlertType[keyof typeof AlertType];

// Geofence type enum
export const GeofenceType = {
  CIRCLE: "circle",
  POLYGON: "polygon",
  RECTANGLE: "rectangle",
} as const;

export type GeofenceTypeType = typeof GeofenceType[keyof typeof GeofenceType];

// Maintenance type enum
export const MaintenanceType = {
  OIL_CHANGE: "oil_change",
  TIRE_ROTATION: "tire_rotation",
  INSPECTION: "inspection",
  REPAIR: "repair",
  GENERAL_SERVICE: "general_service",
} as const;

export type MaintenanceTypeType = typeof MaintenanceType[keyof typeof MaintenanceType];

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().$type<UserRoleType>().default(UserRole.USER),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  documentNumber: text("document_number"),
  address: text("address"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  adminId: uuid("admin_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  plate: text("plate").notNull(),
  model: text("model").notNull(),
  brand: text("brand").notNull(),
  year: integer("year"),
  color: text("color"),
  ownerId: uuid("owner_id").references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  nickname: text("nickname"),
  status: text("status").$type<VehicleStatusType>().default(VehicleStatus.INACTIVE),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tracking devices table
export const trackingDevices = pgTable("tracking_devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  serialNumber: text("serial_number").notNull().unique(),
  model: text("model"),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  status: text("status").$type<DeviceStatusType>().default(DeviceStatus.INACTIVE),
  configuration: jsonb("configuration"),
  lastConnection: timestamp("last_connection"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Location history table
export const locationHistory = pgTable("location_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: uuid("device_id").references(() => trackingDevices.id),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  speed: real("speed"),
  heading: real("heading"),
  accuracy: real("accuracy"),
  eventTime: timestamp("event_time").defaultNow(),
  metadata: jsonb("metadata"),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  type: text("type").$type<AlertTypeType>().notNull(),
  description: text("description").notNull(),
  data: jsonb("data"),
  acknowledged: boolean("acknowledged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at"),
});

// Geofences table
export const geofences = pgTable("geofences", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  creatorId: uuid("creator_id").references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  coordinates: jsonb("coordinates").notNull(),
  type: text("type").$type<GeofenceTypeType>().notNull(),
  schedule: jsonb("schedule"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Maintenance records table
export const maintenanceRecords = pgTable("maintenance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  type: text("type").$type<MaintenanceTypeType>().notNull(),
  odometerReading: real("odometer_reading"),
  serviceDate: timestamp("service_date").notNull(),
  description: text("description"),
  cost: decimal("cost"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicle to geofence relationship
export const vehicleGeofences = pgTable("vehicle_geofences", {
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  geofenceId: uuid("geofence_id").references(() => geofences.id),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  hashedPassword: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8),
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrackingDeviceSchema = createInsertSchema(trackingDevices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastConnection: true,
});

export const insertLocationHistorySchema = createInsertSchema(locationHistory).omit({
  id: true,
  eventTime: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  acknowledgedAt: true,
});

export const insertGeofenceSchema = createInsertSchema(geofences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema> & { hashedPassword: string };

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type TrackingDevice = typeof trackingDevices.$inferSelect;
export type InsertTrackingDevice = z.infer<typeof insertTrackingDeviceSchema>;

export type LocationHistory = typeof locationHistory.$inferSelect;
export type InsertLocationHistory = z.infer<typeof insertLocationHistorySchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Geofence = typeof geofences.$inferSelect;
export type InsertGeofence = z.infer<typeof insertGeofenceSchema>;

export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;

// Authentication related schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = insertUserSchema;

export type RegisterData = z.infer<typeof registerSchema>;

// Extended schemas for responses
export const vehicleWithLastLocationSchema = z.object({
  vehicle: z.object(createInsertSchema(vehicles).shape),
  lastLocation: z.object(createInsertSchema(locationHistory).shape).nullable(),
});

export type VehicleWithLastLocation = z.infer<typeof vehicleWithLastLocationSchema>;
