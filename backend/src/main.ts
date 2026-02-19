import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(80);
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
