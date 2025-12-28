import { useState } from "react"
import { useAuth } from "../../contexto/auth/useAuth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../supabase"

interface Props{
    postId: number,
}

interface Comentario {
    post_id: number,
    conteudo: string,
    user_id: string | null,
    author: string | null,
    pai_comentario_id: string | null,
}

const EnviarComentario = async ({post_id, conteudo, user_id, author, pai_comentario_id}: Comentario): Promise<void> =>{

    if(!user_id || !author) {
        console.log(user_id, author);
        
        throw new Error("Usuario nao autenticado")}

    const { error } = await supabase.from("comentarios").insert({
        post_id,
        conteudo,
        user_id,
        author, 
        pai_comentario_id
    })

    if( error ) throw new Error("Aconteceu um erro ao enviar")
}

const ReceberComentarios = async (postId: number) : Promise<Comentario[]> => {

    const {data, error} = await supabase.from("comentarios").select("*").eq("post_id", postId).order("created_at", {ascending: true})

    if(error) throw new Error("Aconteceu um erro no fetch")
        
    return data as Comentario[]
    
}


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
            {comentariosFetch && comentariosFetch.map((comentario: Comentario) =>{
                return <span>{comentario.author}</span>
            })}


        </div>
    )
}