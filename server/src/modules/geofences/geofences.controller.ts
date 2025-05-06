import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { GeofencesService } from './geofences.service';
import { CreateGeofenceDto, UpdateGeofenceDto, VehicleGeofenceDto } from './dto/geofence.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@ApiTags('geofences')
@Controller('geofences')
@UseGuards(AuthGuard)
export class GeofencesController {
  constructor(private readonly geofencesService: GeofencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all geofences' })
  @ApiResponse({ status: 200, description: 'Return all geofences' })
  async getAllGeofences() {
    return this.geofencesService.getAllGeofences();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a geofence by id' })
  @ApiParam({ name: 'id', description: 'The id of the geofence' })
  @ApiResponse({ status: 200, description: 'Return the geofence' })
  @ApiResponse({ status: 404, description: 'Geofence not found' })
  async getGeofenceById(@Param('id') id: string) {
    return this.geofencesService.getGeofenceById(id);
  }

  @Get('creator/:creatorId')
  @ApiOperation({ summary: 'Get geofences by creator id' })
  @ApiParam({ name: 'creatorId', description: 'The id of the creator' })
  @ApiResponse({ status: 200, description: 'Return the geofences' })
  async getGeofencesByCreatorId(@Param('creatorId') creatorId: string) {
    return this.geofencesService.getGeofencesByCreatorId(creatorId);
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get geofences by organization id' })
  @ApiParam({ name: 'organizationId', description: 'The id of the organization' })
  @ApiResponse({ status: 200, description: 'Return the geofences' })
  async getGeofencesByOrganizationId(@Param('organizationId') organizationId: string) {
    return this.geofencesService.getGeofencesByOrganizationId(organizationId);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get geofences by vehicle id' })
  @ApiParam({ name: 'vehicleId', description: 'The id of the vehicle' })
  @ApiResponse({ status: 200, description: 'Return the geofences' })
  async getGeofencesByVehicleId(@Param('vehicleId') vehicleId: string) {
    return this.geofencesService.getGeofencesByVehicleId(vehicleId);
  }

  @Get(':id/vehicles')
  @ApiOperation({ summary: 'Get vehicles assigned to a geofence' })
  @ApiParam({ name: 'id', description: 'The id of the geofence' })
  @ApiResponse({ status: 200, description: 'Return the vehicles' })
  @ApiResponse({ status: 404, description: 'Geofence not found' })
  async getVehiclesByGeofenceId(@Param('id') id: string) {
    return this.geofencesService.getVehiclesByGeofenceId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new geofence' })
  @ApiResponse({ status: 201, description: 'The geofence has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createGeofence(@Body() createGeofenceDto: CreateGeofenceDto, @Req() req: Request) {
    // If no creatorId is provided, use the current user's id
    if (!createGeofenceDto.creatorId) {
      createGeofenceDto.creatorId = (req as any).user.id;
    }
    return this.geofencesService.createGeofence(createGeofenceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a geofence' })
  @ApiParam({ name: 'id', description: 'The id of the geofence' })
  @ApiResponse({ status: 200, description: 'The geofence has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Geofence not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateGeofence(
    @Param('id') id: string,
    @Body() updateGeofenceDto: UpdateGeofenceDto,
  ) {
    return this.geofencesService.updateGeofence(id, updateGeofenceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a geofence' })
  @ApiParam({ name: 'id', description: 'The id of the geofence' })
  @ApiResponse({ status: 200, description: 'The geofence has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Geofence not found' })
  async deleteGeofence(@Param('id') id: string) {
    return this.geofencesService.deleteGeofence(id);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Assign a vehicle to a geofence' })
  @ApiResponse({ status: 200, description: 'The vehicle has been successfully assigned to the geofence' })
  @ApiResponse({ status: 404, description: 'Vehicle or geofence not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async assignVehicleToGeofence(@Body() vehicleGeofenceDto: VehicleGeofenceDto) {
    return this.geofencesService.assignVehicleToGeofence(
      vehicleGeofenceDto.vehicleId,
      vehicleGeofenceDto.geofenceId,
    );
  }

  @Post('remove')
  @ApiOperation({ summary: 'Remove a vehicle from a geofence' })
  @ApiResponse({ status: 200, description: 'The vehicle has been successfully removed from the geofence' })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async removeVehicleFromGeofence(@Body() vehicleGeofenceDto: VehicleGeofenceDto) {
    return this.geofencesService.removeVehicleFromGeofence(
      vehicleGeofenceDto.vehicleId,
      vehicleGeofenceDto.geofenceId,
    );
  }
}