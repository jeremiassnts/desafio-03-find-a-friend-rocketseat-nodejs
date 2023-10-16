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
import { GetPetDetailsUseCase } from './get-pet-details'
import { PetDoesNotExists } from './errors/pet-does-not-exists'

describe('Get pet details', () => {
  let petsRepository: PetsRepository
  let photosRepository: PhotosRepository
  let organizationsRepository: OrganizationsRepository
  let usersRepository: UsersRepository
  let sut: GetPetDetailsUseCase
  let createOrganizationUseCase: CreateOrganizationUseCase
  let createUserUseCase: CreateUserUseCase
  let createPetUseCase: CreatePetUseCase

  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    photosRepository = new InMemoryPhotosRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetPetDetailsUseCase(petsRepository, organizationsRepository)
    createOrganizationUseCase = new CreateOrganizationUseCase(
      organizationsRepository,
    )
    createUserUseCase = new CreateUserUseCase(usersRepository)
    createPetUseCase = new CreatePetUseCase(petsRepository, photosRepository)
  })

  it('should be able to get a pet details', async () => {
    const { user } = await createUserUseCase.execute({
      name: 'joao',
      email: 'joao@email.com',
      password: '123456',
      role: 'ORG',
    })

    const { org } = await createOrganizationUseCase.execute({
      CEP: '49066219',
      owner: 'joao santos',
      whatsapp: '79999990000',
      userId: user.id,
    })

    const { pet: createdPet } = await createPetUseCase.execute({
      name: 'bethoven',
      about: 'A movie star dog',
      age: 'Adulto',
      ambient: 'Grande',
      energy: 'Grande',
      independency: 'Media',
      size: 'Grande',
      requirements: ['requirement 1', 'requirement 2'],
      photos: ['https://url.com/1.png', 'https://url.com/2.png'],
      organizationId: org.id,
    })

    const { pet, organization } = await sut.execute({ id: createdPet.id })

    expect(pet.id).toEqual(expect.any(String))
    expect(organization.id).toEqual(expect.any(String))
  })

  it('should not be able to get pet details with not valid id', async () => {
    const { user } = await createUserUseCase.execute({
      name: 'joao',
      email: 'joao@email.com',
      password: '123456',
      role: 'ORG',
    })

    const { org } = await createOrganizationUseCase.execute({
      CEP: '49066219',
      owner: 'joao santos',
      whatsapp: '79999990000',
      userId: user.id,
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
      organizationId: org.id,
    })

    await expect(() =>
      sut.execute({ id: '00000000000000000' }),
    ).rejects.toBeInstanceOf(PetDoesNotExists)
  })
})
