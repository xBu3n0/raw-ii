import { Injectable } from "@nestjs/common";
import { RmqApiService } from "src/common/rmq/rmq-api.service";
import { RmqEvent } from "src/common/consts/rmq";
import { UserDto } from "src/common/dtos/user.dto";

@Injectable()
export class UserCreated {
    constructor(private readonly rmqService: RmqApiService) {}

    emit(newUser: UserDto) {
        this.rmqService.emit(RmqEvent.USER_CREATED, newUser);
    }
}
