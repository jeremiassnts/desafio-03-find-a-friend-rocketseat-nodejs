import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: object
    user: {
      sub: string
      role: 'COMMON' | 'ORG'
    }
  }
}
