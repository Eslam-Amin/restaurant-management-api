import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class LatLngDto {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat: number;
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lng: number;
}
