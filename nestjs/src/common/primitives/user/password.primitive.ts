import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { hashSync } from "@node-rs/argon2";

export class Password {
    private constructor(public readonly value: string) {}

    static create(password: string): Password {
        if (password.length < 6) {
            throw new InvalidDomainException(
                "Password must be at least 6 characters long",
            );
        }

        return new Password(hashSync(password));
    }
}
