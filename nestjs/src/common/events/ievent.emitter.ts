import { Observable } from "rxjs";
import { EventEnum } from "../consts/event";

export abstract class IEmmiterEvent {
    abstract emit<T>(event: EventEnum, content: T): Observable<T>;
}
