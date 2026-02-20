import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { AuthModule } from "./services/auth/auth.module";
import { AuthJwtModule } from "./common/jwt/auth-jwt.module";

@Module({
    imports: [
        PrometheusModule.register({
            defaultMetrics: { enabled: true },
            path: "/metrics",
        }),
        AuthModule,
        AuthJwtModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
