import { IsAlpha, IsNotEmpty } from "class-validator";

export class Username {
    @IsNotEmpty()
    @IsAlpha()
    readonly value: string;

    constructor(password: string) {
        this.value = password;
    }
}
