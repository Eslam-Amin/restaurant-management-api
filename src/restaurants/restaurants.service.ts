import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './restaurant.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createDto: CreateRestaurantDto): Promise<Restaurant> {
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

    const restaurantsCount = await this.restaurantModel.countDocuments(filter);
    const restaurants = await this.restaurantModel
      .find(filter)
      .skip(skip)
      .limit(limit);
    return { restaurantsCount, restaurants };
  }

  async findByIdOrSlug(idOrSlug: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: string, updateDto: any): Promise<Restaurant> {
    const updated = await this.restaurantModel.findByIdAndUpdate(
      id,
      updateDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Restaurant not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.restaurantModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Restaurant not found');
  }

  async findNearby(lat: number, lng: number): Promise<Restaurant[]> {
    return this.restaurantModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance: 1000, // 1 KM
          spherical: true,
        },
      },
    ]);
  }
}
