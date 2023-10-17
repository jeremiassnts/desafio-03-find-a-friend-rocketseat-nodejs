import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refresh } from './refresh'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/authenticate', authenticate)
  app.patch('/authenticate/refresh', refresh)
}
