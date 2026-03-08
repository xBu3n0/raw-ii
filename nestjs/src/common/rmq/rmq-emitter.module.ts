import { Module } from "@nestjs/common";
import {
    ClientProvider,
    ClientsModule,
    Transport,
} from "@nestjs/microservices";
import { RmqEventEmitter } from "./rmq-event.emitter";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: "RMQ_EMITTER",
                useFactory: (): ClientProvider => ({
                    transport: Transport.RMQ,
                    options: {
                        transport: Transport.RMQ,
                        urls: [process.env.RMQ_URL ?? ""],
                        exchange: "auth-exchange",
                        queue: "auth",
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
