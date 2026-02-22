import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { RmqEvent } from "@/common/consts/rmq";

@Injectable()
export class RmqApiService {
    constructor(@Inject("RMQ_SERVICE") private readonly client: ClientProxy) {}

    emit<T>(pattern: RmqEvent, content: T): Observable<T> {
        return this.client.emit(pattern, content);
    }
}
