import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";

export class Username {
    readonly value: string;

    constructor(username: string) {
        if (!username.match(/^[a-zA-Z0-9_]+$/) || username.length <= 3) {
            throw new InvalidDomainException("Username can only contain letters, numbers, and underscores, and must be longer than 3 characters");
        }

        this.value = username;
    }
}
