import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.schema';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
      session?: {
        userId?: string;
      };
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req?.session || {};
    if (userId) {
      const user = await this.usersService.findOneByIdentifier(userId);
      if (user) req.currentUser = user;
    }
    return next();
  }
}
