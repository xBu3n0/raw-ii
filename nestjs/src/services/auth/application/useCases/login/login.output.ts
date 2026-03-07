import { UserDto } from "@/common/dtos/user.dto";
import { Tokens } from "@/services/auth/common/types/token.type";

export class LoginOutput {
    constructor(
        readonly user: UserDto,
        readonly tokens: Tokens,
    ) {}
}
