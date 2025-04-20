import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import { z } from "zod"

interface SearchZipCode {
  bairro: string
  logradouro: string
  localidade: string
  uf: string
}

const searchZipCodeSchema = z.object({
  zipcode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
})

type SearchZipCodeData = z.infer<typeof searchZipCodeSchema>

export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchZipCodeData>({
    resolver: zodResolver(searchZipCodeSchema),
  })
  const registerWithMask = useHookFormMask(register)
  const [data, setData] = useState<SearchZipCode | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSearchZipCode(data: SearchZipCodeData) {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${data.zipcode}/json/`,
      )
      const json = await response.json()

      if (json.erro) {
        throw new Error("CEP não encontrado")
      }

      setData(json)
      setError(null)
    } catch (error: any) {
      setData(null)
      setError(error.message)
    }

    reset()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-900 text-white">
      <h1 className="font-title text-5xl font-bold max-[375px]:text-4xl">
        Buscador de CEP
      </h1>

      <div className="flex flex-col gap-2">
        <form
          onSubmit={handleSubmit(handleSearchZipCode)}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ex: 00000-000"
            className="font-text rounded-lg border-2 p-2 outline-0 hover:border-lime-300 focus:border-lime-300 max-[375px]:w-32"
            {...registerWithMask("zipcode", "99999-999", { required: true })}
          />

          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-white p-2 text-black"
          >
            <Search />
          </button>
        </form>

        <ErrorMessage
          errors={errors}
          name="zipcode"
          render={({ message }) => (
            <p className="ml-2 text-sm text-red-500">{message}</p>
          )}
        />
      </div>

      {data && (
        <div className="font-text flex flex-col items-center gap-2 rounded-lg border-2 px-14 py-6 hover:border-lime-300 max-[375px]:p-4">
          <span className="flex items-center gap-2 max-[465px]:flex-col">
            <p>{data.logradouro}</p>
            <p className="max-[465px]:hidden">-</p>
            <p>{data.bairro}</p>
          </span>
          <p>
            {data.localidade} - {data.uf}
          </p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
