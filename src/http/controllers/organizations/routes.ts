import { FastifyInstance } from 'fastify'
import { create } from './create'

export const organizationRoutes = async (app: FastifyInstance) => {
  app.post('/organizations', create)
}
