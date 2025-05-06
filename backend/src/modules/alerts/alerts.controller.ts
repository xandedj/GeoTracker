import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/alert.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('alerts')
@Controller('alerts')
@UseGuards(AuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alerts' })
  @ApiResponse({ status: 200, description: 'Return all alerts' })
  async getAllAlerts() {
    return this.alertsService.getAllAlerts();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active alerts' })
  @ApiResponse({ status: 200, description: 'Return all active alerts' })
  async getActiveAlerts() {
    return this.alertsService.getActiveAlerts();
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get alerts for a specific vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'The ID of the vehicle' })
  @ApiResponse({ status: 200, description: 'Return alerts for the vehicle' })
  async getAlertsByVehicleId(@Param('vehicleId') vehicleId: string) {
    return this.alertsService.getAlertsByVehicleId(vehicleId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({ status: 201, description: 'The alert has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an alert' })
  @ApiParam({ name: 'id', description: 'The ID of the alert' })
  @ApiResponse({ status: 200, description: 'The alert has been successfully acknowledged' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async acknowledgeAlert(@Param('id') id: string) {
    return this.alertsService.acknowledgeAlert(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an alert' })
  @ApiParam({ name: 'id', description: 'The ID of the alert' })
  @ApiResponse({ status: 200, description: 'The alert has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async deleteAlert(@Param('id') id: string) {
    return this.alertsService.deleteAlert(id);
  }
}