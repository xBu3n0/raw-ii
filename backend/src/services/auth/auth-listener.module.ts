import { Module } from "@nestjs/common";
import { AuthListener } from "./infrastructure/listeners/auth.listener";

@Module({
    imports: [],
    providers: [],
    controllers: [AuthListener],
})
export class AuthListenerModule {}
