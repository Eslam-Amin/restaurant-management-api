import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LatLngDto {
  @IsNumber()
  @ApiProperty({ example: 37.774929, description: 'The latitude' })
  @Transform(({ value }) => parseFloat(value))
  lat: number;
  @IsNumber()
  @ApiProperty({ example: -122.419418, description: 'The longitude' })
  @Transform(({ value }) => parseFloat(value))
  lng: number;
}
