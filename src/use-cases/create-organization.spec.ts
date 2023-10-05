import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { CreateOrganizationUseCase } from './create-organization'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists'

describe('Create pet', () => {
    let organizationsRepository: OrganizationsRepository
    let sut: CreateOrganizationUseCase

    beforeEach(() => {
        organizationsRepository = new InMemoryOrganizationsRepository()
        sut = new CreateOrganizationUseCase(organizationsRepository)
    })
    it('should be able to create a organization', async () => {
        const { org } = await sut.execute({
            address: "rua a",
            CEP: "49000-00",
            email: "org@email.com",
            owner: "joao santos",
            password: "123456",
            whatsapp: "79999990000"
        })

        expect(org.id).toEqual(expect.any(String))
    })

    it('should not be able to create a organization with same email', async () => {
        await sut.execute({
            address: "rua a",
            CEP: "49000-00",
            email: "org@email.com",
            owner: "joao santos",
            password: "123456",
            whatsapp: "79999990000"
        })

        await expect(() =>
            sut.execute({
                address: "rua b",
                CEP: "48000-00",
                email: "org@email.com",
                owner: "jose santos",
                password: "123456",
                whatsapp: "79999991111"
            })
        ).rejects.toBeInstanceOf(OrganizationAlreadyExistsError)
    })

    it('should not be able to create a organization with same whatsapp', async () => {
        await sut.execute({
            address: "rua a",
            CEP: "49000-00",
            email: "org@email.com",
            owner: "joao santos",
            password: "123456",
            whatsapp: "79999990000"
        })

        await expect(() =>
            sut.execute({
                address: "rua b",
                CEP: "48000-00",
                email: "org2@email.com",
                owner: "jose santos",
                password: "123456",
                whatsapp: "79999990000"
            })
        ).rejects.toBeInstanceOf(OrganizationAlreadyExistsError)
    })
})
