export enum EventEnum {
    USER_CREATED = "user.created",
}

export abstract class Event {
    abstract emit(...args: any[]): any;
}
