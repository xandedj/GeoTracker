import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { insertMaintenanceRecordSchema } from '../../../../shared/schema';

export class CreateMaintenanceRecordDto implements z.infer<typeof insertMaintenanceRecordSchema> {
  @ApiProperty({
    example: '123456',
    description: 'The ID of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    example: 'oil_change',
    description: 'The type of maintenance',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'Regular oil change service',
    description: 'Description of the maintenance',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2023-06-15T14:00:00Z',
    description: 'Date when the maintenance was performed',
  })
  @IsDateString()
  @IsNotEmpty()
  performedAt: string;

  @ApiProperty({
    example: 15000,
    description: 'Odometer reading at the time of maintenance',
  })
  @IsNumber()
  @IsOptional()
  odometer?: number;

  @ApiProperty({
    example: 150.75,
    description: 'Cost of the maintenance',
  })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiProperty({
    example: '2023-12-15T14:00:00Z',
    description: 'Date when the next maintenance is due',
  })
  @IsDateString()
  @IsOptional()
  nextDueDate?: string;

  @ApiProperty({
    example: 'Automotive Workshop Inc.',
    description: 'Provider who performed the maintenance',
  })
  @IsString()
  @IsOptional()
  provider?: string;
}

export class UpdateMaintenanceRecordDto implements Partial<z.infer<typeof insertMaintenanceRecordSchema>> {
  @ApiProperty({
    example: 'oil_change',
    description: 'The type of maintenance',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    example: 'Regular oil change service',
    description: 'Description of the maintenance',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2023-06-15T14:00:00Z',
    description: 'Date when the maintenance was performed',
  })
  @IsDateString()
  @IsOptional()
  performedAt?: string;

  @ApiProperty({
    example: 15000,
    description: 'Odometer reading at the time of maintenance',
  })
  @IsNumber()
  @IsOptional()
  odometer?: number;

  @ApiProperty({
    example: 150.75,
    description: 'Cost of the maintenance',
  })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiProperty({
    example: '2023-12-15T14:00:00Z',
    description: 'Date when the next maintenance is due',
  })
  @IsDateString()
  @IsOptional()
  nextDueDate?: string;

  @ApiProperty({
    example: 'Automotive Workshop Inc.',
    description: 'Provider who performed the maintenance',
  })
  @IsString()
  @IsOptional()
  provider?: string;
}