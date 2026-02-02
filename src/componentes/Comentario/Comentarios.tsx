import { useState } from "react"
import { useAuth } from "../../contexto/auth/useAuth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {ComentarioItem} from "./ComentarioItem"
import type { Comentario, ComentarioArvore, Props } from "./interface"
import { EnviarComentario } from "../backend/Post"
import { ReceberComentarios } from "../backend/Get"
import { Svgs } from "../../assets/assets"
import { PostHome } from "../Post/CriarPost/PostHome"
import { Link } from "react-router"
import { Carregamento } from "../Carregamento"


export const Comentarios = ({postId, isHome, nomePost}: Props) => {

    const [comentario, setComentario] = useState<string>("")
    const [abirComentario,setAbrirComentario] = useState<boolean>(false)
    const {usuario} = useAuth()
    const queryClient = useQueryClient()

    const {data: comentariosFetch, error: erroFetch, isLoading} = useQuery<Comentario[]>({queryFn: () => ReceberComentarios(postId), queryKey: ["comentarios", postId]})

    const {mutate, isPending, error:erroEnviar} = useMutation({mutationFn: (dados: Comentario)=> {
        if(!usuario?.user_metadata)  {
        alert("Você deve estar logado")
        setAbrirComentario(false)
        throw new Error("usuario nao encontrado");
      }
        return EnviarComentario(dados)
    }, 
    
    onSuccess:()=>{
         setAbrirComentario(false)
         setComentario("")
         queryClient.invalidateQueries({ queryKey: ["comentarios", postId] });
    }
    })

    const handleSubmit = (e: React.FormEvent, comentarioHome?: string) =>{
        e.preventDefault()     
        mutate({post_id: postId, conteudo: comentarioHome || comentario, user_id: usuario?.id || null, pai_comentario_id: null,})    
    }

    const ConstrutorComentario = (comentarios: Comentario[]): ComentarioArvore[] =>{
        const map = new Map<number, ComentarioArvore>()
        const raizes: ComentarioArvore[] = []

        comentarios.forEach((comentario)=>{
            map.set(comentario.id!, {...comentario, children: []})
        })

        comentarios.forEach((comentario)=>{
            if(comentario.pai_comentario_id){
                const paiComentario = map.get(comentario.pai_comentario_id)

                if(paiComentario) paiComentario.children!.push(map.get(comentario.id!)!)

            }else{
                raizes.push(map.get(comentario.id!)!)
            }
        })

        return raizes
    }
       
    const comentariosPagina: ComentarioArvore[] = comentariosFetch ? ConstrutorComentario(comentariosFetch) : []
    const comentariosQuantidade:number = comentariosFetch?.length || 0    
    const userComentario = comentariosFetch?.find((c) => c.user_id === usuario?.id)

    if(isHome){
        if(userComentario){
            return (
                <Link to={`/post/${postId}`} onClick={()=>{}}className={`px-5 py-2 rounded-lg 
                    cursor-pointer active:scale-95 bg-[#3d494f] hover:bg-[#333D42]
                    `}>
                    <span className="flex items-center gap-3">{`${comentariosQuantidade}`}<img src={Svgs.comentario} alt="Like" className="h-4" /></span>
            </Link>
      )
        }
        return (
            <div>
                {abirComentario && (
                <div className={`${usuario?.user_metadata ? "" : "hidden"}`}>
                <div className="fixed inset-0 bg-black/50 z-40"></div>
                <div className="fixed
      top-25 left-50
      max-lg:left-25 max-lg:top-10
      max-md:top-0 max-md:left-0
      z-[9999]
      bg-[#232a2e]
      w-[70%]
      max-md:w-screen
      max-md:min-h-screen
      p-5
      rounded-md
      max-h-[100dvh]
      overflow-y-auto">
                <div className="flex justify-between"> 
                    <span className="ml-5">Respondendo ao Post <span className="text-blue-400 italic">"{nomePost}"</span></span>
                     <img src={Svgs.xFechar} alt="fechar" className="h-8 invert mr-4 cursor-pointer" onClick={()=> setAbrirComentario(false)} />
                    </div>
                    <PostHome isComentarioPost={true} onClicar={(e: React.FormEvent, comentarioHome:string)=> handleSubmit(e, comentarioHome)}/> 
                </div>
                </div>)
                }
                <button onClick={()=> {
                    if(usuario?.user_metadata) setAbrirComentario((prev) => !prev)
                    else alert("Você precisa estar logado")
                   }
                } className={`group px-5 py-2 rounded-lg 
                cursor-pointer active:scale-95 transition-all duration-300 bg-[#3d494f] hover:bg-[#333D42]
                `}>
                <p className="relative overflow-hidden">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full flex items-center gap-3">{`${comentariosQuantidade} `}<img src={Svgs.comentario} alt="comentario" className={`h-4 ${userComentario ? "" : "invert"}`} /></span>
                <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%] flex items-center gap-3">{`${comentariosQuantidade !== undefined ? userComentario ? comentariosQuantidade : comentariosQuantidade + 1 : comentariosQuantidade} `}<img src={Svgs.comentario} alt="comentario" className={`h-4 ${userComentario ? "invert" : ""}`} /></span>
                </p>
                </button>
            </div>
        )
    }

    return (
        <div className="w-[90%]"> 
            <form onSubmit={handleSubmit} className="mb-5 p-4">
            <div className="flex flex-col justify-center">
                <label htmlFor="comentario" className="mb-3">Enviar Comentario</label>
            <textarea id="comentario" rows={4} required value={comentario} className="p-3" placeholder="Escreva..." onChange={(e)=>{
                setComentario(e.target.value)
            }}/>
            </div>
            <button className={`flex items-center justify-center rounded-md ${isPending ? "bg-orange-500" : " bg-indigo-600 hover:bg-indigo-700 "} p-2 mt-3 w-26 h-8 cursor-pointer `} disabled={isPending} >{isPending ? "Carregando..." : "Enviar"}</button>
            </form>
            {isPending || isLoading && (<Carregamento tamanho="10" texto=""/>)}
            {erroEnviar && (<span className="text-red-600 pr-3">Erro ao enviar</span>)}
            {erroFetch && (<span className="text-red-600">Erro ao carregar comentarios</span>)}
            <div className="space-y-5">{comentariosPagina.map((comentario,key)=>{
                return (
                    <ComentarioItem comentario={comentario} key={key} postId={postId}/>
                )
            })}</div> 
        </div>
    )
}