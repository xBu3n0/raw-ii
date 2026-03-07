import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterRequest {
    @IsNotEmpty()
    @MinLength(2)
    @ApiProperty({
        name: "username",
        description: "The username of the user",
        example: "john_doe",
    })
    username: string;

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
