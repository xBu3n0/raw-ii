import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserEntity } from "@auth/domain/entities/user.entity";

@Injectable()
export class AuthUserRepository implements IAuthUserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findByEmail(email: string): Promise<UserEntity | null> {
        const authUser = await this.prismaService.authUser.findUnique({
            where: { email },
        });

        return authUser ? UserEntity.fromPlain(authUser) : null;
    }

    async create(register: UserEntity): Promise<UserEntity> {
        const authUser = await this.prismaService.authUser.create({
            data: register.fromMemento(),
        });

        return UserEntity.fromPlain(authUser);
    }
}
