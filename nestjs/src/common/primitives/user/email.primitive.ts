import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class Email {
    private constructor(public readonly value: string) {}

    static create(email: string): Email {
        if (!email.match(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            throw new InvalidDomainException("Invalid email format");
        }

        return new Email(email);
    }
}
