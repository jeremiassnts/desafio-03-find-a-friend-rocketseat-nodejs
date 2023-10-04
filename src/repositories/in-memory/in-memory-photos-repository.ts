import { Photo, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PhotosRepository } from '../photos-repository'

export class InMemoryPhotosRepository implements PhotosRepository {
  public photos: Photo[] = []

  async createMany(data: Prisma.PhotoUncheckedCreateInput[]) {
    const photos = data.map(
      ({ url, order, pet_id }: Prisma.PhotoUncheckedCreateInput) => ({
        id: randomUUID(),
        url,
        order,
        pet_id,
      }),
    )

    this.photos = this.photos.concat(photos)
    return photos.length
  }
}
