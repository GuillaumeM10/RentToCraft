import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        return this.transformDates(data);
      }),
    );
  }

  private transformDates<T>(obj: T): T {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (obj instanceof Date) {
      return obj.toISOString() as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformDates(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const transformed: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Date) {
          transformed[key] = value.toISOString();
        } else if (typeof value === 'object' && value !== null) {
          transformed[key] = this.transformDates(value);
        } else {
          transformed[key] = value;
        }
      }
      return transformed as T;
    }

    return obj;
  }
}
