import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/utils/create-prisma-client'
import { hash } from 'bcryptjs'
import { getAddressByCEP } from '@/utils/get-address-by-cep'

describe('Get pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a list of pets', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'joao',
        email: 'joao@email.com',
        password_hash: await hash('123456', 6),
        role: 'ORG',
      },
    })

    const orgAddress = await getAddressByCEP('49066219')
    const org = await prisma.organization.create({
      data: {
        CEP: '49066219',
        owner: 'joao santos',
        whatsapp: '79999990000',
        userId: user.id,
        ...orgAddress,
      },
    })

    await request(app.server)
      .post('/pets')
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

    const user2 = await prisma.user.create({
      data: {
        name: 'jose',
        email: 'jose@email.com',
        password_hash: await hash('123456', 6),
        role: 'ORG',
      },
    })

    const org2Address = await getAddressByCEP('01025020')
    const org2 = await prisma.organization.create({
      data: {
        CEP: '01025020',
        owner: 'jose santos',
        whatsapp: '79999991111',
        userId: user2.id,
        ...org2Address,
      },
    })

    await request(app.server)
      .post('/pets')
      .send({
        name: 'caramelo',
        about: 'representa mais o brasil do que samba',
        age: 'Adulto',
        ambient: 'Medio',
        energy: 'Altissima',
        independency: 'Alta',
        size: 'Medio',
        requirements: ['requirement 1', 'requirement 2'],
        photos: ['https://url.com/1.png', 'https://url.com/2.png'],
        organizationId: org2.id,
      })

    const response = await request(app.server).get('/pets').query({
      city: 'Aracaju',
      state: 'SE',
    })

    expect(response.body.pets).toHaveLength(1)
    expect(response.statusCode).toEqual(200)
  })
})
