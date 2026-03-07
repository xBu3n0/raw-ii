import { Injectable } from "@nestjs/common";
import { Event, EventEnum } from "@/common/consts/event";

@Injectable()
export class UserCreated implements Event {
    readonly eventName = EventEnum.USER_CREATED;

    constructor(
        readonly id: number,
        readonly username: string,
        readonly email: string,
    ) {}
}
