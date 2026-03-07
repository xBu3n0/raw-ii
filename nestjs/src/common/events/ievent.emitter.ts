import { Observable } from "rxjs";
import { Event } from "@/common/consts/event";

export abstract class EventEmitter {
    abstract emit<T>(...events: Event[]): Observable<T>[];
}
