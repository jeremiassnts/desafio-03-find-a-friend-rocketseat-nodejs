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
import { GetPetsUseCase } from './get-pets'
import { GetPetsMustHaveCity } from './errors/get-pet-must-have-city'

describe('Get pets', () => {
    let petsRepository: PetsRepository
    let photosRepository: PhotosRepository
    let organizationsRepository: OrganizationsRepository
    let usersRepository: UsersRepository
    let sut: GetPetsUseCase
    let createOrganizationUseCase: CreateOrganizationUseCase
    let createUserUseCase: CreateUserUseCase
    let createPetUseCase: CreatePetUseCase

    beforeEach(() => {
        petsRepository = new InMemoryPetsRepository()
        photosRepository = new InMemoryPhotosRepository()
        organizationsRepository = new InMemoryOrganizationsRepository()
        usersRepository = new InMemoryUsersRepository()
        sut = new GetPetsUseCase(petsRepository, organizationsRepository)
        createOrganizationUseCase = new CreateOrganizationUseCase(organizationsRepository)
        createUserUseCase = new CreateUserUseCase(usersRepository)
        createPetUseCase = new CreatePetUseCase(petsRepository, photosRepository)
    })

    it('should be able to get pets from some city', async () => {
        const { user } = await createUserUseCase.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "ORG"
        })

        const { org } = await createOrganizationUseCase.execute({
            CEP: "49066219",
            owner: "joao santos",
            whatsapp: "79999990000",
            userId: user.id
        })

        await createPetUseCase.execute({
            name: 'bethoven',
            about: 'A movie star dog',
            age: 'Adulto',
            ambient: 'Grande',
            energy: 'Grande',
            independency: 'Media',
            size: 'Grande',
            requirements: ['requirement 1', 'requirement 2'],
            photos: ['https://url.com/1.png', 'https://url.com/2.png'],
            organizationId: org.id
        })

        const { user: user2 } = await createUserUseCase.execute({
            name: "jose",
            email: "jose@email.com",
            password: "123456",
            role: "ORG"
        })

        const { org: org2 } = await createOrganizationUseCase.execute({
            CEP: "01025020",
            owner: "jose santos",
            whatsapp: "79999991111",
            userId: user2.id
        })

        await createPetUseCase.execute({
            name: 'caramelo',
            about: 'representa mais o brasil do que samba',
            age: 'Adulto',
            ambient: 'Medio',
            energy: 'Altissima',
            independency: 'Alta',
            size: 'Medio',
            requirements: ['requirement 1', 'requirement 2'],
            photos: ['https://url.com/1.png', 'https://url.com/2.png'],
            organizationId: org2.id
        })

        const { pets } = await sut.execute({
            city: 'Aracaju',
            state: 'SE'
        })

        expect(pets).toHaveLength(1)
    })

    it('should not be able to get pets without city', async () => {
        const { user } = await createUserUseCase.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "ORG"
        })

        const { org } = await createOrganizationUseCase.execute({
            CEP: "49066219",
            owner: "joao santos",
            whatsapp: "79999990000",
            userId: user.id
        })

        await createPetUseCase.execute({
            name: 'bethoven',
            about: 'A movie star dog',
            age: 'Adulto',
            ambient: 'Grande',
            energy: 'Grande',
            independency: 'Media',
            size: 'Grande',
            requirements: ['requirement 1', 'requirement 2'],
            photos: ['https://url.com/1.png', 'https://url.com/2.png'],
            organizationId: org.id
        })

        await expect(() => sut.execute({
            city: null,
            state: null
        })).rejects.toBeInstanceOf(GetPetsMustHaveCity)
    })
    it('should be able to get pets filtered by characteristics', async () => {
        const { user } = await createUserUseCase.execute({
            name: "joao",
            email: "joao@email.com",
            password: "123456",
            role: "ORG"
        })

        const { org } = await createOrganizationUseCase.execute({
            CEP: "49066219",
            owner: "joao santos",
            whatsapp: "79999990000",
            userId: user.id
        })

        await createPetUseCase.execute({
            name: 'bethoven',
            about: 'A movie star dog',
            age: 'Adulto',
            ambient: 'Grande',
            energy: 'Grande',
            independency: 'Media',
            size: 'Grande',
            requirements: ['requirement 1', 'requirement 2'],
            photos: ['https://url.com/1.png', 'https://url.com/2.png'],
            organizationId: org.id
        })

        const { user: user2 } = await createUserUseCase.execute({
            name: "jose",
            email: "jose@email.com",
            password: "123456",
            role: "ORG"
        })

        const { org: org2 } = await createOrganizationUseCase.execute({
            CEP: "49066219",
            owner: "jose santos",
            whatsapp: "79999991111",
            userId: user2.id
        })

        await createPetUseCase.execute({
            name: 'caramelo',
            about: 'representa mais o brasil do que samba',
            age: 'Adulto',
            ambient: 'Medio',
            energy: 'Altissima',
            independency: 'Alta',
            size: 'Medio',
            requirements: ['requirement 1', 'requirement 2'],
            photos: ['https://url.com/1.png', 'https://url.com/2.png'],
            organizationId: org2.id
        })

        const { pets } = await sut.execute({
            city: 'Aracaju',
            state: 'SE',
            age: 'Adulto',
            ambient: 'Grande',
            energy: 'Grande',
            independency: 'Media',
            size: 'Grande',
        })

        expect(pets).toHaveLength(1)
    })
})