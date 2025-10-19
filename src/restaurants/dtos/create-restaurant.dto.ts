import {
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LocationDto } from '../../dtos/location.dto';
import { CuisineEnum } from '../../enums/cuisine.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Restaurant Name',
    description: 'The name of the restaurant in English',
  })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({
    example: 'اسم المطعم',
    description: 'The name of the restaurant in Arabic',
  })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty({
    example: 'restaurant-name',
    description: 'The slug of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: ['Italian', 'Japanese'],
    description: 'The cuisines of the restaurant',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsEnum(CuisineEnum, { each: true, message: 'Invalid Cuisine Provided' })
  @Transform(({ value }) => value.map((cuisine) => cuisine.toLowerCase()))
  cuisines: CuisineEnum[];

  @ApiProperty({
    example: { latitude: 37.774929, longitude: -122.419418 },
    description: 'The location of the restaurant',
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
