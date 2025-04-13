import { ErrorMessage } from "@hookform/error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import { z } from "zod"

const searchZipCodeSchema = z.object({
  zipcode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
})

type SearchZipCodeData = z.infer<typeof searchZipCodeSchema>

export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchZipCodeData>({
    resolver: zodResolver(searchZipCodeSchema),
  })
  const registerWithMask = useHookFormMask(register)

  function handleSearchZipCode(data: SearchZipCodeData) {
    console.log(data)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-900 text-white">
      <h1 className="font-title text-5xl font-bold">Buscador de CEP</h1>

      <div className="flex flex-col gap-2">
        <form
          onSubmit={handleSubmit(handleSearchZipCode)}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ex: 00000-000"
            className="font-text rounded-lg border-2 p-2 outline-0 hover:border-lime-300 focus:border-lime-300"
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
    </div>
  )
}
