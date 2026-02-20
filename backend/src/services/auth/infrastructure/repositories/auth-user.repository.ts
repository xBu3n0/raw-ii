import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { AuthUser } from "@generated/prisma/client";

@Injectable()
export class AuthUserRepository implements IAuthUserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    findByEmail(email: string): Promise<AuthUser | null> {
        return this.prismaService.authUser.findUnique({
            where: { email },
        });
    }

    create(register: UserEntity): Promise<AuthUser> {
        return this.prismaService.authUser.create({
            data: register.fromMemento(),
        });
    }
}
