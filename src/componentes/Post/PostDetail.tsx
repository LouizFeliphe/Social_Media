import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import type { Post } from "./PostList";



interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="gap-7 flex flex-col items-center mb-10">
      <h2 className="text-6xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.titulo}
      </h2>
      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.titulo}
          className="mt-3 rounded object-cover max-lg:w-[90%] lg:w-[80%] h-64"
        />
      )}
      <p className="text-gray-400 md:text-justify p-10 text-center break-words md:w-[88%] max-md:w-full">{data?.conteudo}</p>
      <p className="text-gray-500 text-sm">
        Postado em: {data?.created_at ? new Date(data.created_at).toLocaleDateString() : "Data desconhecida"}
      </p>

    </div>
  );
};