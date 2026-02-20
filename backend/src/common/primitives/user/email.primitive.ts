import { IsEmail, IsNotEmpty } from "class-validator";

export class Email {
    @IsNotEmpty()
    @IsEmail()
    readonly value: string;

    constructor(password: string) {
        this.value = password;
    }
}
