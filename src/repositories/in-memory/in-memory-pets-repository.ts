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
    organizationId,
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
      organizationId,
    }

    this.pets.push(pet)
    return pet
  }

  async getMany(
    {
      city,
      state,
      age,
      ambient,
      energy,
      independency,
      size,
    }: GetPetsUseCaseRequest,
    organizationsRepository: OrganizationsRepository,
  ) {
    const orgs = await organizationsRepository.getManyByCity(city, state)
    const cityPets = this.pets
      .filter((pet) => orgs.some((org) => org.id === pet.organizationId))
      .filter((pet) => {
        return (
          (!age || pet.age === age) &&
          (!ambient || pet.ambient === ambient) &&
          (!energy || pet.energy === energy) &&
          (!independency || pet.independency === independency) &&
          (!size || pet.size === size)
        )
      })

    return cityPets
  }
  async getById(id: string) {
    const pet = this.pets.filter(pet => pet.id === id)[0]
    return pet
  }
}
