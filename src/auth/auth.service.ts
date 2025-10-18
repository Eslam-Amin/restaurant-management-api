import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../users/user.schema';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(body: CreateUserDto): Promise<User> {
    const { email, password } = body;
    const existingUser = await this.usersService.findOneByIdentifier(email);
    if (existingUser) throw new BadRequestException('Email in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    body.password = hashedPassword;
    const user = await this.usersService.createOne(body);
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByIdentifier(email);
    if (!user) throw new NotFoundException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new NotFoundException('Invalid credentials');

    return user;
  }
}
