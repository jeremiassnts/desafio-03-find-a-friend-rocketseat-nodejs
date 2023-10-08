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

describe('Create pet', () => {
  let petsRepository: PetsRepository
  let photosRepository: PhotosRepository
  let organizationsRepository: OrganizationsRepository
  let usersRepository: UsersRepository
  let sut: CreatePetUseCase
  let createOrganizationUseCase: CreateOrganizationUseCase
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    photosRepository = new InMemoryPhotosRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreatePetUseCase(petsRepository, photosRepository)
    createOrganizationUseCase = new CreateOrganizationUseCase(organizationsRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })
  
  it('should be able to create a pet with photos', async () => {
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

    const { pet, photosLength } = await sut.execute({
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

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.requirements).toHaveLength(2)
    expect(photosLength).toEqual(2)
  })

  it('should not be able to create a pet without organization', async () => {
    await expect(() =>
      sut.execute({
        name: 'bethoven',
        about: 'A movie star dog',
        age: 'Adulto',
        ambient: 'Grande',
        energy: 'Grande',
        independency: 'Media',
        size: 'Grande',
        requirements: ['requirement 1', 'requirement 2'],
        photos: ['https://url.com/1.png', 'https://url.com/2.png'],
        organizationId: null
      })
    ).rejects.toBeInstanceOf(PetMustHaveOrganizationError)
  })
})