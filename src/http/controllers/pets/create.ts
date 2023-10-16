import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PrismaPhotosRepository } from '@/repositories/prisma/prisma-photos-repository'
import { CreatePetUseCase } from '@/use-cases/create-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.enum(['Filhote', 'Adulto', 'Idoso']),
    ambient: z.enum(['Pequeno', 'Medio', 'Grande']),
    energy: z.enum(['Baixissima', 'Baixa', 'Medio', 'Grande', 'Altissima']),
    independency: z.enum(['Baixa', 'Media', 'Alta']),
    size: z.enum(['Pequenino', 'Medio', 'Grande']),
    photos: z.array(z.string()),
    requirements: z.array(z.string()),
    organizationId: z.string(),
  })

  const {
    name,
    about,
    age,
    ambient,
    energy,
    independency,
    size,
    photos,
    requirements,
    organizationId,
  } = createBodySchema.parse(request.body)

  const petsRepository = new PrismaPetsRepository()
  const photosRepository = new PrismaPhotosRepository()
  const createPetUseCase = new CreatePetUseCase(
    petsRepository,
    photosRepository,
  )

  const { pet, photosLength } = await createPetUseCase.execute({
    name,
    about,
    age,
    ambient,
    energy,
    independency,
    size,
    photos,
    requirements,
    organizationId,
  })

  reply.status(201).send({
    pet: {
      ...pet,
      photosLength,
    },
  })
}
