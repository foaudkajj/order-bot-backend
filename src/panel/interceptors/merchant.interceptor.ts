import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class MerchantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const merchantId = request?.user?.merchantId;
    request.merchantId = merchantId;
    return next.handle();
  }
}
