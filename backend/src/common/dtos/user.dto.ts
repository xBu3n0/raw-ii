import type { AuthUser } from "generated/prisma/client";

export class UserDto {
    id: number;
    username: string;
    email: string;

    constructor(authUser: AuthUser) {
        this.id = authUser.id;
        this.username = authUser.username;
        this.email = authUser.email;
    }
}
