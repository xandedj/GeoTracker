import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceRecordDto, UpdateMaintenanceRecordDto } from './dto/maintenance.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('maintenance')
@Controller('maintenance')
@UseGuards(AuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all maintenance records' })
  @ApiResponse({ status: 200, description: 'Return all maintenance records' })
  async getAllMaintenanceRecords() {
    return this.maintenanceService.getAllMaintenanceRecords();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a maintenance record by id' })
  @ApiParam({ name: 'id', description: 'The id of the maintenance record' })
  @ApiResponse({ status: 200, description: 'Return the maintenance record' })
  @ApiResponse({ status: 404, description: 'Maintenance record not found' })
  async getMaintenanceRecordById(@Param('id') id: string) {
    return this.maintenanceService.getMaintenanceRecordById(id);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get maintenance records by vehicle id' })
  @ApiParam({ name: 'vehicleId', description: 'The id of the vehicle' })
  @ApiResponse({ status: 200, description: 'Return the maintenance records' })
  async getMaintenanceRecordsByVehicleId(@Param('vehicleId') vehicleId: string) {
    return this.maintenanceService.getMaintenanceRecordsByVehicleId(vehicleId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new maintenance record' })
  @ApiResponse({ status: 201, description: 'The maintenance record has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createMaintenanceRecord(@Body() createMaintenanceRecordDto: CreateMaintenanceRecordDto) {
    return this.maintenanceService.createMaintenanceRecord(createMaintenanceRecordDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a maintenance record' })
  @ApiParam({ name: 'id', description: 'The id of the maintenance record' })
  @ApiResponse({ status: 200, description: 'The maintenance record has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Maintenance record not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateMaintenanceRecord(
    @Param('id') id: string,
    @Body() updateMaintenanceRecordDto: UpdateMaintenanceRecordDto,
  ) {
    return this.maintenanceService.updateMaintenanceRecord(id, updateMaintenanceRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a maintenance record' })
  @ApiParam({ name: 'id', description: 'The id of the maintenance record' })
  @ApiResponse({ status: 200, description: 'The maintenance record has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Maintenance record not found' })
  async deleteMaintenanceRecord(@Param('id') id: string) {
    return this.maintenanceService.deleteMaintenanceRecord(id);
  }
}