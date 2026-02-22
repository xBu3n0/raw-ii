import { Module } from "@nestjs/common";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { AuthModule } from "./services/auth/auth.module";
import { AuthJwtModule } from "./common/jwt/auth-jwt.module";
import { AuthGuard } from "./common/guards/auth/auth.guard";
import { APP_GUARD } from "@nestjs/core/constants";
import { AuthListenerModule } from "./services/auth/auth-listener.module";

@Module({
    imports: [
        PrometheusModule.register({
            defaultMetrics: { enabled: true },
            path: "/metrics",
        }),
        AuthModule,
        AuthListenerModule,
        AuthJwtModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
