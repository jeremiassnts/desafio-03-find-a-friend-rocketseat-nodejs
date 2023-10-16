import { FastifyInstance } from 'fastify'
import { create } from './create'
import { getPets } from './get-pets'
import { getPetDetails } from './get-pet-details'

export const petsRoutes = async (app: FastifyInstance) => {
  app.post('/pets', create)
  app.get('/pets', getPets)
  app.get('/pets/:petId', getPetDetails)
}
