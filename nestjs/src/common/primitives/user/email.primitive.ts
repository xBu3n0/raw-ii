import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class Email {
    readonly value: string;

    constructor(email: string) {
        if (!email.match(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            throw new InvalidDomainException("Invalid email format");
        }

        this.value = email;
    }
}
