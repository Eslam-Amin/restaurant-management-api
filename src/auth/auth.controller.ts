import {
  Controller,
  Post,
  Body,
  Session,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.schema';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user?._id;
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user._id;
    return {
      message: 'User logged in successfully',
      data: user,
    };
  }

  @Post('/logout')
  async logout(@Session() session: any) {
    session.userId = null;
    return {
      message: 'User logged out successfully',
    };
  }

  @Get('/whoami')
  async whoami(@CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException('Unauthorized');
    return {
      message: 'User fetched successfully',
      data: user,
    };
  }
}
