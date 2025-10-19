import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @IsString()
  @ApiProperty({ example: 'Point', description: 'The type of the location' })
  type: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ApiProperty({
    example: [37.774929, -122.419418],
    description: 'The coordinates of the location',
  })
  coordinates: number[];
}
