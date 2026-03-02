import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class UserId {
    private constructor(public readonly value: number) {}

    static create(userId: number): UserId {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new InvalidDomainException(
                "UserId must be a positive integer",
            );
        }

        return new UserId(userId);
    }
}
