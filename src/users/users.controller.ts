import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationFilterDto } from 'src/dtos/pagination-filter.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Get all Users with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'The page number',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'The number of users per page',
    required: false,
  })
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
  @ApiOperation({ summary: 'Get a specific user by id' })
  @ApiResponse({
    status: 200,
    description: 'User returned successfully.',
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'User found successfully',
      data: user,
    };
  }

  @Get('/:id/restaurants-recommendations')
  @ApiOperation({
    summary: 'Get user recommendations, similar restaurants',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of Users Shared Similar Restaurants returned successfully.',
  })
  async findRestaurantsRecommendations(@Param('id') id: string) {
    const recommendations =
      await this.usersService.findSimilarUsersAndRestaurantsRecommendations(id);
    return {
      message: 'Restaurants recommendations found successfully',
      data: recommendations,
    };
  }
}
