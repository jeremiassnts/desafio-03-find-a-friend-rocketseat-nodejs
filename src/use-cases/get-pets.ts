import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { AGE, AMBIENT, ENERGY, INDEPENDENCY, Pet, SIZE } from '@prisma/client'
import { GetPetsMustHaveCity } from './errors/get-pet-must-have-city'

export interface GetPetsUseCaseRequest {
  state: string
  city: string
  age?: AGE
  size?: SIZE
  energy?: ENERGY
  independency?: INDEPENDENCY
  ambient?: AMBIENT
}
interface GetPetsUseCaseResponse {
  pets: Pet[]
}
export class GetPetsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrganizationsRepository,
  ) {}

  async execute({
    city,
    state,
    age,
    ambient,
    energy,
    independency,
    size,
  }: GetPetsUseCaseRequest): Promise<GetPetsUseCaseResponse> {
    if (!city || !state) {
      throw new GetPetsMustHaveCity()
    }

    const pets = await this.petsRepository.getMany(
      { city, state, age, ambient, energy, independency, size },
      this.orgsRepository,
    )
    return {
      pets,
    }
  }
}
