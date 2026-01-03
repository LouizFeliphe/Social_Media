import { Link } from "react-router"
import type { Post } from "./interface";
import { Svgs } from "../../assets/assets";
import { useQuery } from "@tanstack/react-query";
import { ReceberComentarios } from "../backend/Get";
import type { Comentario } from "../Comentario/interface";
import { useAuth } from "../../contexto/auth/useAuth";


const PostItem = ({ post }: {
  post: Post
}) => {

  const {usuario} = useAuth()
  const {data: comentariosFetch, error: erroFetch, isLoading} = useQuery<Comentario[]>({queryFn: () => ReceberComentarios(post.id), queryKey: ["comentarios", post.id]})


  const comentariosQuantidade = comentariosFetch?.length ;
  const userComentario = comentariosFetch?.find((c) => c.user_id === usuario?.id);
  const fotoPerfil = post?.avatar_url

  return (
    <div className="w-[100%] p-5">

      <Link to={`/post/${post.id}`} className="" >
      <div className="flex gap-3">
        <img src={fotoPerfil ?? Svgs.user} alt="item" className={`h-15 w-15 rounded-full object-cover ${fotoPerfil ?? "invert"}`} />
        <div className="flex flex-col gap-2">
          <div className="flex max-sm:flex-col items-center gap-2">
            <span className="font-bold text-md  sm:text-xl">UrsopolarAgiota</span>
            <span className="font-light text-md text-gray-300">@Sfaygam</span>
            <span className="text-md sm:text-xl font-light text-gray-300 hidden sm:block">{new Date(post.created_at).toLocaleString()}</span>
          </div>
          <p className="text-md leading-8 sm:text-xl font-extralight ">{post?.conteudo}</p>

        </div>

      </div>
      </Link>
      {post?.image_url && (<div>
        <img src={post.image_url} alt="imagem" className="max-w-[80%] max-h-[550px] rounded-[20px] object-cover ml-18 mt-10 mb-10" />
      </div>)}
      <div className="flex items-center justify-center gap-15">
        <button className={`group px-5 py-2 rounded-lg 
          cursor-pointer active:scale-95 transition duration-300 bg-indigo-600
          `}>
          <p className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full flex items-center gap-3">{`${comentariosQuantidade} `}<img src={Svgs.comentario} alt="comentario" className="h-4 invert" /></span>
            <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%] flex items-center gap-3">{`${comentariosQuantidade !== undefined ? comentariosQuantidade + 1 : comentariosQuantidade} `}<img src={Svgs.comentario} alt="comentario" className="h-4" /></span>
          </p>
        </button>
        <button className={`group px-5 py-2 rounded-lg 
          cursor-pointer active:scale-95 transition duration-300 bg-indigo-600
          `}>
          <p className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full"><img src={Svgs.like} alt="comentario" className="h-4 invert" /></span>
            <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%]"><img src={Svgs.like} alt="comentario" className="h-4" /></span>
          </p>
        </button>
      </div>
    </div>
  );

}
export default PostItem