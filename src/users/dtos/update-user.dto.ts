import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CuisineEnum } from 'src/enums/cuisine.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;
  @IsOptional()
  @IsString()
  lastName: string;
  @IsOptional()
  @IsString()
  email: string;
  @IsOptional()
  @IsString({
    each: true,
  })
  @IsOptional()
  @IsEnum(CuisineEnum, { each: true })
  favoriteCuisines: string[];
  @IsString({
    each: true,
  })
  @IsOptional()
  followedRestaurants: string[];
}
