import { useQuery } from "@tanstack/react-query"
import { useState} from "react"
import { fetchCategories, fetchGifs } from "../../../backend/Get"
import { Carregamento } from "../../../Carregamento"
import type { Category, GifResult, GifTabProps } from "./interface"

export function GifTab({ onSelect }: GifTabProps) {
  
  const [search, setSearch] = useState<string>("Surpresso")
  const [searchGif, setSearchGif] = useState<string>("")

  const {data:categories, isLoading: loadingCategories, isError:isErrorCategoria, refetch:refetchCategorias} = useQuery<Category[]>({queryKey: ["categories"],queryFn: fetchCategories, refetchOnWindowFocus: false,})

  const {data:gifs, isLoading: loadingGifs, isError:isErrorGif, refetch:refetchGifs} = useQuery<GifResult[]>({queryKey: ["gifs", search], refetchOnWindowFocus: false,
    queryFn: ({queryKey}) => {
    const [, pesquisa ] = queryKey
    const categoriaOuGifs = (pesquisa as string).startsWith("/")
    
    if(!categoriaOuGifs){
      setSearchGif(pesquisa as string)
    }
    return fetchGifs(pesquisa as string)
  }})

  if(isErrorCategoria || isErrorGif){
    return (
      <div>
        <p className="text-center font-bold text-red-500">Erro ao iniciar os gifs</p> 
        {loadingCategories || loadingGifs ?  (<p className="text-white text-xl">Carregando...</p>) :
        (<button type="button" onClick={()=>{
            refetchCategorias()
            refetchGifs()
        }} className={`group px-8 sm:py-2.5 sm:my-10 my-5 rounded-lg text-white
      cursor-pointer active:scale-95 transition duration-300 w-40 max-sm:w-33 max-sm:h-9 bg-red-600`}>
      <p className="relative h-6 overflow-hidden">
          <span className="block transition-transform duration-300 group-hover:-translate-y-full">Reconectar</span>
          <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%]">Clique !</span>
      </p>
        </button>) }
        {loadingCategories || loadingGifs && <Carregamento tamanho="10" texto="Carregando Gifs..."/>}
      </div>
    )
  }

  if(loadingGifs && categories === undefined || null){
    return (
      <div className="w-80 bg-[#2A3236] rounded-lg shadow-lg p-3">
          <Carregamento tamanho="10" texto="Carregando Gifs..."/>
      </div>
    )
  }

  return (
    <div className="w-70 sm:w-120 md:w-180 bg-[#2A3236] rounded-lg shadow-lg p-3 border border-indigo-500">
      <input
        type="text"
        placeholder="Buscar GIF"
        value={searchGif}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded  px-2 py-1 mb-5"
      />

      <div className="flex gap-2 overflow-x-auto mb-5">
        {categories && categories.map((cat,index) => (
          <div
            key={index}
            className="min-w-[80px] cursor-pointer text-center relative mb-5"
            onClick={() => {
              setSearch(cat.path)
            }}
          >
            <span className="opacity-85 bg-gray-400 absolute top-3 right-0 w-[80px] text-sm font-bold text-black">{cat.searchterm}</span>
            <img
              src={cat.image}
              alt={cat.name}
              className="rounded-md h-12 w-full object-cover"
            />
          </div>
        ))}
      </div>

      {loadingCategories || loadingGifs  ? (
        <Carregamento tamanho="8" texto="Carregando Gifs..."/>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-4">
          { gifs && gifs.map((gif) => (
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
