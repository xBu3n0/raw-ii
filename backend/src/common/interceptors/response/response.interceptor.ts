import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";
import ApiResponse from "src/common/dtos/responses/api.response";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse> {
        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map((data: object) => {
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
