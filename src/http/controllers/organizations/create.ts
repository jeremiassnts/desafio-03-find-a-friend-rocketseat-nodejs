import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateOrganizationUseCase } from '@/use-cases/create-organization'
import { CreateUserUseCase } from '@/use-cases/create-user'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    owner: z.string(),
    CEP: z.string(),
    whatsapp: z.string(),
  })

  const { name, email, password, CEP, owner, whatsapp } =
    createBodySchema.parse(request.body)

  const organizationsRepository = new PrismaOrganizationsRepository()
  const usersRepository = new PrismaUsersRepository()
  const createOrganizationUseCase = new CreateOrganizationUseCase(
    organizationsRepository,
  )
  const createUserUseCase = new CreateUserUseCase(usersRepository)

  const { user } = await createUserUseCase.execute({
    name,
    email,
    password,
    role: 'ORG',
  })

  const { org } = await createOrganizationUseCase.execute({
    CEP,
    owner,
    userId: user.id,
    whatsapp,
  })

  reply.status(201).send({
    org: {
      ...org,
      name: user.name,
      email: user.email,
    },
  })
}
