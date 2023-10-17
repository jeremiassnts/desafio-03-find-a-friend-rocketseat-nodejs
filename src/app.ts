import fastify from 'fastify'
import { ZodError } from 'zod'
import { petsRoutes } from './http/controllers/pets/routes'
import { organizationRoutes } from './http/controllers/organizations/routes'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import fastifyCookie from '@fastify/cookie'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})
app.register(fastifyCookie)
app.register(usersRoutes)
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
