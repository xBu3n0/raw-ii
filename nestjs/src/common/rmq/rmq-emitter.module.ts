import { Module } from "@nestjs/common";
import {
    ClientProvider,
    ClientsModule,
    Transport,
} from "@nestjs/microservices";
import { RmqConfig } from "@/common/consts/rmq";
import { RmqEventEmitter } from "./rmq-event.emitter";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: "RMQ_EMITTER",
                useFactory: (): ClientProvider => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: RmqConfig.urls,
                        queue: RmqConfig.queue,
                        queueOptions: {
                            durable: true,
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [RmqEventEmitter],
    exports: [ClientsModule, RmqEventEmitter],
})
export class RmqApiModule {}
