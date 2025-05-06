import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@ApiTags('vehicles')
@Controller('vehicles')
@UseGuards(AuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'Return all vehicles' })
  async getAllVehicles() {
    return this.vehiclesService.getAllVehicles();
  }

  @Get('with-location')
  @ApiOperation({ summary: 'Get all vehicles with their last location' })
  @ApiResponse({ status: 200, description: 'Return all vehicles with their last location' })
  async getAllVehiclesWithLastLocation() {
    return this.vehiclesService.getAllVehiclesWithLastLocation();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by id' })
  @ApiParam({ name: 'id', description: 'The id of the vehicle' })
  @ApiResponse({ status: 200, description: 'Return the vehicle' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async getVehicleById(@Param('id') id: string) {
    return this.vehiclesService.getVehicleById(id);
  }

  @Get(':id/location')
  @ApiOperation({ summary: 'Get a vehicle with its last location' })
  @ApiParam({ name: 'id', description: 'The id of the vehicle' })
  @ApiResponse({ status: 200, description: 'Return the vehicle with its last location' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async getVehicleWithLastLocation(@Param('id') id: string) {
    return this.vehiclesService.getVehicleWithLastLocation(id);
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Get vehicles by owner id' })
  @ApiParam({ name: 'ownerId', description: 'The id of the owner' })
  @ApiResponse({ status: 200, description: 'Return the vehicles' })
  async getVehiclesByOwnerId(@Param('ownerId') ownerId: string) {
    return this.vehiclesService.getVehiclesByOwnerId(ownerId);
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get vehicles by organization id' })
  @ApiParam({ name: 'organizationId', description: 'The id of the organization' })
  @ApiResponse({ status: 200, description: 'Return the vehicles' })
  async getVehiclesByOrganizationId(@Param('organizationId') organizationId: string) {
    return this.vehiclesService.getVehiclesByOrganizationId(organizationId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 201, description: 'The vehicle has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto, @Req() req: Request) {
    // If no ownerId is provided, use the current user's id
    if (!createVehicleDto.ownerId) {
      createVehicleDto.ownerId = (req as any).user.id;
    }
    return this.vehiclesService.createVehicle(createVehicleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiParam({ name: 'id', description: 'The id of the vehicle' })
  @ApiResponse({ status: 200, description: 'The vehicle has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateVehicle(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateVehicle(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiParam({ name: 'id', description: 'The id of the vehicle' })
  @ApiResponse({ status: 200, description: 'The vehicle has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async deleteVehicle(@Param('id') id: string) {
    return this.vehiclesService.deleteVehicle(id);
  }
}