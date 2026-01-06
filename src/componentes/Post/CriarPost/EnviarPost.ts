import { useAuth } from "../../../contexto/auth/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CriarPostBackend } from "../../backend/Post";
import type { PostInput } from "../interface";

interface Props {
    titulo: string 
    conteudo: string ,
    imageFile: File | null,
}

const MAX_SIZE_Image = 15 * 1024 * 1024; //15MB
const MAX_SIZE_Video = 30 * 1024 * 1024  //30MB
const ALLOWED_TYPES = [
  "video/mp4",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
]


export const FileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      e.target.value = ""
      alert("Formato não permitido. Use MP4, JPG, JPEG ou PNG.")
      return
    }

    const tipo = file.type.startsWith("video/")
      ? "videos"
      : "images"
    
    if(tipo === "videos"){
        if (file.size > MAX_SIZE_Video) {
        e.target.value = ""
        alert("Video deve ter no máximo 30MB.")
        return
        }
    } else {
        if (file.size > MAX_SIZE_Image) {
        e.target.value = ""
        alert("Imagem deve ter no máximo 15MB.")
        return
        }
    }

    return file
  }

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
            : "Enviar";

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
        isPending
    }
}

