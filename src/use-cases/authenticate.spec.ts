import { PetsRepository } from '@/repositories/pets-repository'
import { PhotosRepository } from '@/repositories/photos-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { CreateOrganizationUseCase } from './create-organization'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { PetMustHaveOrganizationError } from './errors/pet-must-have-organization'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

describe('Authenticate', () => {
    let organizationsRepository: OrganizationsRepository
    let usersRepository: UsersRepository
    let sut: AuthenticateUseCase

    beforeEach(() => {
        organizationsRepository = new InMemoryOrganizationsRepository()
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository, organizationsRepository)
    })

    it('should be able to authenticate a common user', async () => {
        const { id } = await usersRepository.create({
            email: 'joao@email.com',
            name: 'joao santos',
            password_hash: await hash('123456', 6),
            role: 'COMMON'
        })

        const { user, organization } = await sut.execute({
            email: 'joao@email.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.id).toEqual(id)
        expect(organization).toEqual(null)
    })

    it('should be able to authenticate a org user', async () => {
        const { id: userId } = await usersRepository.create({
            email: 'joao@email.com',
            name: 'joao santos',
            password_hash: await hash('123456', 6),
            role: 'ORG'
        })

        const { id: orgId } = await organizationsRepository.create({
            CEP: '49066219',
            userId,
            whatsapp: '79999999999'
        })

        const { user, organization } = await sut.execute({
            email: 'joao@email.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
        expect(organization?.id).toEqual(expect.any(String))
        expect(user.id).toEqual(userId)
        expect(organization?.id).toEqual(orgId)
    })

    it('should not be able to authenticate with wrong email', async () => {
        await usersRepository.create({
            email: 'joao@email.com',
            name: 'joao santos',
            password_hash: await hash('123456', 6),
            role: 'COMMON'
        })

        await expect(() =>
            sut.execute({
                email: 'jose@email.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentials)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            email: 'joao@email.com',
            name: 'joao santos',
            password_hash: await hash('123456', 6),
            role: 'COMMON'
        })

        await expect(() =>
            sut.execute({
                email: 'joao@email.com',
                password: '000000'
            })
        ).rejects.toBeInstanceOf(InvalidCredentials)
    })
})
