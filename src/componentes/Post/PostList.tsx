import { useQuery } from "@tanstack/react-query"
import { supabase } from "../../supabase"
import PostItem from "./postItem"


export interface Post{
    id: number,
    titulo: string,
    conteudo: string,
    created_at: string,
    image_url: string,
    avatar_url: string,

}


const fetchPosts = async (): Promise<Post[]> =>{
    const {data,error} = await supabase.from("posts").select("*").order("created_at",{ascending: false})

    if (error) throw new Error(error.message)
    

    return data
}

const PostList = () =>{

    const {data, error, isLoading} = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    })

    if(isLoading) return <div>loading...</div>

    if(error){
        return <div>Error: {error.message}</div>
    }

    console.log(data);
    

    return (
        <div className="flex flex-wrap gap-6 justify-center">
            {data?.map((post, key)=>
                <PostItem post={post} key={key}/>
            )}
        </div>
    )
}

export default PostList