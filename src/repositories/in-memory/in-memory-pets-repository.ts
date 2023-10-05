import { PetsRepository } from '../pets-repository'
import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

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
}
