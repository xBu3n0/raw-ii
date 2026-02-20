import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionsFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response/response.interceptor";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: "*",
        Credential: true,
    });

    app.setGlobalPrefix("/api/v1");
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors: ValidationError[]) => {
                const errorsMsg: Record<string, string[]> = {};

                errors.forEach(
                    (err) =>
                        (errorsMsg[err.property] = Object.values(
                            err.constraints ?? {},
                        ).map((v) => v)),
                );

                throw new BadRequestException("Invalid input", {
                    cause: errorsMsg,
                    description: "Invalid input",
                });
            },
        }),
    );
    // Handle responses
    app.useGlobalInterceptors(new ResponseInterceptor());
    // Handle exceptions
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new HttpExceptionsFilter(httpAdapterHost));

    await app.listen(80);
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
