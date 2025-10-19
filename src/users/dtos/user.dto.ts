import { Expose } from 'class-transformer';
import { Restaurant } from 'src/restaurants/restaurant.schema';
import { CuisineEnum } from 'src/enums/cuisine.enum';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  _id: string;
  @Expose()
  email: string;
  @Expose()
  username: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  fullName: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  followedRestaurants: Restaurant[];
  @Expose()
  favoriteCuisines: CuisineEnum[];
}
