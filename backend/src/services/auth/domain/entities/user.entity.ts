import { CreateUserRequest } from "@auth/dtos/requests/create-user.request";
import { Email } from "@/common/primitives/user/email.primitive";
import { Username } from "@/common/primitives/user/username.primitive";
import { Password } from "@/common/primitives/user/password.primitive";
import { UserId } from "@/common/primitives/user/user-id.primitive";

export type PlainUser = {
    id: number | undefined;
    username: string;
    email: string;
    password: string;
};

export class UserEntity {
    private constructor(
        readonly id: UserId | undefined,
        readonly username: Username,
        readonly email: Email,
        readonly password: Password,
    ) {}

    fromMemento() {
        return {
            id: this.id?.value,
            username: this.username.value,
            email: this.email.value,
            password: this.password.value,
        };
    }

    static fromPlain(user: PlainUser): UserEntity {
        return new this(
            user.id ? new UserId(user.id) : undefined,
            new Username(user.username),
            new Email(user.email),
            new Password(user.password),
        );
    }

    static fromCreateUserRequest(user: CreateUserRequest): UserEntity {
        return new this(
            undefined,
            new Username(user.username),
            new Email(user.email),
            new Password(user.password),
        );
    }
}
