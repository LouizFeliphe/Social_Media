import { useQuery } from "@tanstack/react-query"
import PostItem from "./postItem"
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
        <div className="flex flex-wrap gap-6 justify-center">
            {data?.map((post, key)=>
                <PostItem post={post} key={key}/>
            )}
        </div>
    )
}

export default PostList