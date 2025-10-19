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

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsEnum(CuisineEnum, { each: true, message: 'Invalid Cuisine Provided' })
  @Transform(({ value }) => value.map((cuisine) => cuisine.toLowerCase()))
  cuisines: CuisineEnum[];

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
