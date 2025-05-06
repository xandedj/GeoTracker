import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { insertLocationHistorySchema } from '../../../../shared/schema';

export class CreateLocationDto implements z.infer<typeof insertLocationHistorySchema> {
  @ApiProperty({
    example: '123456',
    description: 'The device ID',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    example: '123456',
    description: 'The vehicle ID',
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    example: 40.7128,
    description: 'The latitude',
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    example: -74.006,
    description: 'The longitude',
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    example: 65,
    description: 'The speed in km/h',
  })
  @IsNumber()
  @IsOptional()
  speed?: number;

  @ApiProperty({
    example: 270,
    description: 'The heading in degrees',
  })
  @IsNumber()
  @IsOptional()
  heading?: number;

  @ApiProperty({
    example: 100,
    description: 'The altitude in meters',
  })
  @IsNumber()
  @IsOptional()
  altitude?: number;
}

export class LocationQueryDto {
  @ApiProperty({
    example: 10,
    description: 'The maximum number of records to return',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The start date for filtering records',
    required: false,
  })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    example: '2023-01-31T23:59:59Z',
    description: 'The end date for filtering records',
    required: false,
  })
  @IsString()
  @IsOptional()
  endDate?: string;
}