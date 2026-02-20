import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginRequest {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        name: "email",
        description: "The email of the user",
        example: "john.doe@example.com",
    })
    email: string;

    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty({
        name: "password",
        description: "The password of the user",
        example: "password123",
    })
    password: string;
}
