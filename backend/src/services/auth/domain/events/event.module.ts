import { Module } from "@nestjs/common";
import { RmqApiModule } from "src/common/rmq/rmq-api.module";
import { UserCreated } from "./user-created.event";

@Module({
    imports: [RmqApiModule],
    providers: [UserCreated],
    exports: [UserCreated],
})
export class EventModule {}
