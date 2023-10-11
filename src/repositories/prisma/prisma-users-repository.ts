import { prisma } from '@/utils/create-prisma-client'
import { Prisma, ROLES } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { GetResult } from '@prisma/client/runtime/library'

export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({ data })
        return user
    }
    async findByEmail(email: string) {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        return user
    }
}
