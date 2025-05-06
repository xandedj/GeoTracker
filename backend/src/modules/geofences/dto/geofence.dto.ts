import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { insertGeofenceSchema } from '../../../../shared/schema';

export class CreateGeofenceDto implements z.infer<typeof insertGeofenceSchema> {
  @ApiProperty({
    example: '123456',
    description: 'The ID of the creator (user)',
  })
  @IsString()
  @IsOptional()
  creatorId?: string;

  @ApiProperty({
    example: '789012',
    description: 'The ID of the organization',
  })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    example: 'Office Area',
    description: 'Name of the geofence',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'polygon',
    description: 'Type of geofence (polygon, circle)',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: '[{"lat": 37.7749, "lng": -122.4194}, {"lat": 37.7749, "lng": -122.4294}, {"lat": 37.7849, "lng": -122.4194}]',
    description: 'Coordinates defining the geofence boundary',
  })
  @IsString()
  @IsNotEmpty()
  coordinates: string;

  @ApiProperty({
    example: 'Red',
    description: 'Color of the geofence on the map',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: 'Restricted area',
    description: 'Description of the geofence',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'true',
    description: 'Whether alerts should be generated for this geofence',
  })
  @IsString()
  @IsOptional()
  alertsEnabled?: string;
}

export class UpdateGeofenceDto implements Partial<z.infer<typeof insertGeofenceSchema>> {
  @ApiProperty({
    example: 'Office Area',
    description: 'Name of the geofence',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'polygon',
    description: 'Type of geofence (polygon, circle)',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    example: '[{"lat": 37.7749, "lng": -122.4194}, {"lat": 37.7749, "lng": -122.4294}, {"lat": 37.7849, "lng": -122.4194}]',
    description: 'Coordinates defining the geofence boundary',
  })
  @IsString()
  @IsOptional()
  coordinates?: string;

  @ApiProperty({
    example: 'Red',
    description: 'Color of the geofence on the map',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: 'Restricted area',
    description: 'Description of the geofence',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'true',
    description: 'Whether alerts should be generated for this geofence',
  })
  @IsString()
  @IsOptional()
  alertsEnabled?: string;
}

export class VehicleGeofenceDto {
  @ApiProperty({
    example: '123456',
    description: 'The ID of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    example: '789012',
    description: 'The ID of the geofence',
  })
  @IsString()
  @IsNotEmpty()
  geofenceId: string;
}