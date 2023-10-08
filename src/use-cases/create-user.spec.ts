import { beforeEach, describe, expect, it } from 'vitest'
import { UsersRepository } from '@/repositories/users-repository'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterAlreadyExistsError } from './errors/register-already-exists'

describe('Create user', () => {
    let usersRepository: UsersRepository
    let sut: CreateUserUseCase

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new CreateUserUseCase(usersRepository)
    })
    it('should be able to create a user', async () => {
        const { user } = await sut.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "COMMON"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to create a user with same email', async () => {
        await sut.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "COMMON"
        })

        await expect(() =>
            sut.execute({
                name: "joao",
                email: "joao@email.com",
                password: "123456",
                role: "COMMON"
            })
        ).rejects.toBeInstanceOf(RegisterAlreadyExistsError)
    })
})
