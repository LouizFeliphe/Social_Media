import { Link } from "react-router"
import type { Post } from "./interface";
import { Svgs } from "../../assets/assets";
import { useQuery } from "@tanstack/react-query";
import { ReceberComentarios } from "../backend/Get";
import type { Comentario } from "../Comentario/interface";
import { useAuth } from "../../contexto/auth/useAuth";
import { LikeBotaoHome } from "../Likes/likebotaoHome";


const PostItem = ({ post }: {
  post: Post
}) => {

  const {usuario} = useAuth()
  const {data: comentariosFetch, error: erroFetch, isLoading} = useQuery<Comentario[]>({queryFn: () => ReceberComentarios(post.id), queryKey: ["comentarios", post.id]})


  const comentariosQuantidade = comentariosFetch?.length ;
  const userComentario = comentariosFetch?.find((c) => c.user_id === usuario?.id);
  const fotoPerfil = post?.avatar_url

  return (
    <div className="w-[100%] sm:p-5 border-b-[1px] border-gray-600">
      <Link to={`/post/${post.id}`} className="" >
      <div className="flex gap-3">
        <img src={fotoPerfil ?? Svgs.user} alt="item" className={`h-15 w-15 max-sm:h-10 max-sm:w-10 rounded-full object-cover ${fotoPerfil ?? "invert"} ml-3`} />
        <div className="sm:pl-5 flex flex-col gap-5 max-sm:gap-1 ">
          <div className="flex max-sm:flex-col gap-2">
            <span className="font-bold text-md  sm:text-xl ">UrsopolarAgiota</span>
            <span className="font-light text-md text-gray-300 hidden sm:block ">@Sfaygam</span>
            <span className="text-md  sm:text-xl font-light text-gray-300">{new Date(post.created_at).toLocaleString()}</span>
          </div>
          <p className="text-md sm:leading-8 sm:text-xl font-extralight max-sm:text-left pr-4">{post?.conteudo}</p>

        </div>

      </div>
      </Link>
      {post?.image_url && (<div >
        <img src={post.image_url} alt="imagem" className="sm:max-w-[80%] sm:max-h-[450px] max-sm:min-w-[250px] max-sm:max-w-[420px] max-sm:w-[80vw] max-h-[400px] rounded-[20px] object-cover sm:ml-25 max-sm:ml-15 mt-2" />
      </div>)}
      <div className="flex items-center gap-5 mt-4 ml-25 max-sm:ml-15 mb-3">
        <LikeBotaoHome comentariosQuantidade={comentariosQuantidade} userComentario={userComentario}/>
        <button className={`group px-5 py-2 rounded-lg 
          cursor-pointer active:scale-95 transition duration-300
           bg-[#3d494f] hover:bg-[#333D42] 
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