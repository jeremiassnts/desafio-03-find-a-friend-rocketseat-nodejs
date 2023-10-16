import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Create organization (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a organization', async () => {
    const response = await request(app.server).post('/organizations').send({
      name: 'joao',
      email: 'joao@email.com',
      password: '123456',
      CEP: '49066219',
      owner: 'joao santos',
      whatsapp: '79999990000',
    })

    expect(response.statusCode).toEqual(201)
  })
})
