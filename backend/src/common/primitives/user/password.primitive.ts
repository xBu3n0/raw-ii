import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class Password {
    readonly value: string;

    constructor(password: string) {
        if (password.length < 6) {
            throw new InvalidDomainException("Password must be at least 6 characters long");
        }

        this.value = password;
    }
}
