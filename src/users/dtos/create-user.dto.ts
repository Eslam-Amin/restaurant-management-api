import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CuisineEnum } from 'src/enums/cuisine.enum';

export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString({
    each: true,
  })
  @IsOptional()
  @IsEnum(CuisineEnum, { each: true })
  favoriteCuisines: string[];
}
