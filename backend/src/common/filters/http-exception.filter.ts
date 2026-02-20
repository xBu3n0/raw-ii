import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import ApiResponse from "../dtos/responses/api.response";

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: HttpException, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const statusName = HttpStatus[statusCode];

        const responseBody = {
            status: `${statusCode} ${statusName}`,
            data: null,
            error: exception.message,
            errors: exception.cause ?? {},
            statusCode: statusCode,
        } as ApiResponse;

        httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
}
