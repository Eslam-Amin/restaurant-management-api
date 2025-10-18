import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
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
}
