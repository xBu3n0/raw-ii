import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class UserId {
    readonly value: number;

    constructor(userId: number) {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new InvalidDomainException(
                "UserId must be a positive integer",
            );
        }

        this.value = userId;
    }
}
