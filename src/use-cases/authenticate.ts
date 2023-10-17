import { User, Organization } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { compare } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

interface AuthenticateUseCaseRequest {
    email: string
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
    organization: Organization | null
}

export class AuthenticateUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private organizationsRepository: OrganizationsRepository
    ) { }

    async execute({
        email,
        password
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.usersRepository.findByEmail(email)
        if (!user) {
            throw new InvalidCredentials()
        }

        const isPasswordValid = await compare(password, user.password_hash)
        if (!isPasswordValid) {
            throw new InvalidCredentials()
        }

        if (user.role === 'ORG') {
            const organization = await this.organizationsRepository.findByUserId(user.id)
            return {
                user,
                organization
            }
        } else {
            return {
                user,
                organization: null
            }
        }
    }
}
