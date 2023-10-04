import { Prisma } from '@prisma/client'

export interface PhotosRepository {
  createMany(photos: Prisma.PhotoUncheckedCreateInput[]): Promise<number>
}
