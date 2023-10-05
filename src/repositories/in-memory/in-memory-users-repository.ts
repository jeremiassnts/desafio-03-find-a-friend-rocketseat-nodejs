import { User, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
    public users: User[] = []

    async create({
        name,
        email,
        password_hash,
        role
    }: Prisma.UserCreateInput) {
        const user: User = {
            id: randomUUID(),
            name,
            email,
            password_hash,
            role
        }

        this.users.push(user)
        return user
    }

    async findByEmail(email: string) {
        let user = this.users.find(e => e.email === email)
        if (!user) return null

        return user
    }
}
