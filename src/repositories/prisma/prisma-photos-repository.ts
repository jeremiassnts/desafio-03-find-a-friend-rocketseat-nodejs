import { prisma } from '@/utils/create-prisma-client'
import { PhotosRepository } from '../photos-repository'
import { Prisma } from '@prisma/client'

export class PrismaPhotosRepository implements PhotosRepository {
  async createMany(data: Prisma.PhotoUncheckedCreateInput[]) {
    const photos = await prisma.photo.createMany({
      data,
    })

    return photos.count
  }
}
