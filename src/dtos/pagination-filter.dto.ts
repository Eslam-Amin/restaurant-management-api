import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationFilterDto {
  @IsOptional()
  @ApiProperty({ example: 1, description: 'The page number' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @IsOptional()
  @ApiProperty({ example: 10, description: 'The limit number' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;
}
