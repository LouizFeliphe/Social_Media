import { useQuery } from "@tanstack/react-query"
import PostItem from "./postItem.tsx"
import { FetchPosts } from "../backend/Get"
import type { Post } from "./interface"

const PostList = () =>{

    const {data, error, isLoading} = useQuery<Post[]>({
        queryKey: ["posts"],
        queryFn: FetchPosts,
    })

    if(isLoading) return <div>loading...</div>

    if(error){
        return <div>Error: {error.message}</div>
    }

    return (
        <div className="flex flex-col gap-7 justify-center items-center mt-5">
            {data?.map((post, key)=>
                <PostItem post={post} key={key}/>
            )}
        </div>
    )
}

export default PostList