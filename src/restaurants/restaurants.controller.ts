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
  ParseEnumPipe,
  BadRequestException,
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
import { CuisineEnum } from 'src/enums/cuisine.enum';
import { LowercasePipe } from 'src/pipes/lowerCase.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('restaurants')
@ApiTags('Restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created successfully',
  })
  @ApiBody({
    description: 'Restaurant data',
    schema: {
      type: 'object',
      properties: {
        nameEn: { type: 'string' },
        nameAr: { type: 'string' },
        slug: { type: 'string' },
        cuisines: { type: 'array', items: { type: 'string' } },
        location: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            coordinates: { type: 'array', items: { type: 'number' } },
          },
        },
      },
    },
  })
  async create(@Body() body: CreateRestaurantDto) {
    const createdRestaurant = await this.restaurantsService.createOne(body);
    return {
      message: 'Restaurant created successfully',
      data: createdRestaurant,
    };
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all restaurants with pagination, and ability to filter by cuisine',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurants found successfully',
  })
  @ApiQuery({
    name: 'cuisine',
    type: String,
    description: 'The cuisine of the restaurants',
    required: false,
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
    description: 'The number of restaurants per page',
    required: false,
  })
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
  @ApiOperation({ summary: 'Get nearby restaurants with pagination' })
  @ApiResponse({
    status: 200,
    description:
      'Nearby restaurants found successfully by latitude and longitude',
  })
  @ApiQuery({
    name: 'lat',
    type: Number,
    description: 'The latitude of the location',
  })
  @ApiQuery({
    name: 'lng',
    type: Number,
    description: 'The longitude of the location',
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
    description: 'The number of restaurants per page',
    required: false,
  })
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
  @ApiOperation({ summary: 'Get a restaurant by identifier or slug' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant found successfully by identifier or slug',
  })
  async findByIdOrSlug(@Param('identifier') identifier: string) {
    return {
      message: 'Restaurant found successfully',
      data: await this.restaurantsService.findByIdentifier(identifier),
    };
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update a restaurant by id' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated successfully by id',
  })
  @ApiBody({
    description: 'Restaurant data',
    schema: {
      type: 'object',
      properties: {
        nameEn: { type: 'string' },
        nameAr: { type: 'string' },
        slug: { type: 'string' },
        cuisines: { type: 'array', items: { type: 'string' } },
        location: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            coordinates: { type: 'array', items: { type: 'number' } },
          },
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Delete a restaurant by id' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant deleted successfully by id',
  })
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
  @ApiOperation({ summary: 'Follow a restaurant by id' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant followed successfully by id',
  })
  async followRestaurant(
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
  @ApiOperation({ summary: 'Unfollow a restaurant by id' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant unfollowed successfully by id',
  })
  async unFollowRestaurant(
    @Param('id') id: Types.ObjectId,
    @CurrentUser() currentUser: User,
  ) {
    return {
      message: 'Restaurant has been Unfollowed successfully',
      data: await this.restaurantsService.unfollow(id, currentUser),
    };
  }

  @Patch('/:cuisine/favorite')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Add a cuisine to favorites' })
  @ApiResponse({
    status: 200,
    description: 'Cuisine added to favorites successfully',
  })
  async favoriteCuisineToggle(
    @Param(
      'cuisine',
      LowercasePipe,
      new ParseEnumPipe(CuisineEnum, {
        exceptionFactory: (error) =>
          new BadRequestException('Invalid Cuisine Provided'),
      }),
    )
    cuisine: CuisineEnum,
    @CurrentUser() currentUser: User,
  ) {
    return {
      message: 'Cuisine has been added to favorites successfully',
      data: await this.restaurantsService.addCuisineToFavorites(
        cuisine,
        currentUser,
      ),
    };
  }

  @Patch('/:cuisine/unfavorite')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Remove a cuisine from favorites' })
  @ApiResponse({
    status: 200,
    description: 'Cuisine removed from favorites successfully',
  })
  async unfavoriteCuisineToggle(
    @Param(
      'cuisine',
      LowercasePipe,
      new ParseEnumPipe(CuisineEnum, {
        exceptionFactory: (error) =>
          new BadRequestException('Invalid Cuisine Provided'),
      }),
    )
    cuisine: CuisineEnum,
    @CurrentUser() currentUser: User,
  ) {
    return {
      message: 'Cuisine has been removed from favorites successfully',
      data: await this.restaurantsService.removeCuisineFromFavorites(
        cuisine,
        currentUser,
      ),
    };
  }
}
