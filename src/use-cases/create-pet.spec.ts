import { PetsRepository } from '@/repositories/pets-repository'
import { PhotosRepository } from '@/repositories/photos-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryPhotosRepository } from '@/repositories/in-memory/in-memory-photos-repository'

describe('Create pet', () => {
  let petsRepository: PetsRepository
  let photosRepository: PhotosRepository
  let sut: CreatePetUseCase

  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    photosRepository = new InMemoryPhotosRepository()
    sut = new CreatePetUseCase(petsRepository, photosRepository)
  })
  it('should be able to create a pet with photos', async () => {
    const { pet, photos } = await sut.execute({
      name: 'bethoven',
      about: 'A movie star dog',
      age: 'Adulto',
      ambient: 'Grande',
      energy: 'Grande',
      independency: 'Media',
      size: 'Grande',
      requirements: ['requirement 1', 'requirement 2'],
      photos: ['https://url.com/1.png', 'https://url.com/2.png'],
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.requirements).toHaveLength(2)
    expect(photos).toHaveLength(2)
  })
})
