import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { AuthUser } from "generated/prisma/client";
import { UserEntity } from "@auth/domain/entities/user.entity";

@Injectable()
export class AuthUserRepository implements IAuthUserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(register: UserEntity): Promise<AuthUser> {
        return this.prismaService.authUser.create({
            data: register.fromMemento(),
        });
    }
}
