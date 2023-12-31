import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/utils/create-prisma-client'
import { hash } from 'bcryptjs'

describe('Get pet details (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get details of a pet', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'joao',
        email: 'joao@email.com',
        password_hash: await hash('123456', 6),
        role: 'ORG',
      },
    })

    const org = await prisma.organization.create({
      data: {
        CEP: '49066219',
        owner: 'joao santos',
        whatsapp: '79999990000',
        userId: user.id,
      },
    })

    const authResponse = await request(app.server)
      .post('/authenticate')
      .send({
        email: 'joao@email.com',
        password: '123456'
      })

    const petCreationResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send({
        name: 'bethoven',
        about: 'A movie star dog',
        age: 'Adulto',
        ambient: 'Grande',
        energy: 'Grande',
        independency: 'Media',
        size: 'Grande',
        requirements: ['requirement 1', 'requirement 2'],
        photos: ['https://url.com/1.png', 'https://url.com/2.png'],
        organizationId: org.id,
      })

    const response = await request(app.server).get(
      '/pets/' + petCreationResponse.body.pet.id,
    )

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet.id).toEqual(petCreationResponse.body.pet.id)
  })
})
