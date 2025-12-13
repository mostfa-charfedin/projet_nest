import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RoleFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const urlPath = request.url || '';
    let role = 'client';

    if (urlPath.startsWith('/admin')) {
      role = 'admin';
    } else if (urlPath.startsWith('/client')) {
      role = 'client';
    }

    role =
      request.headers['x-user-role'] ||
      request.query.role ||
      request.body?.role ||
      role;

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((user) => this.filterUserFields(user, role));
        }

        if (data && typeof data === 'object') {
          return this.filterUserFields(data, role);
        }

        return data;
      }),
    );
  }

  private filterUserFields(user: any, role: string): any {
    if (!user) return user;

    if (role === 'admin') {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
