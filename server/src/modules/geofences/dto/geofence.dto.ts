import { IsNotEmpty, IsOptional, IsString, IsObject, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { insertGeofenceSchema } from '../../../../shared/schema';
import { Type } from 'class-transformer';

class GeoPoint {
  @ApiProperty({
    example: 40.7128,
    description: 'Latitude coordinate',
  })
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    example: -74.006,
    description: 'Longitude coordinate',
  })
  @IsNotEmpty()
  lng: number;
}

export class CreateGeofenceDto implements z.infer<typeof insertGeofenceSchema> {
  @ApiProperty({
    example: 'Office Zone',
    description: 'The name of the geofence',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'circle',
    description: 'The type of geofence (circle, polygon)',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'This is the office zone',
    description: 'Description of the geofence',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: { lat: 40.7128, lng: -74.006 },
    description: 'Center point for circular geofence',
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPoint)
  center?: GeoPoint;

  @ApiProperty({
    example: 500,
    description: 'Radius in meters for circular geofence',
  })
  @IsOptional()
  radius?: number;

  @ApiProperty({
    example: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7129, lng: -74.007 },
      { lat: 40.7130, lng: -74.008 },
    ],
    description: 'Array of points for polygon geofence',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(3)
  @Type(() => GeoPoint)
  points?: GeoPoint[];

  @ApiProperty({
    example: '123456',
    description: 'The ID of the creator',
  })
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @ApiProperty({
    example: '123456',
    description: 'The ID of the organization',
  })
  @IsString()
  @IsOptional()
  organizationId?: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Color for displaying the geofence',
  })
  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateGeofenceDto implements Partial<z.infer<typeof insertGeofenceSchema>> {
  @ApiProperty({
    example: 'Office Zone',
    description: 'The name of the geofence',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'This is the office zone',
    description: 'Description of the geofence',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: { lat: 40.7128, lng: -74.006 },
    description: 'Center point for circular geofence',
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPoint)
  center?: GeoPoint;

  @ApiProperty({
    example: 500,
    description: 'Radius in meters for circular geofence',
  })
  @IsOptional()
  radius?: number;

  @ApiProperty({
    example: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7129, lng: -74.007 },
      { lat: 40.7130, lng: -74.008 },
    ],
    description: 'Array of points for polygon geofence',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(3)
  @Type(() => GeoPoint)
  points?: GeoPoint[];

  @ApiProperty({
    example: '#FF5733',
    description: 'Color for displaying the geofence',
  })
  @IsString()
  @IsOptional()
  color?: string;
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