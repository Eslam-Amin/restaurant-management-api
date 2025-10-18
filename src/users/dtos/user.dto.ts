import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;
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
  followedRestaurants: string[];
  @Expose()
  favoriteCuisines: string[];
}
