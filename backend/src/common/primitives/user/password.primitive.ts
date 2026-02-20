import { IsAscii, IsNotEmpty } from "class-validator";

export class Password {
    @IsNotEmpty()
    @IsAscii()
    readonly value: string;

    constructor(password: string) {
        this.value = password;
    }
}
