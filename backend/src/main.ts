import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionsFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response/response.interceptor";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppListenerModule } from "./app-listener.module";

async function initRmq() {
    const rmq = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppListenerModule,
        {
            transport: Transport.RMQ,
            options: {
                transport: Transport.RMQ,
                urls: [process.env.RMQ_URL!],
                exchange: "raw-ii",
                queue: "auth",
                wildcards: true,
                queueOptions: {
                    durable: true,
                },
            },
        },
    );

    await rmq.listen();
}

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

    // Swagger
    const config = new DocumentBuilder()
        .setTitle("Raw II")
        .setDescription("Raw II API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, documentFactory);

    // Handle responses
    app.useGlobalInterceptors(new ResponseInterceptor());
    // Handle exceptions
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new HttpExceptionsFilter(httpAdapterHost));

    await initRmq();

    await app.listen(80);
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
