import { Photo, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PhotosRepository } from '../photos-repository'

export class InMemoryPhotosRepository implements PhotosRepository {
  public photos: Photo[] = []

  async create({ url, order, pet_id }: Prisma.PhotoUncheckedCreateInput) {
    const photo: Photo = {
      id: randomUUID(),
      url,
      order,
      pet_id,
    }

    this.photos.push(photo)
    return photo
  }
}
