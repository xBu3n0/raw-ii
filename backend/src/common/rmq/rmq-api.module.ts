import { Module } from "@nestjs/common";
import { RmqApiService } from "./rmq-api.service";
import {
    ClientProvider,
    ClientsModule,
    Transport,
} from "@nestjs/microservices";
import { RmqConfig } from "../consts/rmq";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: "RMQ_SERVICE",
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
    providers: [RmqApiService],
    exports: [RmqApiService],
})
export class RmqApiModule {}
