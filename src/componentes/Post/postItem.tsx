import { Link } from "react-router"
import type { Post } from "./interface";
import { Svgs } from "../../assets/assets";
import { Comentarios } from "../Comentario/Comentarios";
import { LikeBotao } from "../Likes/likebotao";
import { useState } from "react";

const PostItem = ({ post }: {
  post: Post
}) => {
  
  console.log(post);
  
  const fotoPerfil = post?.profile.avatar_url
  const [expandido, setExpandido] = useState(false);
  const isVideo = post?.image_url ? post.image_url.endsWith("mp4") ? true : false : false

  return (
    <div className="w-[100%] sm:p-5 border-b-[1px] border-gray-600">

      <div className="flex gap-3">
        <Link to={`/perfil/${post.user_id}`}>
          <img src={fotoPerfil ?? Svgs.user} alt="item" className={`h-15 w-15 max-sm:h-10 max-sm:w-10 rounded-full object-cover cursor-pointer flex-shrink-0 ${fotoPerfil ?? "invert"} ml-3`} />
        </Link>
        <div className="flex-1 min-w-0" >
          <div className="sm:pl-5 flex flex-col gap-5 max-sm:gap-1 min-w-0 ">
            <div className="flex gap-3">
              <div className="flex flex-col">
                <span className="font-bold text-md sm:text-xl ">{post.profile.name}</span>
                <span className="font-light text-xl text-gray-300 hidden sm:block ">{post.profile.email}</span>
              </div>
              <span className="text-md font-light text-gray-300">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <Link to={`/post/${post.id}`} className={` ${expandido ? "" : "line-clamp-5"
              } text-lg sm:leading-8 sm:text-xl font-extralight 
            max-sm:text-left pr-4 break-words whitespace-pre-wrap`}>{post?.conteudo}</Link>
          </div>
        </div>
      </div>
      {post?.conteudo.length > 250 && <button
        onClick={() => setExpandido(!expandido)}
        className={`text-md font-semibold text-indigo-400 hover:underline cursor-pointer w-full flex pr-5 `}
      >
        <div className="flex-1"></div>
        {expandido ? "Ler menos" : "Ler mais"}
      </button>}
      {post?.image_url && (<div>
        {isVideo ? (<video
          src={post.image_url}
          controls
          className="sm:max-w-[80%] sm:max-h-[450px] max-sm:min-w-[250px] max-sm:max-w-[420px] max-sm:w-[80vw] max-h-[400px] rounded-[20px] sm:ml-25 max-sm:ml-15 mt-2"
        />) : (<img src={post.image_url} alt="imagem" className="border-[0.5px] border-[#2a2b2b] sm:max-w-[80%] sm:max-h-[450px] max-sm:min-w-[250px] max-sm:max-w-[420px] max-sm:w-[80vw] max-h-[400px] rounded-[20px] object-cover sm:ml-25 max-sm:ml-15 mt-2" />)}
      </div>)}
      <div className="flex items-center gap-5 mt-4 ml-25 max-sm:ml-15 mb-3">
        <Comentarios postId={post.id} isHome={true} nomePost={post.titulo} />
        <LikeBotao postId={post.id} isHome={true} />
      </div>
    </div>
  );

}
export default PostItem