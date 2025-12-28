import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import { useAuth } from "../../contexto/auth/useAuth";
import { Svgs } from "../../assets/assets";

interface Props {
  postId: number;
}

interface Like {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (likeValue: number, postId: number, userId: string) => {
  const { data: existingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    // Liked -> 0, Like -> -1
    if (existingLike.vote === likeValue) {
      console.log("entrou");
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("likes")
        .update({ vote: likeValue })
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId, vote: likeValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Like[]> => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Like[];
};

export const LikeBotao = ({ postId }: Props) => {
  const { usuario } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: like_s,
    isLoading,
    error,
  } = useQuery<Like[], Error>({
    queryKey: ["likes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 10000,
  });

  const { mutate, error: errorMutate } = useMutation({
    mutationFn: (likeValue: number) => {
      if (!usuario) throw new Error("You must be logged in to Vote!");
      return vote(likeValue, postId, usuario.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  if (isLoading) {
    return <div> Loading likes...</div>;
  }

  const likes = like_s?.filter((v) => v.vote === 1).length || 0;
  const dislikes = like_s?.filter((v) => v.vote === -1).length || 0;
  const userVote = like_s?.find((v) => v.user_id === usuario?.id)?.vote;

  return (
    <div className="flex items-center space-x-4 my-4">
       <button type="button" onClick={() => mutate(1)}className={` ${userVote === 1 ? "bg-[#700dbf]" : "bg-[#AD46FF]"} text-white active:scale-95 transition text-sm flex items-center px-4 py-2 gap-2 rounded w-max border border-gray-500/30 transition-colors duration-150`}>
       <img src={Svgs.coracao} alt="like" className={`h-4 ${userVote === 1 ? "" : "invert"}`}/>
                {likes}
      </button>  
       <button type="button" onClick={() => mutate(-1)} className={` ${userVote === -1 ? "bg-[#700dbf]" : "bg-[#AD46FF]"} text-white active:scale-95 transition text-sm flex items-center px-4 py-2 gap-2 rounded w-max border border-gray-500/30 transition-colors duration-150`}>
       <img src={Svgs.coracaoQuebrado} alt="like" className={`h-4 ${userVote === -1 ? "" : "invert"}`}/>
                {dislikes}
        </button>
      {(errorMutate || error) && <div className="mx-auto">Resposta não registrada <br/><span className="text-red-400">erro de server</span></div>}
    </div>
  );
};