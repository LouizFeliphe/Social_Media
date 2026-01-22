import { useQuery } from "@tanstack/react-query"
import PostItem from "./postItem.tsx"
import { FetchPerfilPosts, FetchPosts } from "../backend/Get"
import type { Post } from "./interface"
import { Carregamento } from "../Carregamento.tsx"
import { Svgs } from "../../assets/assets.tsx"

const PostList = ({user_id,isPostUser}: {
    user_id?: string
    isPostUser?:boolean
}) =>{

    const {data, error, isLoading} = useQuery<Post[]>({
        queryKey: ["posts", user_id, isPostUser],
        queryFn: ({queryKey}) => {
            const [, userId, isPost_User] = queryKey
            if(isPost_User) {
                if(userId as string) return FetchPerfilPosts(userId as string)
                return [] as Post[]
            }
            return FetchPosts()
        },
    })    

    console.log(data)

     if (isLoading) return <div className="mt-10">
            <Carregamento tamanho="10" texto=""/>
    </div>

    if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar Likes</div>
    }

    return (
        <>
        {data !== undefined && data.length != 0 ? <div className="flex flex-col gap-7 justify-center items-center mt-5">
            {data?.map((post, key)=>
                <PostItem post={post} key={key}/>
            )}
        </div> : 
        <div className="flex flex-col items-center justify-center pt-20">
            <img src={Svgs.post} alt="post" className="h-16 invert" />
            <span className="text-lg italic">Nenhum post encontrado</span>
        </div>}
        </>
    )
}

export default PostList