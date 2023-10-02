import { PetsRepository } from '@/repositories/pets-repository'
import { PhotosRepository } from '@/repositories/photos-repository'
import {
  AGE,
  SIZE,
  ENERGY,
  INDEPENDENCY,
  AMBIENT,
  Pet,
  Photo,
} from '@prisma/client'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: AGE
  size: SIZE
  energy: ENERGY
  independency: INDEPENDENCY
  ambient: AMBIENT
  photos: string[]
  requirements: string[]
}

interface CreatePetUseCaseResponse {
  pet: Pet
  photos: Photo[]
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private photosRepository: PhotosRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    ambient,
    energy,
    independency,
    photos,
    requirements,
    size,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      ambient,
      energy,
      independency,
      size,
      requirements,
    })
    let index = 0
    const insertedPhotos: Photo[] = []
    for (const photo in photos) {
      const newPhoto = await this.photosRepository.create({
        url: photo,
        order: index,
        pet_id: pet.id,
      })
      index++
      insertedPhotos.push(newPhoto)
    }

    return {
      pet,
      photos: insertedPhotos,
    }
  }
}
