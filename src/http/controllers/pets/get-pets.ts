import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetsUseCase } from '@/use-cases/get-pets'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const getPets = async (request: FastifyRequest, reply: FastifyReply) => {
  const createQuerySchema = z.object({
    city: z.string(),
    state: z.string(),
    age: z.enum(['Filhote', 'Adulto', 'Idoso']).optional(),
    ambient: z.enum(['Pequeno', 'Medio', 'Grande']).optional(),
    energy: z
      .enum(['Baixissima', 'Baixa', 'Medio', 'Grande', 'Altissima'])
      .optional(),
    independency: z.enum(['Baixa', 'Media', 'Alta']).optional(),
    size: z.enum(['Pequenino', 'Medio', 'Grande']).optional(),
  })

  const { age, ambient, city, energy, independency, size, state } =
    createQuerySchema.parse(request.query)

  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrganizationsRepository()
  const getPetsUseCase = new GetPetsUseCase(petsRepository, orgsRepository)

  const { pets } = await getPetsUseCase.execute({
    age,
    ambient,
    city,
    energy,
    independency,
    size,
    state,
  })

  reply.status(200).send({
    pets,
  })
}
