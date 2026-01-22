import { useQuery } from "@tanstack/react-query"
import type { Post } from "../../interface"
import { FetchPerfilPosts } from "../../../backend/Get"
import { Carregamento } from "../../../Carregamento"
import { Svgs } from "../../../../assets/assets"

export const Media = ({ user_id }: {
    user_id: string
}) => {

    const { data, error, isLoading } = useQuery<Post[]>({
        queryKey: ["media", user_id],
        queryFn: ({ queryKey }) => {
            const [, userId] = queryKey
            if (userId) return FetchPerfilPosts(userId as string)
            return [] as Post[]
        },
    })

   if (isLoading) return <div className="mt-10">
           <Carregamento tamanho="10" texto=""/>
       </div>


     if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar medias</div>
    }

    return (
        <>
        { data?.length !== 0 ?
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 p-5">
            {data?.map((post, key) => (
                
                post.image_url && (<div key={key} className="mt-5">
                    {post.image_url.endsWith("mp4") ?
                    (
                        <video
                            src={post.image_url}
                            className="w-full h-50 object-cover rounded-md"
                            controls
                        />
                    ) : (
                        <img
                            src={post.image_url}
                            alt="imagem"
                            className="w-full h-50  object-cover rounded-md"
                        />
                    )}
                </div>)
            ))}
        </div> :  
        <div className="flex flex-col items-center justify-center pt-20 gap-3">
            <img src={Svgs.fotoIcone} alt="post" className="h-16 invert" />
            <span className="text-lg italic">Nenhuma media encontrada</span>
        </div>}
        </>

    )
}