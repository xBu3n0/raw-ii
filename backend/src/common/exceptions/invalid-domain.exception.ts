export class InvalidDomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidDomainException";
    }
}
