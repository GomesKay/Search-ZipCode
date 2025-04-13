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
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-white bg-zinc-900">
      <h1 className="text-5xl font-bold font-title">Buscador de CEP</h1>

      <div className="flex flex-col gap-2">
        <form
          onSubmit={handleSubmit(handleSearchZipCode)}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ex: 00000-000"
            className="p-2 rounded-lg border-2 outline-0 font-text hover:border-lime-300 focus:border-lime-300"
            {...registerWithMask("zipcode", "99999-999", { required: true })}
          />

          <button
            type="submit"
            className="p-2 rounded-lg bg-white text-black cursor-pointer"
          >
            <Search />
          </button>
        </form>

        <ErrorMessage
          errors={errors}
          name="zipcode"
          render={({ message }) => (
            <p className="text-sm text-red-500 ml-2">{message}</p>
          )}
        />
      </div>
    </div>
  )
}
