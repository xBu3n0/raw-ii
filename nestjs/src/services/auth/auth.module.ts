import { Module } from "@nestjs/common";
import { AuthController } from "./infrastructure/controllers/auth.controller";
import { AuthService } from "./application/services/auth.service";
import { LoginUseCase } from "./application/useCases/login/login.use-case";
import { PrismaModule } from "@/common/prisma/prisma.module";
import { RegisterUseCase } from "./application/useCases/register/register.use-case";
import { AuthUserRepository } from "./infrastructure/repositories/auth-user.repository";
import { AuthJwtModule } from "@/common/jwt/auth-jwt.module";
import { AuthJwtService } from "@/common/jwt/auth-jwt.service";
import { RmqApiModule } from "@/common/rmq/rmq-emitter.module";
import { RmqEventEmitter } from "@/common/rmq/rmq-event.emitter";

@Module({
    imports: [PrismaModule, AuthJwtModule, RmqApiModule],
    providers: [
        // Auth
        AuthService,
        {
            provide: "AUTH_USER_REPOSITORY",
            useClass: AuthUserRepository,
        },
        {
            provide: "AUTH_JWT_SERVICE",
            useClass: AuthJwtService,
        },
        // UseCases
        RegisterUseCase,
        LoginUseCase,
        // EventEmitter
        {
            provide: "RMQ_EVENT_EMMITER",
            useClass: RmqEventEmitter,
        },
    ],
    controllers: [AuthController],
})
export class AuthModule {}
