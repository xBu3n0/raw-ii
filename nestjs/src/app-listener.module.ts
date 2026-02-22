import { Module } from "@nestjs/common";
import { AuthListenerModule } from "./services/auth/auth-listener.module";

@Module({
    imports: [AuthListenerModule],
    controllers: [],
    providers: [],
})
export class AppListenerModule {}
