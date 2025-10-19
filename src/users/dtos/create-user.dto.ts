import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CuisineEnum } from 'src/enums/cuisine.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  firstName: string;
  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  lastName: string;
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsString()
  email: string;
  @ApiProperty({ example: 'password', description: 'The password of the user' })
  @IsString()
  password: string;
  @ApiProperty({
    example: ['Italian', 'Japanese'],
    description: 'The favorite cuisines of the user',
  })
  @IsString({
    each: true,
  })
  @IsOptional()
  @IsEnum(CuisineEnum, { each: true })
  favoriteCuisines: CuisineEnum[];
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
