import { UserDto } from "src/common/dtos/user.dto";

export class Tokens {
    accessToken: string;
    refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

export class LoginResponse {
    user: UserDto;
    tokens: Tokens;

    constructor(user: UserDto, tokens: Tokens) {
        this.user = user;
        this.tokens = tokens;
    }
}
