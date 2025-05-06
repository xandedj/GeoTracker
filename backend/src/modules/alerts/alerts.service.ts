import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../shared/storage/storage.service';
import { CreateAlertDto } from './dto/alert.dto';

@Injectable()
export class AlertsService {
  constructor(private readonly storageService: StorageService) {}

  async getAllAlerts() {
    return this.storageService.getAllAlerts();
  }

  async getActiveAlerts() {
    return this.storageService.getActiveAlerts();
  }

  async getAlertsByVehicleId(vehicleId: string) {
    return this.storageService.getAlertsByVehicleId(vehicleId);
  }

  async createAlert(createAlertDto: CreateAlertDto) {
    return this.storageService.createAlert(createAlertDto);
  }

  async acknowledgeAlert(id: string) {
    const alert = await this.storageService.acknowledgeAlert(id);
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
    return alert;
  }

  async deleteAlert(id: string) {
    const deleted = await this.storageService.deleteAlert(id);
    if (!deleted) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
    return { success: true };
  }
}