import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { PaginationFilterDto } from '../dtos/pagination-filter.dto';
import { LatLngDto } from 'src/dtos/lat-lng.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.schema';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async create(@Body() body: CreateRestaurantDto) {
    const createdRestaurant = await this.restaurantsService.createOne(body);
    return {
      message: 'Restaurant created successfully',
      data: createdRestaurant,
    };
  }

  @Get()
  async findAll(
    @Query() { page, limit }: PaginationFilterDto,
    @Query('cuisine') cuisine?: string,
  ) {
    const { restaurantsCount, restaurants } =
      await this.restaurantsService.findAll(page, limit, cuisine);
    return {
      pagination: {
        page,
        limit,
        totalDocs: restaurantsCount,
        totalPages: Math.ceil(restaurantsCount / limit),
      },
      data: restaurants,
    };
  }

  @Get('nearby')
  async findNearbyRestaurants(
    @Query() { lat, lng }: LatLngDto,
    @Query() { page, limit }: PaginationFilterDto,
  ) {
    const { restaurants = [], restaurantsCount = 0 } =
      await this.restaurantsService.findNearby(lat, lng, page, limit);
    return {
      pagination: {
        page,
        limit,
        totalDocs: restaurantsCount,
        totalPages: Math.ceil(restaurantsCount / limit),
      },
      data: restaurants,
    };
  }

  @Get('/:identifier')
  async findByIdOrSlug(@Param('identifier') identifier: string) {
    return {
      message: 'Restaurant found successfully',
      data: await this.restaurantsService.findByIdentifier(identifier),
    };
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateRestaurantDto>,
  ) {
    return {
      message: 'Restaurant updated successfully',
      data: await this.restaurantsService.updateOne(id, body),
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.restaurantsService.deleteOne(id);
    return {
      message: 'Restaurant deleted successfully',
      data: {},
    };
  }

  @Patch('/:id/follow')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async followToggle(
    @Param('id') id: Types.ObjectId,
    @CurrentUser() currentUser: User,
  ) {
    return {
      message: 'Restaurant has been Followed successfully',
      data: await this.restaurantsService.follow(id, currentUser),
    };
  }

  @Patch('/:id/unfollow')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async unFollowToggle(
    @Param('id') id: Types.ObjectId,
    @CurrentUser() currentUser: User,
  ) {
    return {
      message: 'Restaurant has been Unfollowed successfully',
      data: await this.restaurantsService.unfollow(id, currentUser),
    };
  }
}
