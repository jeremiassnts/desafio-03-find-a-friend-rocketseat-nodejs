import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { CreateOrganizationUseCase } from './create-organization'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { CreateUserUseCase } from './create-user'
import { UsersRepository } from '@/repositories/users-repository'
import { RegisterAlreadyExistsError } from './errors/register-already-exists'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserHasOrganizationError } from './errors/user-has-organization'

describe('Create pet', () => {
    let organizationsRepository: OrganizationsRepository
    let usersRepository: UsersRepository
    let sut: CreateOrganizationUseCase
    let createUserUseCase: CreateUserUseCase

    beforeEach(() => {
        organizationsRepository = new InMemoryOrganizationsRepository()
        usersRepository = new InMemoryUsersRepository()
        sut = new CreateOrganizationUseCase(organizationsRepository)
        createUserUseCase = new CreateUserUseCase(usersRepository)
    })
    it('should be able to create a organization', async () => {
        const { user } = await createUserUseCase.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "ORG"
        })

        const { org } = await sut.execute({
            address: "rua a",
            CEP: "49000-00",
            owner: "joao santos",
            whatsapp: "79999990000",
            userId: user.id
        })

        expect(org.id).toEqual(expect.any(String))
    })

    it('should not be able to create a organization with same userId', async () => {
        const { user } = await createUserUseCase.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "ORG"
        })

        await sut.execute({
            address: "rua a",
            CEP: "49000-00",
            owner: "joao santos",
            whatsapp: "79999990000",
            userId: user.id
        })

        await expect(() =>
            sut.execute({
                address: "rua b",
                CEP: "48000-00",
                owner: "jose santos",
                whatsapp: "79999991111",
                userId: user.id
            })
        ).rejects.toBeInstanceOf(UserHasOrganizationError)
    })

    it('should not be able to create a organization with same whatsapp', async () => {
        const { user } = await createUserUseCase.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "ORG"
        })

        await sut.execute({
            address: "rua a",
            CEP: "49000-00",
            owner: "joao santos",
            whatsapp: "79999990000",
            userId: user.id
        })

        const { user: user2 } = await createUserUseCase.execute({
            name: "jose",
            email: "jose@email.com",
            password: "123456",
            role: "ORG"
        })

        await expect(() =>
            sut.execute({
                address: "rua b",
                CEP: "48000-00",
                owner: "jose santos",
                whatsapp: "79999990000",
                userId: user2.id
            })
        ).rejects.toBeInstanceOf(RegisterAlreadyExistsError)
    })
})
