import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Organization, Pet } from '@prisma/client'
import { PetDoesNotExists } from './errors/pet-does-not-exists'

export interface GetPetDetailsUseCaseRequest {
  id: string
}
export interface GetPetDetailsUseCaseResponse {
  pet: Pet
  organization: Organization
}
export class GetPetDetailsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrganizationsRepository,
  ) {}

  async execute({
    id,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const pet = await this.petsRepository.getById(id)
    if (!pet) {
      throw new PetDoesNotExists()
    }
    const organization = await this.orgsRepository.getById(pet.organizationId)

    return {
      pet,
      organization,
    }
  }
}
