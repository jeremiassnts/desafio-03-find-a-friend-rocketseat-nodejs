export class PetDoesNotExists extends Error {
  constructor() {
    super('Pet não encontrado')
  }
}
