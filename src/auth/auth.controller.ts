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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
@Controller('auth')
@Serialize(UserDto)
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiBody({
    description: 'User data',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        favoriteCuisines: { type: 'array', items: { type: 'string' } },
        followedRestaurants: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user?._id;
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiBody({
    description: 'User data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Body() body: LoginDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user._id;
    return {
      message: 'User logged in successfully',
      data: user,
    };
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  async logout(@Session() session: any) {
    session.userId = null;
    return {
      message: 'User logged out successfully',
    };
  }

  @Get('/whoami')
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
  })
  async whoami(@CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException('Unauthorized');
    return {
      message: 'User fetched successfully',
      data: user,
    };
  }
}
