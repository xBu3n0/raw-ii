import { AuthUser } from "generated/prisma/browser";

export class UserDto {
    sub: number;
    id: number;
    name: string;
    email: string;

    constructor(authUser: AuthUser) {
        this.sub = authUser.id;

        this.id = authUser.id;
        this.name = authUser.name;
        this.email = authUser.email;
    }
}
