import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateLocationDto, LocationQueryDto } from './dto/location.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('location/vehicle/:vehicleId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get location history for a vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'The ID of the vehicle' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of records to return' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering (ISO format)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering (ISO format)' })
  @ApiResponse({ status: 200, description: 'Return the location history' })
  async getLocationHistory(
    @Param('vehicleId') vehicleId: string,
    @Query() query: LocationQueryDto,
  ) {
    return this.trackingService.getLocationHistory(vehicleId, query);
  }

  @Get('location/vehicle/:vehicleId/last')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the last known location for a vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'The ID of the vehicle' })
  @ApiResponse({ status: 200, description: 'Return the last location' })
  @ApiResponse({ status: 404, description: 'No location found' })
  async getLastLocation(@Param('vehicleId') vehicleId: string) {
    return this.trackingService.getLastLocation(vehicleId);
  }

  @Post('location')
  @ApiOperation({ summary: 'Add a new location update' })
  @ApiResponse({ status: 201, description: 'The location has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addLocationUpdate(@Body() createLocationDto: CreateLocationDto) {
    return this.trackingService.createLocation(createLocationDto);
  }
}