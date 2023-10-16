import { prisma } from '@/utils/create-prisma-client'
import { Prisma } from '@prisma/client'
import { OrganizationsRepository } from '../organizations-repository'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async create(data: Prisma.OrganizationUncheckedCreateInput) {
    const organization = await prisma.organization.create({ data })
    return organization
  }

  async findByUserId(userId: string) {
    const organization = await prisma.organization.findFirst({
      where: {
        userId,
      },
    })

    return organization
  }

  async findByWhatsapp(whatsapp: string) {
    const organization = await prisma.organization.findFirst({
      where: {
        whatsapp,
      },
    })

    return organization
  }

  async getById(id: string) {
    const organization = await prisma.organization.findFirst({
      where: {
        id,
      },
    })

    return organization
  }

  async getManyByCity(city: string, state: string) {
    const organizations = await prisma.organization.findMany({
      where: {
        city,
        state,
      },
    })

    return organizations
  }
}
