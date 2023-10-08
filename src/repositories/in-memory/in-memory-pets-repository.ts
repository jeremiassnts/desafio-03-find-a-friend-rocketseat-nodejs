import { GetPetsUseCaseRequest } from '@/use-cases/get-pets'
import { PetsRepository } from '../pets-repository'
import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { OrganizationsRepository } from '../organizations-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public pets: Pet[] = []

  async create({
    name,
    about,
    age,
    ambient,
    energy,
    independency,
    size,
    requirements,
    organizationId
  }: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name,
      about,
      age,
      ambient,
      energy,
      independency,
      size,
      requirements,
      organizationId
    }

    this.pets.push(pet)
    return pet
  }

  async getMany({ city, state }: GetPetsUseCaseRequest, organizationsRepository: OrganizationsRepository) {
    const orgs = await organizationsRepository.getManyByCity(city, state)
    const cityPets = orgs.reduce((arr: any, pet) => {
      arr.push(pet)
      return arr
    }, [])

    return cityPets
  }
}
