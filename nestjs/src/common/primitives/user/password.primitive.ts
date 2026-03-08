import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class Password {
    private constructor(readonly value: string) {}

    static create(password: string): Password {
        if (password.length < 6) {
            throw new InvalidDomainException(
                "Password must be at least 6 characters long",
            );
        }

        return new Password(password);
    }
}
