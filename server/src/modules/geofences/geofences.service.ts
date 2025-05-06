import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../shared/storage/storage.service';
import { CreateGeofenceDto, UpdateGeofenceDto } from './dto/geofence.dto';

@Injectable()
export class GeofencesService {
  constructor(private readonly storageService: StorageService) {}

  async getAllGeofences() {
    return this.storageService.getAllGeofences();
  }

  async getGeofenceById(id: string) {
    const geofence = await this.storageService.getGeofenceById(id);
    if (!geofence) {
      throw new NotFoundException(`Geofence with ID ${id} not found`);
    }
    return geofence;
  }

  async getGeofencesByCreatorId(creatorId: string) {
    return this.storageService.getGeofencesByCreatorId(creatorId);
  }

  async getGeofencesByOrganizationId(organizationId: string) {
    return this.storageService.getGeofencesByOrganizationId(organizationId);
  }

  async getGeofencesByVehicleId(vehicleId: string) {
    return this.storageService.getGeofencesByVehicleId(vehicleId);
  }

  async getVehiclesByGeofenceId(geofenceId: string) {
    return this.storageService.getVehiclesByGeofenceId(geofenceId);
  }

  async createGeofence(createGeofenceDto: CreateGeofenceDto) {
    return this.storageService.createGeofence(createGeofenceDto);
  }

  async updateGeofence(id: string, updateGeofenceDto: UpdateGeofenceDto) {
    const updatedGeofence = await this.storageService.updateGeofence(id, updateGeofenceDto);
    if (!updatedGeofence) {
      throw new NotFoundException(`Geofence with ID ${id} not found`);
    }
    return updatedGeofence;
  }

  async deleteGeofence(id: string) {
    const deleted = await this.storageService.deleteGeofence(id);
    if (!deleted) {
      throw new NotFoundException(`Geofence with ID ${id} not found`);
    }
    return { success: true };
  }

  async assignVehicleToGeofence(vehicleId: string, geofenceId: string) {
    const assigned = await this.storageService.assignVehicleToGeofence(vehicleId, geofenceId);
    if (!assigned) {
      throw new NotFoundException(`Vehicle or geofence not found`);
    }
    return { success: true };
  }

  async removeVehicleFromGeofence(vehicleId: string, geofenceId: string) {
    const removed = await this.storageService.removeVehicleFromGeofence(vehicleId, geofenceId);
    if (!removed) {
      throw new NotFoundException(`Relationship between vehicle and geofence not found`);
    }
    return { success: true };
  }
}