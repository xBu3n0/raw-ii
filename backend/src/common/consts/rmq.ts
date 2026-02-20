import { Transport } from "@nestjs/microservices";

export const RmqConfig = {
    transport: Transport.RMQ,
    urls: [process.env.RMQ_URL ?? ""],
    exchange: "auth-exchange",
    queue: "auth",
};

export enum RmqEvent {
    USER_CREATED = "user.created",
}
