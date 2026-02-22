import { Module } from "@nestjs/common";
import { AuthController } from "./infrastructure/controllers/auth.controller";
import { AuthService } from "./application/services/auth.service";
import { LoginUseCase } from "./application/useCases/login.use-case";
import { PrismaModule } from "@/common/prisma/prisma.module";
import { EventModule } from "./domain/events/event.module";
import { RegisterUseCase } from "./application/useCases/register.use-case";
import { AuthUserRepository } from "./infrastructure/repositories/auth-user.repository";
import { AuthJwtModule } from "@/common/jwt/auth-jwt.module";

@Module({
    imports: [PrismaModule, EventModule, AuthJwtModule],
    providers: [
        AuthService,
        RegisterUseCase,
        LoginUseCase,
        {
            provide: "AUTH_USER_REPOSITORY",
            useClass: AuthUserRepository,
        },
    ],
    controllers: [AuthController],
})
export class AuthModule {}
