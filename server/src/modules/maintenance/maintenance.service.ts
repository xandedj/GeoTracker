import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../shared/storage/storage.service';
import { CreateMaintenanceRecordDto, UpdateMaintenanceRecordDto } from './dto/maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly storageService: StorageService) {}

  async getAllMaintenanceRecords() {
    return this.storageService.getAllMaintenanceRecords();
  }

  async getMaintenanceRecordById(id: string) {
    const record = await this.storageService.getMaintenanceRecordById(id);
    if (!record) {
      throw new NotFoundException(`Maintenance record with ID ${id} not found`);
    }
    return record;
  }

  async getMaintenanceRecordsByVehicleId(vehicleId: string) {
    return this.storageService.getMaintenanceRecordsByVehicleId(vehicleId);
  }

  async createMaintenanceRecord(createMaintenanceRecordDto: CreateMaintenanceRecordDto) {
    // Convert string dates to Date objects
    const data = {
      ...createMaintenanceRecordDto,
      performedAt: new Date(createMaintenanceRecordDto.performedAt),
      nextDueDate: createMaintenanceRecordDto.nextDueDate 
        ? new Date(createMaintenanceRecordDto.nextDueDate) 
        : undefined,
    };
    
    return this.storageService.createMaintenanceRecord(data);
  }

  async updateMaintenanceRecord(id: string, updateMaintenanceRecordDto: UpdateMaintenanceRecordDto) {
    // Convert string dates to Date objects if they exist
    const data = { ...updateMaintenanceRecordDto };
    
    if (data.performedAt) {
      data.performedAt = new Date(data.performedAt);
    }
    
    if (data.nextDueDate) {
      data.nextDueDate = new Date(data.nextDueDate);
    }
    
    const updatedRecord = await this.storageService.updateMaintenanceRecord(id, data);
    if (!updatedRecord) {
      throw new NotFoundException(`Maintenance record with ID ${id} not found`);
    }
    return updatedRecord;
  }

  async deleteMaintenanceRecord(id: string) {
    const deleted = await this.storageService.deleteMaintenanceRecord(id);
    if (!deleted) {
      throw new NotFoundException(`Maintenance record with ID ${id} not found`);
    }
    return { success: true };
  }
}