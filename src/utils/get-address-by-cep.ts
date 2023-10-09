import axios from 'axios'
import { z } from 'zod'

export const getAddressByCEP = async (cep: string) => {
  const url = `https://viacep.com.br/ws/${cep}/json/`
  const getAddressByCEPSchema = z.object({
    cep: z.string(),
    logradouro: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    localidade: z.string(),
    uf: z.string(),
    ibge: z.string(),
    gia: z.string(),
    ddd: z.string(),
    siafi: z.string(),
  })

  const { data } = await axios.get(url)
  const address = getAddressByCEPSchema.parse(data)

  return {
    state: address.uf,
    city: address.localidade,
    address: `${address.logradouro} ${address.complemento}`,
    neighborhood: address.bairro,
  }
}
