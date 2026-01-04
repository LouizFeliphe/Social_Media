import { useState } from "react";
import { useAuth } from "../../contexto/auth/useAuth";
import type { Comentario, ComentarioItemType } from "./interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EnviarComentario } from "../backend/Post";
import { Svgs } from "../../assets/assets";
import { DeletarComentario } from "../backend/Delete";
import { EditarComentario } from "../backend/update";

export const ComentarioItem = ({ postId, comentario }: ComentarioItemType) => {

    const queryCliente = useQueryClient()
    const [responder, setResponder] = useState<boolean>(false)
    const [comentarioFormulario, setComentarioFormulario] = useState<string>("")
    const [mostrarRespostas, setMostrarRespostas] = useState<boolean>(false)
    const [expandido, setExpandido] = useState(false);
    const [editar,setEditar] = useState(false)
   

    const { mutate, error, isPending } = useMutation({
        mutationFn: (data: Comentario) => {
            return EnviarComentario(data)
        }, onSuccess: () => {

            queryCliente.invalidateQueries({ queryKey: ["comentarios", postId] })
        }
    })
    const {mutate:mutateDeletar, error:deletarErro, isPending:isPendingDeletar} = useMutation({ mutationFn: (data: {comentarioId: number}) => DeletarComentario(data.comentarioId), onSuccess: () => queryCliente.invalidateQueries({ queryKey: ["comentarios", postId] })})

    const {mutate:mutateEditar, error:editarErro, isPending:isPendingEditar} = useMutation({ mutationFn: (data: {comentarioEditado: string, comentarioId: number}) => EditarComentario(data.comentarioEditado,data.comentarioId), onSuccess: () => {
        setEditar(false)
        queryCliente.invalidateQueries({ queryKey: ["comentarios", postId] })
    }})

    const handleEditarComentario = () =>{
         if(comentario?.id && comentarioFormulario){
            mutateEditar({comentarioEditado: comentarioFormulario, comentarioId: comentario.id})
         }    
    }

    const handleDeletarComentario = () =>{
        if(comentario?.id){
            mutateDeletar({comentarioId: comentario.id})
        }
    }

    const handleSubmitComentario = (e: React.FormEvent) => {
        e.preventDefault()
        if(!comentarioFormulario) return
        mutate({ post_id: postId, conteudo: comentarioFormulario, user_id: usuario?.id || null, author: usuario?.user_metadata.name || null, pai_comentario_id: comentario.id!, avatar_url: usuario?.user_metadata.avatar_url || null })
        setResponder(false)
    }

    const { usuario } = useAuth()

    return (
        <div className="space-y-4 p-4 max-sm:p-0 max-sm:pt-10">
            <div>
                <div className="flex gap-5 mb-3">
                    <img src={comentario?.avatar_url ?? Svgs.user} alt="item" className={`h-10 w-10 rounded-full object-cover ${comentario?.avatar_url ?? "invert"}`} />
                    <span className="font-bold">{comentario.author}</span>
                    <span className="font-light italic">{new Date(comentario.created_at!).toLocaleString()}</span>
                </div>
                <textarea value={ comentarioFormulario ? comentarioFormulario : comentario.conteudo } className={`mb-4 p-5 bg-white/5 outline-2 -outline-offset-1 outline-indigo-400 focus-within:outline-3 focus-within:-outline-offset-2 focus-within:outline-indigo-600 w-full h-50 ${editar ? "": "hidden"}`} onChange={(e)=>setComentarioFormulario(e.target.value)}/>
                <p className={`mb-4 p-5 text-justify ${expandido ? "" : "line-clamp-3"
                    } ${editar ? "hidden" : ""}`}>{comentario.conteudo}</p>
                <div className="mb-5 flex justify-between">
                    <div className="flex gap-4">
                          <button onClick={handleDeletarComentario}>
                        <img src={Svgs.lixo} alt="lixeira" className="h-5 invert"/>
                    {isPendingDeletar && (<span>Carregando..</span>)}
                    {deletarErro && (<span>Erro ao deletar</span>)}
                </button>
                    <button onClick={()=>setEditar((prev)=>!prev)}><img src={Svgs.editar} alt="editar" className="h-5 invert"/></button>
                    </div>
                     <button className={`${editar ? "":"hidden"}`}  onClick={handleEditarComentario}>Enviar</button>
                     {comentario.conteudo.length > 120 && (
                    <button
                        onClick={() => setExpandido(!expandido)}
                        className={`text-md font-semibold text-indigo-400 hover:underline cursor-pointer ${editar ? "hidden": ""}`}
                    >
                        {expandido ? "Ler menos" : "Ler mais"}
                    </button>
                )}   
                </div>
               
                <div className="flex gap-5">
                    <button className="font-semibold hover:underline cursor-pointer" onClick={() => setResponder((prev) => !prev)}>Comentar</button>
                    <button className={`${comentario.children!.length > 0 ? "" : "hidden"} cursor-pointer`} onClick={() => setMostrarRespostas((prev) => !prev)}>{mostrarRespostas ? <img src={Svgs.abrirComentario} alt="abriComentario" className="h-7 invert" /> : <img src={Svgs.fecharComentario} className="h-7 invert" alt="abriComentario" />}</button>
                </div>

            </div>
            {responder && (
                <form onSubmit={handleSubmitComentario} className="flex flex-col gap-3 border-t p-2">
                    <label htmlFor="comentario">Responder <span className="ml-2 text-purple-300">{`${comentario.author}`}</span></label>
                    <textarea
                        id="comentario"
                        rows={5}
                        className="bg-white/5 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500  py-1.5 pr-3 pl-3 text-base text-white"
                        placeholder="Comentar..."
                        onChange={(e) => {
                            setComentarioFormulario(e.target.value);
                        }}
                    />
                    <button className="flex items-center justify-center rounded-md bg-indigo-600 p-2 w-26 h-8 cursor-pointer hover:bg-indigo-700">Enviar</button>
                    {isPending && (<span>Carregando</span>)}
                    {error && (<span className="text-red-600">Ocorreu um erro</span>)}
                </form>

            )}
            {mostrarRespostas && comentario.children!.length > 0 && comentario.children?.map((child, key) => {
                return (<div className="ml-2 max-sm:ml-0 max-sm:border-l p-3">
                    <ComentarioItem comentario={child} key={key} postId={postId} />
                </div>)
            })}
        </div>
    )
}

