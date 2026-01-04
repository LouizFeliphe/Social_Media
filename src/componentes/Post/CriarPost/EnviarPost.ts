import { useAuth } from "../../../contexto/auth/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CriarPostBackend } from "../../backend/Post";
import type { PostInput } from "../interface";

interface Props {
    titulo: string 
    conteudo: string ,
    imageFile: File | null,
}


// const MAX_SIZE = 15 * 1024 * 1024;
export const EnviarPost = ({titulo,conteudo,imageFile}:Props) => {

    const queryClient = useQueryClient()
    const { usuario } = useAuth()

    const { mutate, isError, isPending } = useMutation({ mutationFn: (data: { post: PostInput, imageFile: File | null }) => CriarPostBackend(data.post, data.imageFile), onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["posts"]})
    }})

    const IniciarEnvio = () => {
        mutate({ post: { titulo, conteudo, avatar_url: usuario?.user_metadata.avatar_url || null }, imageFile: imageFile })
    }


    const bgClass = isPending
        ? "bg-orange-600 hover:bg-orange-700"
        : isError
            ? "bg-red-600 hover:bg-red-700"
            : "bg-indigo-600 hover:bg-indigo-700";

    const bgAviso = isPending
        ? "Carregando"
        : isError
            ? "Erro"
            : "Retry";

    const bgAvisoSecundario = isPending
        ? "Carregando..."
        : isError
            ? "Retry"
            : "Confirmar";

    return {
        IniciarEnvio,
        bgClass,
        bgAviso,
        bgAvisoSecundario,
        isError,
    }
}