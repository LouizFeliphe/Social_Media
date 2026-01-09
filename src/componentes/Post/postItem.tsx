import { Link } from "react-router"
import type { Post } from "./interface";
import { Svgs } from "../../assets/assets";
import { Comentarios } from "../Comentario/Comentarios";
import { LikeBotao } from "../Likes/likebotao";

const PostItem = ({ post }: {
  post: Post
}) => {

  const fotoPerfil = post?.avatar_url
  
  const isVideo = post?.image_url ? post.image_url.endsWith("mp4") ? true : false : false

  console.log("o QUE TEM NO POST: " + post?.avatar_url);
  

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
        { isVideo ? ( <video
          src={post.image_url}
          controls
          className="sm:max-w-[80%] sm:max-h-[450px] max-sm:min-w-[250px] max-sm:max-w-[420px] max-sm:w-[80vw] max-h-[400px] rounded-[20px] sm:ml-25 max-sm:ml-15 mt-2"
        />): (<img src={post.image_url} alt="imagem" className="sm:max-w-[80%] sm:max-h-[450px] max-sm:min-w-[250px] max-sm:max-w-[420px] max-sm:w-[80vw] max-h-[400px] rounded-[20px] object-cover sm:ml-25 max-sm:ml-15 mt-2" />)}
      </div>)}
      <div className="flex items-center gap-5 mt-4 ml-25 max-sm:ml-15 mb-3">
        <Comentarios postId={post.id} isHome={true} nomePost={post.titulo} />
        <LikeBotao postId={post.id} isHome={true}/>
      </div>
    </div>
  );

}
export default PostItem