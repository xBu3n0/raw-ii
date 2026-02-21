import { UserEntity } from "@/services/auth/domain/entities/user.entity";
import { InvalidDomainException } from "../exceptions/invalid-domain.exception";

export class UserDto {
    id: number;
    username: string;
    email: string;

    constructor(authUser: UserEntity) {
        if (!authUser.id) {
            throw new InvalidDomainException("User id is required");
        }

        this.id = authUser.id.value;
        this.username = authUser.username.value;
        this.email = authUser.email.value;
    }
}
