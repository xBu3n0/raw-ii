import { hashSync, verify } from "@node-rs/argon2";
import { Password } from "./password.primitive";

class PasswordHasher {
    static hash(plain: string): string {
        return hashSync(plain);
    }

    static verify(hash: string, plain: string): Promise<boolean> {
        return verify(hash, plain);
    }
}

export class HashedPassword {
    private constructor(readonly value: string) {}

    static create(password: Password): HashedPassword {
        return new HashedPassword(PasswordHasher.hash(password.value));
    }

    static fromHash(hash: string): HashedPassword {
        return new HashedPassword(hash);
    }

    hash(): string {
        return PasswordHasher.hash(this.value);
    }

    verify(password: Password): Promise<boolean> {
        return PasswordHasher.verify(this.value, password.value);
    }
}
