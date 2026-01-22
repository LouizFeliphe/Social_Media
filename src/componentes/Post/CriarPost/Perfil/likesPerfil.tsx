import { useQuery } from "@tanstack/react-query"
import { fecthVotesPerfil} from "../../../backend/Get"
import type { LikePerfil } from "../../../Likes/interface"
import PostItem from "../../postItem"
import type { Post } from "../../interface"
import { Carregamento } from "../../../Carregamento"
import { Svgs } from "../../../../assets/assets"

export const LikesPerfil = ({user_id}:{
    user_id: string
}) =>{

    const { data:Likes, error, isLoading } = useQuery<LikePerfil[]>({
        queryKey: ["likesPerfil", user_id],
        queryFn: ({ queryKey }) => {
            const [, userId] = queryKey
            if (userId) return fecthVotesPerfil(userId as string)
            return [] as LikePerfil[]
        },
    })    
    
    const LikesFiltrados = Likes ? Likes?.filter((v) => v.vote === 1) : []

    if (isLoading) return <div className="mt-10">
        <Carregamento tamanho="10" texto=""/>
    </div>

    if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar Likes</div>
    }


    return (
        <>
        {LikesFiltrados.length !== 0 ? <div className="flex flex-col gap-7 justify-center items-center mt-5">
           {LikesFiltrados?.map((post,key)=>
            <PostItem post={post.posts as unknown as Post} key={key}/>
           )}
        </div> : 
         <div className="flex flex-col items-center justify-center pt-20 gap-3">
            <img src={Svgs.like} alt="post" className="h-16 invert" />
            <span className="text-lg italic">Nenhum like encontrado</span>
        </div>}
        </>
    )
}