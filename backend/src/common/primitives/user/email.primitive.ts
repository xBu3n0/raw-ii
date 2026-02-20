import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class Email {
    readonly value: string;

    constructor(email: string) {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new InvalidDomainException("Invalid email format");
        }

        this.value = email;
    }
}
