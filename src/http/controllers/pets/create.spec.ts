import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Create pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const response = await request(app.server)
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
      })

    expect(response.statusCode).toEqual(201)
  })
})
