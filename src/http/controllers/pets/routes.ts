import { FastifyInstance } from 'fastify'
import { create } from './create'
import { getPets } from './get-pets'
import { getPetDetails } from './get-pet-details'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export const petsRoutes = async (app: FastifyInstance) => {
  app.get('/pets', getPets)
  app.get('/pets/:petId', getPetDetails)
  app.post('/pets', { onRequest: [verifyJwt, verifyUserRole("ORG")] }, create)
}
