import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { map, Observable } from "rxjs";
import ApiResponse from "@/common/dtos/responses/api.response";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept<T>(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiResponse<T>> | Observable<T> {
        const response = context.switchToHttp().getResponse<Response>();

        // Skip transformation for Prometheus metrics endpoint
        if (
            context.switchToHttp().getRequest<Request>().path ===
            "/api/v1/metrics"
        ) {
            return next.handle();
        }

        return next.handle().pipe(
            map((data: T) => {
                const statusCode = response.statusCode;
                const statusName = HttpStatus[response.statusCode];

                return {
                    status: `${statusCode} ${statusName}`,
                    data,
                    error: null,
                    errors: {},
                    statusCode,
                };
            }),
        );
    }
}
