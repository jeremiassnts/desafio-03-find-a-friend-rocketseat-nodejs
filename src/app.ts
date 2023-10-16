import fastify from 'fastify'
import { ZodError } from 'zod'
import { petsRoutes } from './http/controllers/pets/routes'
import { organizationRoutes } from './http/controllers/organizations/routes'

export const app = fastify()

app.register(petsRoutes)
app.register(organizationRoutes)
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  }

  console.log(error)
  return reply.status(500).send({ message: 'Internal Server Error' })
})
