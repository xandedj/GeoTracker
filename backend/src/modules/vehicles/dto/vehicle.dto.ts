import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { insertVehicleSchema } from '../../../../shared/schema';

export class CreateVehicleDto implements z.infer<typeof insertVehicleSchema> {
  @ApiProperty({
    example: 'Toyota Corolla',
    description: 'The make and model of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    example: 'ABC-1234',
    description: 'The license plate of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({
    example: '2020',
    description: 'The year of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({
    example: 'Blue',
    description: 'The color of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: 'active',
    description: 'The status of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    example: 'user123',
    description: 'The ID of the vehicle owner',
  })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({
    example: 'org123',
    description: 'The ID of the organization the vehicle belongs to',
  })
  @IsString()
  @IsOptional()
  organizationId?: string;
}

export class UpdateVehicleDto implements Partial<z.infer<typeof insertVehicleSchema>> {
  @ApiProperty({
    example: 'Toyota Corolla',
    description: 'The make and model of the vehicle',
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    example: 'ABC-1234',
    description: 'The license plate of the vehicle',
  })
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @ApiProperty({
    example: '2020',
    description: 'The year of the vehicle',
  })
  @IsString()
  @IsOptional()
  year?: string;

  @ApiProperty({
    example: 'Blue',
    description: 'The color of the vehicle',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: 'active',
    description: 'The status of the vehicle',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'org123',
    description: 'The ID of the organization the vehicle belongs to',
  })
  @IsString()
  @IsOptional()
  organizationId?: string;
}