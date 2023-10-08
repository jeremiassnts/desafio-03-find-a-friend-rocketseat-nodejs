export class GetPetsMustHaveCity extends Error {
    constructor() {
        super('Listagem de pets só é possível com informações completas de cidade')
    }
}