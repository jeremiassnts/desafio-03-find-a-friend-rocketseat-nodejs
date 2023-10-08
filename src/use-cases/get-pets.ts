import { OrganizationsRepository } from "@/repositories/organizations-repository"
import { PetsRepository } from "@/repositories/pets-repository"
import { Pet } from "@prisma/client"

export interface GetPetsUseCaseRequest {
    state: string
    city: string
}
interface GetPetsUseCaseResponse {
    pets: Pet[]
}
export class GetPetsUseCase {
    constructor(private petsRepository: PetsRepository, private orgsRepository: OrganizationsRepository) { }
    async execute({ city, state }: GetPetsUseCaseRequest): Promise<GetPetsUseCaseResponse> {
        const pets = await this.petsRepository.getMany({ city, state }, this.orgsRepository)
        return {
            pets
        }
    }
}