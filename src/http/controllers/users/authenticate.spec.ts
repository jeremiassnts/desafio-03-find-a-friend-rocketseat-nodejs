import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/utils/create-prisma-client'
import { hash } from 'bcryptjs'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await prisma.user.create({
      data: {
        name: 'joao',
        email: 'joao@email.com',
        password_hash: await hash('123456', 6),
        role: 'COMMON',
      },
    })

    const response = await request(app.server).post('/authenticate').send({
      email: 'joao@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.token).toEqual(expect.any(String))
  })
})
