import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma/prisma.service";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { Email } from "@/common/primitives/user/email.primitive";

@Injectable()
export class AuthUserRepository implements IAuthUserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findByEmail(email: Email): Promise<UserEntity | null> {
        const authUser = await this.prismaService.authUser.findUnique({
            where: { email: email.value },
        });

        return authUser ? UserEntity.fromModel(authUser) : null;
    }

    async create(register: UserEntity): Promise<UserEntity> {
        const authUser = await this.prismaService.authUser.create({
            data: register.toMemento(),
        });

        return UserEntity.fromModel(authUser);
    }
}
