export class OrganizationMustBeCompleteError extends Error {
    constructor() {
        super('Informações imcompletas para organização')
    }
}