import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CuisineEnum } from 'src/enums/cuisine.enum';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsOptional()
  @IsString()
  firstName: string;
  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsOptional()
  @IsString()
  lastName: string;
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsOptional()
  @IsString()
  email: string;
  @ApiProperty({
    example: ['Italian', 'Japanese'],
    description: 'The favorite cuisines of the user',
  })
  @IsOptional()
  @IsString({
    each: true,
  })
  @IsOptional()
  @IsEnum(CuisineEnum, { each: true })
  favoriteCuisines: string[];
  @ApiProperty({
    example: ['68f3db89193b77a107057409', '68f3db7a193b77a107057405'],
    description: 'The followed restaurants ids of the user',
  })
  @IsString({
    each: true,
  })
  @IsOptional()
  followedRestaurants: string[];
}
