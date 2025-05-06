import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../shared/storage/storage.service';
import { CreateLocationDto, LocationQueryDto } from './dto/location.dto';

@Injectable()
export class TrackingService {
  constructor(private readonly storageService: StorageService) {}

  async getLocationHistory(vehicleId: string, query: LocationQueryDto) {
    const { limit, startDate, endDate } = query;
    
    // Convert string dates to Date objects if provided
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    
    return this.storageService.getLocationsByVehicleId(
      vehicleId,
      limit,
      startDateObj,
      endDateObj,
    );
  }

  async getLastLocation(vehicleId: string) {
    const location = await this.storageService.getLastLocationByVehicleId(vehicleId);
    if (!location) {
      throw new NotFoundException(`No location found for vehicle with ID ${vehicleId}`);
    }
    return location;
  }

  async createLocation(createLocationDto: CreateLocationDto) {
    return this.storageService.createLocation(createLocationDto);
  }
}