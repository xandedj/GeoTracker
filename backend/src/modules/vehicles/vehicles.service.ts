import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../shared/storage/storage.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly storageService: StorageService) {}

  async getAllVehicles() {
    return this.storageService.getAllVehicles();
  }

  async getAllVehiclesWithLastLocation() {
    return this.storageService.getAllVehiclesWithLastLocation();
  }

  async getVehicleById(id: string) {
    const vehicle = await this.storageService.getVehicleById(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async getVehicleWithLastLocation(id: string) {
    const result = await this.storageService.getVehicleWithLastLocation(id);
    if (!result.vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return result;
  }

  async getVehiclesByOwnerId(ownerId: string) {
    return this.storageService.getVehiclesByOwnerId(ownerId);
  }

  async getVehiclesByOrganizationId(organizationId: string) {
    return this.storageService.getVehiclesByOrganizationId(organizationId);
  }

  async createVehicle(createVehicleDto: CreateVehicleDto) {
    return this.storageService.createVehicle(createVehicleDto);
  }

  async updateVehicle(id: string, updateVehicleDto: UpdateVehicleDto) {
    const updatedVehicle = await this.storageService.updateVehicle(id, updateVehicleDto);
    if (!updatedVehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return updatedVehicle;
  }

  async deleteVehicle(id: string) {
    const deleted = await this.storageService.deleteVehicle(id);
    if (!deleted) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return { success: true };
  }
}