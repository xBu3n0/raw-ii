import { Email } from "@/common/primitives/user/email.primitive";
import { Username } from "@/common/primitives/user/username.primitive";
import { UserId } from "@/common/primitives/user/user-id.primitive";
import { HashedPassword } from "@/common/primitives/user/hashed-password.primitive";
import { Password } from "@/common/primitives/user/password.primitive";

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
        readonly password: HashedPassword,
    ) {}

    static create({
        id,
        username,
        email,
        password,
    }: {
        id?: number;
        username: string;
        email: string;
        password: string;
    }): UserEntity {
        return new this(
            id ? UserId.create(id) : undefined,
            Username.create(username),
            Email.create(email),
            HashedPassword.create(Password.create(password)),
        );
    }

    toMemento() {
        return {
            id: this.id?.value,
            username: this.username.value,
            email: this.email.value,
            password: this.password.value,
        };
    }

    static fromModel(user: PlainUser): UserEntity {
        return new this(
            user.id ? UserId.create(user.id) : undefined,
            Username.create(user.username),
            Email.create(user.email),
            HashedPassword.fromHash(user.password),
        );
    }
}
