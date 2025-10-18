import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;
    if (!userId) return false;
    const user = await this.userService.findOneByIdentifier(userId);
    if (!user) {
      request.session.destroy?.();
      request.session.userId = null;
      return false;
    }

    return request.session.userId;
  }
}
