import { Module } from "@nestjs/common";
import { AuthJwtService } from "./auth-jwt.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "../consts/jwt";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: JwtConfig.secret,
            signOptions: { expiresIn: "5min" },
        }),
    ],
    controllers: [],
    providers: [AuthJwtService],
    exports: [AuthJwtService],
})
export class AuthJwtModule {}
