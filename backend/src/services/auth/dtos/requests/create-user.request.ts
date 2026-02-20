import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserRequest {
    @IsNotEmpty()
    @MinLength(2)
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(2)
    password: string;
}
