import { PetsRepository } from '@/repositories/pets-repository'
import { PhotosRepository } from '@/repositories/photos-repository'
import { AGE, SIZE, ENERGY, INDEPENDENCY, AMBIENT, Pet } from '@prisma/client'

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
  photosLength: number
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

    const photosLength = await this.photosRepository.createMany(
      photos.map((e, index) => ({
        url: e,
        order: index,
        pet_id: pet.id,
      })),
    )

    return {
      pet,
      photosLength,
    }
  }
}
