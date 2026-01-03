import { useQuery } from "@tanstack/react-query";
import {LikeBotao} from "./likebotao";
import { Svgs } from "../../assets/assets";
import { Comentarios } from "../Comentario/Comentarios";
import type { Post, Props } from "./interface";
import { FetchPostById } from "../backend/Get";

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => FetchPostById(postId),
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="gap-5 flex flex-col items-center mb-10">
      <h2 className="text-6xl font-bold text-center p-5 pt-0 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-10">
        {data?.titulo}
      </h2>
   
        <img
          src={data?.image_url ? data.image_url : Svgs.anarchy}
          alt={data?.titulo}
          className="rounded object-cover max-lg:w-[80%] lg:w-[70%] max-h-[950px] "
        />
         
     
      <p className="text-gray-400 md:text-justify p-10 text-center break-words md:w-[88%] max-md:w-full mb-20 mt-10">{data?.conteudo}</p>
      <p className="text-gray-500 text-sm">
        Postado em: {data?.created_at ? new Date(data.created_at).toLocaleDateString() : "Data desconhecida"}
      </p>

    <LikeBotao postId={postId}/>
    <Comentarios postId={postId}/>
    </div>
  );
};