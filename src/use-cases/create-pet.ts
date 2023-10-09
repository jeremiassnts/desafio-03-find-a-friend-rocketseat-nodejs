import { PetsRepository } from '@/repositories/pets-repository'
import { PhotosRepository } from '@/repositories/photos-repository'
import { AGE, SIZE, ENERGY, INDEPENDENCY, AMBIENT, Pet } from '@prisma/client'
import { PetMustHaveOrganizationError } from './errors/pet-must-have-organization'

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
  organizationId: string
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
    organizationId,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    if (!organizationId) {
      throw new PetMustHaveOrganizationError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      ambient,
      energy,
      independency,
      size,
      requirements,
      organizationId,
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
