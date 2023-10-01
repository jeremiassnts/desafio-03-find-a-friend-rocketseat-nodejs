import fastify from 'fastify'
import { ZodError } from 'zod'

export const app = fastify()

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
