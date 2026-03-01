import { IEmmiterEvent } from "../events/ievent.emitter";
import { EventEnum } from "../consts/event";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RmqEventEmitter implements IEmmiterEvent {
    constructor(@Inject("RMQ_EMITTER") private readonly client: ClientProxy) { }

    emit<T>(event: EventEnum, content: T): Observable<T> {
        return this.client.emit(event, content);
    }
}
