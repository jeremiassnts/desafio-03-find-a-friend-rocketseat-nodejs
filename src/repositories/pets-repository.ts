import { GetPetsUseCaseRequest } from '@/use-cases/get-pets'
import { Prisma, Pet } from '@prisma/client'
import { OrganizationsRepository } from './organizations-repository'

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  getMany(data: GetPetsUseCaseRequest, organizationsRepository: OrganizationsRepository): Promise<Pet[]>
}
