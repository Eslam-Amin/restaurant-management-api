import {
  UseInterceptors,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // this code to return the original data as it's in the response, not transformed
        let result = data?.data;
        if (result) {
          if (result?.toObject) {
            result = result.toObject({ virtuals: true });
          }
          if (Array.isArray(result)) {
            result = result.map((item) =>
              item?.toObject ? item.toObject({ virtuals: true }) : item,
            );
          }
          result = JSON.parse(JSON.stringify(result));
        }
        return {
          message: data?.message,
          pagination: data?.pagination,
          data:
            plainToInstance(this.dto, result, {
              excludeExtraneousValues: true,
            }) || {},
        };
      }),
    );
  }
}
