export enum EventEnum {
    USER_CREATED = "user.created",
}

export abstract class Event {
    readonly eventName: EventEnum;
}
