import { prisma } from '@/utils/create-prisma-client'
import { PetsRepository } from '../pets-repository'
import { Prisma } from '@prisma/client'
import { GetPetsUseCaseRequest } from '@/use-cases/get-pets'
import { OrganizationsRepository } from '../organizations-repository'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
  async getById(id: string) {
    const pet = await prisma.pet.findFirst({
      where: {
        id
      }
    })
    return pet
  }
  async getMany({ city, state, age, ambient, energy, independency, size }: GetPetsUseCaseRequest, organizationsRepository: OrganizationsRepository) {
    const pets = prisma.pet.findMany({
      where: {
        Organization: {
          city,
          state
        },
        age: age ? age : undefined,
        ambient: ambient ? ambient : undefined,
        energy: energy ? energy : undefined,
        independency: independency ? independency : undefined,
        size: size ? size : undefined,
      }
    })

    return pets
  }
}
