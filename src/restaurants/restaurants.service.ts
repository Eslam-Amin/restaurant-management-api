import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Restaurant, RestaurantDocument } from './restaurant.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { isValidMongodbId } from '../utils/isValidMonodbId';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private usersService: UsersService,
  ) {}

  async createOne(createDto: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const createdRestaurant = await this.restaurantModel.create(createDto);
      return createdRestaurant;
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Restaurant with this slug already exists');
      }
      throw new InternalServerErrorException(
        'Failed to create restaurant due to => ' + err.message,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    cuisine?: string,
  ): Promise<{ restaurantsCount: number; restaurants: Restaurant[] }> {
    const filter = cuisine ? { cuisines: cuisine } : {};
    const skip = (page - 1) * limit;

    const restaurantsCount = await this.restaurantModel
      .countDocuments(filter)
      .collation({ strength: 2, locale: 'en' });
    const restaurants = await this.restaurantModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .collation({ strength: 2, locale: 'en' }); // strength 2 is to ignore case sensitivity in search
    return { restaurantsCount, restaurants };
  }

  async findByIdentifier(identifier: string): Promise<Restaurant> {
    let restaurant: Restaurant | null;
    if (isValidMongodbId(identifier))
      restaurant = await this.restaurantModel.findById(identifier);
    else restaurant = await this.restaurantModel.findOne({ slug: identifier });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async updateOne(
    id: string,
    updateDto: Partial<CreateRestaurantDto>,
  ): Promise<Restaurant> {
    const updatedRestaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      updateDto,
      { new: true },
    );
    if (!updatedRestaurant) throw new NotFoundException('Restaurant not found');
    return updatedRestaurant;
  }

  async deleteOne(id: string): Promise<void> {
    const deletedRestaurant = await this.restaurantModel.findByIdAndDelete(id);
    if (!deletedRestaurant) throw new NotFoundException('Restaurant not found');
  }

  async findNearby(
    lat: number,
    lng: number,
    page: number,
    limit: number,
  ): Promise<{ restaurantsCount: number; restaurants: Restaurant[] }> {
    const skip = (page - 1) * limit;

    const result = await this.restaurantModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          maxDistance: 50000, // adjust as needed
          distanceField: 'distance',
          spherical: true,
        },
      },
      {
        $facet: {
          // First sub-pipeline to return the list of restaurants
          restaurants: [
            {
              // Skipping for pagination, if needed
              $skip: skip,
            },
            {
              // Limiting the number of results, adjust as needed
              $limit: limit,
            },
          ],
          // Second sub-pipeline to count the total number of restaurants
          totalCount: [
            {
              $count: 'total',
            },
          ],
        },
      },
      {
        $project: {
          restaurants: 1,
          restaurantsCount: {
            $arrayElemAt: ['$totalCount.total', 0],
          },
        },
      },
    ]);
    return {
      ...result[0],
    };
  }

  async follow(id: Types.ObjectId, currentUser: User) {
    await this.findByIdentifier(id.toString());
    if (currentUser.followedRestaurants.includes(id)) {
      throw new BadRequestException('Restaurant already followed');
    }
    return this.usersService.updateOne(currentUser.id, {
      followedRestaurants: [...currentUser.followedRestaurants, id],
    });
  }

  async unfollow(id: Types.ObjectId, currentUser: User) {
    await this.findByIdentifier(id.toString());
    if (!currentUser.followedRestaurants.includes(id)) {
      throw new BadRequestException('Restaurant not followed');
    }
    return this.usersService.updateOne(currentUser.id, {
      followedRestaurants: currentUser.followedRestaurants.filter(
        (restaurantId) => restaurantId.toString() !== id.toString(),
      ),
    });
  }
}
