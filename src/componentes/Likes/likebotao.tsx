import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexto/auth/useAuth";
import { Svgs } from "../../assets/assets";
import type { Props } from "../Post/interface";
import { FetchVotes } from "../backend/Get";
import { Vote } from "../backend/Post";
import type { Like } from "./interface";

export const LikeBotao = ({ postId, isHome }: Props) => {

  const { usuario } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: like_s,
    isLoading,
    error,
  } = useQuery<Like[], Error>({
    queryKey: ["likes", postId],
    queryFn: ({queryKey}) => {
     const [, idPost] = queryKey 
     return FetchVotes(idPost as number)
    },
    refetchInterval: 10000,
  });

  const { mutate, error: errorMutate } = useMutation({
    mutationFn: (likeValue: number) => {
      if (!usuario?.user_metadata ) {
        alert("Você deve estar logado")
        throw new Error("usuario nao encontrado");
      } 
      return Vote(likeValue, postId, usuario.id);
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
  
  

  if(isHome){

    if(userVote && userVote !== -1){
      return (
        <button onClick={() => {
        mutate(-1)
      }}className={`px-5 py-2 rounded-lg 
          cursor-pointer active:scale-95 bg-[#3d494f] hover:bg-[#333D42]
          `}>
            <span className="flex items-center gap-3">{`${likes}`}<img src={Svgs.like} alt="Like" className="h-4" /></span>
        </button>
      )
    }
    
    return (
      <button onClick={() => {
        mutate(1)
      }}className={`group px-5 py-2 rounded-lg 
          cursor-pointer active:scale-95 transition-all duration-300 bg-[#3d494f] hover:bg-[#333D42]
          `}>
          <p className="relative overflow-hidden">
            <span className="block transition-transform duration-300 group-hover:-translate-y-full flex items-center gap-3">{`${likes}`}<img src={Svgs.like} alt="Like" className={`h-4 ${userVote && userVote !== -1? "" : "invert"}`} /></span>
            <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%] flex items-center gap-3">{`${likes !== undefined ? userVote && userVote !== -1 ? likes : likes + 1 : likes} `}<img src={Svgs.like} alt="Like" className={`h-4 ${userVote && userVote !== -1 ? "invert" : ""}`} /></span>
          </p>
        </button>
    )
  }

  return (
    <div className="flex flex-col items-center space-x-4 gap-4 my-4">
      <div className="flex items-center gap-10">
       <button type="button" onClick={() => mutate(1)}className={` ${userVote === 1 ? "bg-[#700dbf]" : "bg-[#AD46FF]"} text-white active:scale-95 transition text-sm flex items-center px-4 py-2 gap-2 rounded w-max border border-gray-500/30 transition-colors duration-150`}>
       <img src={Svgs.coracao} alt="like" className={`h-4 ${userVote === 1 ? "" : "invert"}`}/>
                {likes}
      </button>  
       <button type="button" onClick={() => mutate(-1)} className={` ${userVote === -1 ? "bg-[#700dbf]" : "bg-[#AD46FF]"} text-white active:scale-95 transition text-sm flex items-center px-4 py-2 gap-2 rounded w-max border border-gray-500/30 transition-colors duration-150`}>
       <img src={Svgs.coracaoQuebrado} alt="like" className={`h-4 ${userVote === -1 ? "" : "invert"}`}/>
                {dislikes}
        </button>
      </div>
      {(errorMutate || error) && <div className="mx-auto text-red-400">Resposta não registrada <br/></div>}
    </div>
  );
};

