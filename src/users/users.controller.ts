import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationFilterDto } from 'src/dtos/pagination-filter.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Serialize(UserDto)
  async findAll(@Query() { page, limit }: PaginationFilterDto) {
    const { users, usersCount } = await this.usersService.findAll(page, limit);
    return {
      pagination: {
        page,
        limit,
        totalDocs: usersCount,
        totalPages: Math.ceil(usersCount / limit),
      },
      message: 'Users found successfully',
      data: users,
    };
  }

  @Get('/:id')
  @Serialize(UserDto)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'User found successfully',
      data: user,
    };
  }

  @Get('/:id/restaurants-recommendations')
  async findRestaurantsRecommendations(@Param('id') id: string) {
    const recommendations =
      await this.usersService.findSimilarUsersAndRestaurantsRecommendations(id);
    return {
      message: 'Restaurants recommendations found successfully',
      data: recommendations,
    };
  }
}
