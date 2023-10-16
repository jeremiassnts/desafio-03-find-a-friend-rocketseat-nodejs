import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetDetailsUseCase } from '@/use-cases/get-pet-details'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const getPetDetails = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const createParamsSchema = z.object({
    petId: z.string(),
  })

  const { petId } = createParamsSchema.parse(request.params)

  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrganizationsRepository()
  const getPetsUseCase = new GetPetDetailsUseCase(
    petsRepository,
    orgsRepository,
  )

  const { pet, organization } = await getPetsUseCase.execute({ id: petId })

  reply.status(200).send({
    pet,
    organization,
  })
}
