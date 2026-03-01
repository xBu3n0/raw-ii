import { Inject, Injectable } from "@nestjs/common";
import { EventEnum } from "@/common/consts/event";
import { UserDto } from "@/common/dtos/user.dto";
import { IEmmiterEvent } from "@/common/events/ievent.emitter";

@Injectable()
export class UserCreated {
    constructor(
        @Inject("RMQ_EVENT_EMMITER")
        private readonly eventEmitter: IEmmiterEvent,
    ) {}

    emit(newUser: UserDto) {
        this.eventEmitter.emit(EventEnum.USER_CREATED, newUser);
    }
}
