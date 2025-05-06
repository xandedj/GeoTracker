import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { insertAlertSchema } from '../../../../shared/schema';

export class CreateAlertDto implements z.infer<typeof insertAlertSchema> {
  @ApiProperty({
    example: 'speeding',
    description: 'The type of alert',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'Vehicle exceeding speed limit',
    description: 'The message for the alert',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: '123456',
    description: 'The ID of the vehicle',
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    example: false,
    description: 'Whether the alert has been acknowledged',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  acknowledged?: boolean;
}