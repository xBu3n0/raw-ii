import { UserDto } from "@/common/dtos/user.dto";
import { LoginOutput } from "@/services/auth/application/useCases/login/login.output";
import { Tokens } from "@/services/auth/common/token.type";

export class LoginResponse {
    user: UserDto;
    tokens: Tokens;

    constructor(user: UserDto, tokens: Tokens) {
        this.user = user;
        this.tokens = tokens;
    }

    static fromLoginOutput(output: LoginOutput): LoginResponse {
        return new LoginResponse(output.user, output.tokens);
    }
}
