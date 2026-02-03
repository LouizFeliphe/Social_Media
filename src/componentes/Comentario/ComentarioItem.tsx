import { useState } from "react";
import { useAuth } from "../../contexto/auth/useAuth";
import type { Comentario, ComentarioItemType } from "./interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EnviarComentario } from "../backend/Post";
import { Svgs } from "../../assets/assets";
import { DeletarComentario } from "../backend/Delete";
import { EditarComentario } from "../backend/update";
import { Link } from "react-router";
import { Carregamento } from "../Carregamento";

export const ComentarioItem = ({ postId, comentario }: ComentarioItemType) => {

    const queryCliente = useQueryClient()
    const [responder, setResponder] = useState<boolean>(false)
    const [comentarioFormulario, setComentarioFormulario] = useState(() => comentario?.conteudo ?? "")
    const [mostrarRespostas, setMostrarRespostas] = useState<boolean>(false)
    const [expandido, setExpandido] = useState(false);
    const [editar, setEditar] = useState(false)
    const { usuario } = useAuth()

    const { mutate, error, isPending } = useMutation({
        mutationFn: (data: Comentario) => {
            if (!usuario?.user_metadata) {
                alert("Você deve estar logado")
                throw new Error("usuario nao encontrado");
            }
            return EnviarComentario(data)
        }, onSuccess: () => {
            queryCliente.invalidateQueries({ queryKey: ["comentarios", postId] })
        }
    })

    const { mutate: mutateDeletar, error: deletarErro, isPending: isPendingDeletar } = useMutation({
        mutationFn: (data: { comentarioId: number }) => {
            if (!usuario?.user_metadata) {
                alert("Você deve estar logado")
                throw new Error("usuario nao encontrado");
            }
            return DeletarComentario(data.comentarioId)
        }, onSuccess: () => {
            queryCliente.invalidateQueries({ queryKey: ["comentarios", postId] })
        }
    })

    const { mutate: mutateEditar, error: editarErro, isPending: isPendingEditar } = useMutation({
        mutationFn: (data: { comentarioEditado: string, comentarioId: number }) => {
            if (!usuario?.user_metadata) {
                alert("Você deve estar logado")
                throw new Error("usuario nao encontrado");
            }
            return EditarComentario(data.comentarioEditado, data.comentarioId)
        }, onSuccess: () => {
            setEditar(false)
            queryCliente.invalidateQueries({ queryKey: ["comentarios", postId] })
        }
    })

    const handleEditarComentario = () => {
        if (comentario?.id && comentarioFormulario) {
            mutateEditar({ comentarioEditado: comentarioFormulario, comentarioId: comentario.id })
        }
    }

    const handleDeletarComentario = () => {
        if (comentario?.id) {
            mutateDeletar({ comentarioId: comentario.id })
        }
    }

    const handleSubmitComentario = (e: React.FormEvent) => {
        e.preventDefault()
        if (!comentarioFormulario) return
        mutate({ post_id: postId, conteudo: comentarioFormulario, user_id: usuario?.id || null, pai_comentario_id: comentario.id! })
        setResponder(false)
    }



    return (
        <div className="space-y-4 p-4 max-sm:p-0 max-sm:pt-10 max-sm:pb-16">
            <div>
                <div className="flex max-sm:flex-col gap-5 mb-3">
                    <Link to={`/perfil/${comentario.user_id}`} className="flex items-center jsutify-center gap-5">
                        <img src={comentario.profile?.avatar_url ?? Svgs.user} alt="item" className={`h-10 w-10 rounded-full object-cover ${comentario.profile?.avatar_url ?? "invert"}`} />
                        <span className="font-bold">{comentario.profile?.name}</span>
                    </Link>

                    <span className="font-light italic">{new Date(comentario.created_at!).toLocaleDateString()}</span>
                </div>
                <textarea value={comentarioFormulario} className={`mb-4 p-5 bg-white/5 outline-2 -outline-offset-1 outline-indigo-400 focus-within:outline-3 focus-within:-outline-offset-2 focus-within:outline-indigo-600 w-full h-50 ${editar ? "" : "hidden"}`} onChange={(e) => setComentarioFormulario(e.target.value)} />
                <p className={`mb-4 p-5 text-justify ${expandido ? "" : "line-clamp-3"
                    } ${editar ? "hidden" : ""}`}>{comentario.conteudo}</p>
                <div className={`mb-5 flex justify-between`}>
                    <div className="flex gap-4">
                        <button onClick={handleDeletarComentario}>
                            <img src={Svgs.lixo} alt="lixeira" className={`${usuario?.id === comentario.user_id ? "" : "hidden"} h-5 invert cursor-pointer`} />
                        </button>
                        <button onClick={() => {
                            if (editar) setComentarioFormulario(comentario.conteudo)
                            setEditar((prev) => !prev)
                        }}className={`${usuario?.id === comentario.user_id ? "" : "hidden"}`}><img src={editar ? Svgs.xFechar : Svgs.editar} alt="editar" className="h-5 invert cursor-pointer" /></button>
                        {isPendingDeletar && <Carregamento tamanho="5" texto="" />}
                        {deletarErro && (<span className="text-red-600">Erro ao deletar</span>)}
                    </div>
                    <button className={`${editar ? "" : "hidden"} cursor-pointer ${usuario?.id === comentario.user_id ? "" : "hidden"}`} onClick={handleEditarComentario}>Enviar</button>
                    {comentario.conteudo.length > 120 && (
                        <button
                            onClick={() => setExpandido(!expandido)}
                            className={`text-md font-semibold text-indigo-400 hover:underline cursor-pointer ${editar ? "hidden" : ""}`}
                        >
                            {expandido ? "Ler menos" : "Ler mais"}
                        </button>)}
                    {isPendingEditar && <Carregamento tamanho="5" texto="" />}
                    {editarErro && (<span className="text-red-600">Erro ao editar</span>)}
                </div>

                <div className="flex gap-5">
                    <button className="font-semibold hover:underline cursor-pointer" onClick={() => setResponder((prev) => !prev)}>{`${responder ? "Sair" : "Comentar"}`}</button>
                    <button className={`${comentario.children!.length > 0 ? "" : "hidden"} cursor-pointer`} onClick={() => setMostrarRespostas((prev) => !prev)}>{mostrarRespostas ? <img src={Svgs.abrirComentario} alt="abriComentario" className="h-7 invert cursor-pointer" /> : <img src={Svgs.fecharComentario} className="h-7 invert cursor-pointer" alt="abriComentario" />}</button>
                </div>

            </div>
            {responder && (
                <form onSubmit={handleSubmitComentario} className="flex flex-col gap-3 border-t p-2">
                    <label htmlFor="comentario">Responder <span className="ml-2 text-purple-300">{`${comentario.profile?.name}`}</span></label>
                    <textarea
                        id="comentario"
                        rows={5}
                        className="bg-white/5 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500  py-1.5 pr-3 pl-3 text-base text-white"
                        placeholder="Comentar..."
                        onChange={(e) => {
                            setComentarioFormulario(e.target.value);
                        }}
                    />
                    <button className={`flex items-center justify-center rounded-md ${isPending ? "bg-orange-500" : " bg-indigo-600 hover:bg-indigo-700 "} p-2 mt-3 w-26 h-8 cursor-pointer `} disabled={isPending} >{isPending ? "Carregando" : "Enviar"}</button>
                    {isPending && (<Carregamento tamanho="5" texto="" />)}
                    {error && (<span className="text-red-600">Erro ao enviar comentario</span>)}
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

