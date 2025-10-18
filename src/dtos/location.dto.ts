import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  type: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: number[];
}
