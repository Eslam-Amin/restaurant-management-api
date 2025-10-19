import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { isValidMongodbId } from '../utils/isValidMonodbId';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  createOne(body: CreateUserDto): Promise<User> {
    try {
      return this.userModel.create(body);
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(
        'Failed to create user due to => ' + err.message,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; usersCount: number }> {
    const skip = (page - 1) * limit;
    const [users, usersCount] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit),
      this.userModel.countDocuments(),
    ]);
    return {
      users,
      usersCount,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByIdentifier(identifier: string): Promise<User | null> {
    const filter = isValidMongodbId(identifier)
      ? { _id: identifier }
      : { email: identifier };
    const user = await this.userModel.findOne(filter);
    return user;
  }

  async updateOne(
    id: Types.ObjectId | string,
    attrs: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, attrs, {
      new: true,
    });
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async findSimilarUsersAndRestaurantsRecommendations(id: string) {
    const result = await this.userModel.aggregate([
      // Step 1: Get the current user's favorite cuisines
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $project: {
          favoriteCuisines: 1,
        },
      },

      // Step 2: Lookup other users who share any of these cuisines
      {
        $lookup: {
          from: 'users',
          let: { cuisines: '$favoriteCuisines', currentUserId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // Exclude the current user
                    { $ne: ['$_id', '$$currentUserId'] },
                    // At least one cuisine in common
                    {
                      $gt: [
                        {
                          $size: {
                            $setIntersection: [
                              '$favoriteCuisines',
                              '$$cuisines',
                            ],
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                favoriteCuisines: 1,
                followedRestaurants: 1,
              },
            },
          ],
          as: 'similarUsers',
        },
      },

      // Step 3: Collect unique restaurants followed by those similar users
      {
        $addFields: {
          followedRestaurantIds: {
            $reduce: {
              input: '$similarUsers.followedRestaurants',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          },
        },
      },

      // Step 4: Lookup restaurant documents
      {
        $lookup: {
          from: 'restaurants',
          localField: 'followedRestaurantIds',
          foreignField: '_id',
          as: 'recommendedRestaurants',
        },
      },

      // Step 5: Final projection
      {
        $project: {
          _id: 0,
          similarUsers: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            favoriteCuisines: 1,
          },
          recommendedRestaurants: {
            _id: 1,
            nameEn: 1,
            nameAr: 1,
            slug: 1,
            cuisines: 1,
          },
        },
      },
    ]);

    return result[0];
  }
}
