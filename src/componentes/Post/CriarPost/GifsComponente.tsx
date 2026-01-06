import { useQuery } from "@tanstack/react-query"
import {  useState} from "react"
import { fetchCategories, fetchGifs } from "../../backend/Get"

type GifResult = {
  id: string
  media_formats: {
    gif: { url: string }
    nanogif?: { url: string }
  }
}

type Category = {
  name: string
  image: string
  path: string
}

interface GifTabProps {
  onSelect: (gifUrl: string) => void
}

export function GifTab({ onSelect }: GifTabProps) {
  

  const [search, setSearch] = useState("excited")
  const [gifs, setGifs] = useState<GifResult[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const {data:categoriesFetch, isLoading: loadingCategories, isSuccess: isSuccessCategories} = useQuery({queryFn: fetchCategories, queryKey: ["categories"]})

  const {data:gifsFetch, isLoading: loadingGifs, isSuccess: isSuccessGifs} = useQuery({queryFn: () => fetchGifs(search), queryKey: ["gifs"]})

  
  

  
  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-3">
      {/* 🔎 Pesquisa */}
      <input
        type="text"
        placeholder="Buscar GIF"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchGifs(search)}
        className="w-full border rounded px-2 py-1 mb-2"
      />

      {/* 🏷️ Categorias */}
      <div className="flex gap-2 overflow-x-auto mb-3">
        {categories.map((cat) => (
          <div
            key={cat.path}
            className="min-w-[80px] cursor-pointer text-center"
            onClick={() => fetchGifs(cat.path)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="rounded-md h-12 w-full object-cover"
            />
            <p className="text-xs mt-1">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* 🖼️ GIFs */}
      {loading ? (
        <p className="text-center text-sm">Carregando...</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {gifs.map((gif) => (
            <img
              key={gif.id}
              src={gif.media_formats.nanogif?.url || gif.media_formats.gif.url}
              className="cursor-pointer rounded"
              onClick={() => onSelect(gif.media_formats.gif.url)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
