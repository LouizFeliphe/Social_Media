import { useParams } from "react-router";
import { FetchPerfil, FetchPerfilPosts } from "../backend/Get";
import { useQuery } from "@tanstack/react-query";
import { Carregamento } from "../Carregamento";
import { Svgs } from "../../assets/assets";
import PostItem from "../Post/postItem";
import { useState } from "react";

export const Perfil = () =>{

    const { userId } = useParams<{ userId: string }>();
    //const navegar = useNavigate()
    //const {usuario} = useAuth()
    const [editar, setEditar] = useState<boolean>(false)

    const {data:Perfil, error, isLoading} = useQuery({queryKey:["perfil",userId], queryFn: ({queryKey})=>{
        const [,usuarioId] = queryKey
        if(usuarioId)
        return FetchPerfil(usuarioId)
    }})

    const {data:PerfilPosts, error:erroPosts, isLoading:isLoadingPosts} = useQuery({queryKey:["perfilPosts",userId], queryFn: ({queryKey})=>{
        const [,usuarioId] = queryKey
        if(usuarioId)
        return FetchPerfilPosts(usuarioId)
    }})

    if(error){
        return (
            <div> Aconteceu um erro ao carregar o usuario</div>
        )
    }
    console.log(PerfilPosts);
    
    return (
        <div className="relative mb-10">
            <img src={Svgs.teste2} className="w-full p-1.5 h-90 object-cover"/>
            <div className="w-full flex pt-3">
                 <div className="flex-1"></div>   
                 <button className="py-3 px-2.5 rounded-lg text-2xl mr-20 text-white border cursor-pointer hover:bg-indigo-800">Editar Perfil</button>
            </div>
            <div className="absolute top-60 left-8 z-10 bg-[#262626] flex justify-center rounded-full border-3 border-black">
                <img src={Svgs.teste} className="h-45 w-45 rounded-full border-4 border-white"/>
                <div className="ml-2 flex flex-col justify-center p-5 gap-3">
                    <span className="text-3xl font-bold">{Perfil?.name}</span>
                    <span className="text-lg italic text-gray-300">@{Perfil?.email}</span>
                    <div className="flex items-center gap-7">
                        <span className="text-lg italic text-gray-300">Brazil-Sp</span>
                        <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-md italic text-gray-300">Criado em:</span>
                            <span className="text-sm italic text-gray-300">{Perfil?.created_at &&new Date(Perfil.created_at).toLocaleString()}</span>
                        </div>
                    </div>   
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="mt-3 ml-12.5 w-[50%]">
                  <p className="text-lg text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem aliquam sunt quae laboriosam dolores libero unde explicabo, necessitatibus est sit reprehenderit enim id porro reiciendis consequatur autem quibusdam quidem non.</p>
                </div>
                <div className="pr-15 font-bold text-xl flex items-center justify-center gap-7">
                    <span className="">0 Seguidores</span>
                    <span className="">0 Seguindo</span>
                </div>
            </div>
            <div className="flex items-center mt-10 justify-between px-10 text-xl transform transition duration-200 hover:-translate-y-2 font-semibold group bg-[#212121]">
                <button className="w-full p-2 cursor-pointer transform transition duration-200 group-hover:-translate-y-2">Posts</button>
                <button className="w-full border-l-4 p-2 border-blue-600 cursor-pointer transform transition duration-200 group-hover:-translate-y-2">Respostas</button>
                <button className="w-full border-l-4 p-2 border-blue-600 cursor-pointer transform transition duration-200 group-hover:-translate-y-2">Media</button>
                <button className="w-full border-l-4 p-2 border-blue-600 cursor-pointer transform transition duration-200 group-hover:-translate-y-2">Likes</button>
            </div>
            {erroPosts ? <div>Erro ao pegar os posts</div>: <div className="flex flex-col gap-7 justify-center items-center mt-10">
            {PerfilPosts?.map((post, key)=>
                <PostItem post={post} key={key}/>
            )}
            </div>}
            {isLoadingPosts ? <Carregamento tamanho="10" texto="Carregando perfil..."/> : <></>}
            {isLoading ? <Carregamento tamanho="10" texto="Carregando perfil..."/> : <></>}
        </div>
    )
}