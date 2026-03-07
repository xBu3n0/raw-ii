import { EventEmitter } from "@/common/events/ievent.emitter";
import { Event } from "@/common/consts/event";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RmqEventEmitter implements EventEmitter {
    constructor(@Inject("RMQ_EMITTER") private readonly client: ClientProxy) {}

    emit<T>(...events: Event[]): Observable<T>[] {
        console.log(events);

        return events.map((event) => {
            const { eventName, ...content } = event;

            return this.client.emit(eventName, content);
        });
    }
}
