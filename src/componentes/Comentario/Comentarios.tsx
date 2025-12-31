import { useState } from "react"
import { useAuth } from "../../contexto/auth/useAuth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import ComentarioItem from "./ComentarioItem"
import type { Comentario, ComentarioArvore, Props } from "./interface"
import { EnviarComentario } from "../backend/Post"
import { ReceberComentarios } from "../backend/Get"


export const Comentarios = ({postId}: Props) => {

    const [comentario, setComentario] = useState<string>("")
    const {usuario} = useAuth()
    const queryClient = useQueryClient()

    const {data: comentariosFetch, error: erroFetch, isLoading} = useQuery<Comentario[]>({queryFn: () => ReceberComentarios(postId), queryKey: ["comentarios", postId]})

    const {mutate, isPending, error} = useMutation({mutationFn: (dados: Comentario)=> EnviarComentario(dados), 
    
    onSuccess:()=>{
         queryClient.invalidateQueries({ queryKey: ["comentarios", postId] });
    }
    })

    const handleSubmit = (e: React.FormEvent) =>{

        e.preventDefault()     

        mutate({post_id: postId, conteudo: comentario, user_id: usuario?.id || null, author: usuario?.user_metadata.name || null, pai_comentario_id: null})     
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

    return (
        <div> 
            <form onSubmit={handleSubmit}>
            <label htmlFor="comentario">Comentario</label>
            <textarea id="comentario" rows={4} required onChange={(e)=>{
                setComentario(e.target.value)
            }}/>
            <button>Enviar comentario</button>
            </form>
            {isPending || isLoading && (<span>Carregando...</span>)}
            {error && (<span>Erro, {error.message}</span>)}
            {erroFetch && (<span>Erro, {erroFetch.message}</span>)}
            <div>{comentariosPagina.map((comentario,key)=>{
                return (
                    <ComentarioItem comentario={comentario} key={key} postId={postId}/>
                )
            })}</div>
        </div>
    )
}