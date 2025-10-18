import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginationFilterDto } from 'src/dtos/pagination-filter.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const createdUser = await this.usersService.createOne(body);
    return {
      message: 'User created successfully',
      data: createdUser,
    };
  }

  @Get()
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
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'User found successfully',
      data: user,
    };
  }
}
