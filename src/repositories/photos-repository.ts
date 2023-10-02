import { Prisma, Photo } from '@prisma/client'

export interface PhotosRepository {
  create(data: Prisma.PhotoUncheckedCreateInput): Promise<Photo>
}
