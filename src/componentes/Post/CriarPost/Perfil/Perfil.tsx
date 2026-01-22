import { useParams } from "react-router";
import { FetchPerfil} from "../../../backend/Get";
import { useQuery } from "@tanstack/react-query";
import { Carregamento } from "../../../Carregamento";
import { Svgs } from "../../../../assets/assets";
import { useState } from "react";
import { EditarPerfil } from "./EditarPerfil";
import PostList from "../../PostList";
import { Media } from "./media";
import { LikesPerfil } from "./likesPerfil";
import { useAuth } from "../../../../contexto/auth/useAuth";

export const Perfil = () => {

    const { userId } = useParams<{ userId: string }>();
    const [editar, setEditar] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState("Posts")
    const {usuario} = useAuth()

    const { data: Perfil, error, isLoading: isLoadingPerfil } = useQuery({
        queryKey: ["perfil", userId], queryFn: ({ queryKey }) => {
            const [, usuarioId] = queryKey
            if (usuarioId)
                return FetchPerfil(usuarioId)
        }
    })

    if (error) {
        return (
            <div> Aconteceu um erro ao carregar o usuario</div>
        )
    }
    if (isLoadingPerfil) {
        return <div>
            <Carregamento tamanho="10" texto="Carregando perfil..." />
        </div>
    }
    const tabs = [
        "Posts",
        "Replies",
        "Media",
        "Likes",
    ]

    return (
        <div className="relative mb-25">
            {editar && <EditarPerfil onEditar={() => {
                setEditar(false)
            }} Perfil={Perfil} />}
            <img src={Perfil?.background ?? Svgs.anarchy} alt="cover" className="w-full p-1.5 h-90 object-cover" />
            <div className="w-full flex pt-3 mb-5">
                <div className="flex-1"></div>
                
                {usuario?.id === userId ? <button onClick={() => setEditar((prev) => !prev)} className="py-3 px-2.5 rounded-lg sm:text-2xl text-xl sm:mr-20 mr-5 text-white border cursor-pointer hover:bg-indigo-800">Editar Perfil</button> : <div className="mt-13"></div>}
            </div>
            <div className="absolute sm:top-50 sm:left-8 top-70 left-3 z-10 bg-[#262626] flex justify-center rounded-full border-3 border-black">
                <img src={Perfil?.avatar_url ?? Svgs.user} className="sm:h-55 sm:w-55 h-35 w-35 rounded-full border-4 border-white" />
            </div>
            <div className="sm:ml-2 flex flex-col justify-center sm:pl-10 pl-3 gap-5">
                <span className="text-3xl font-bold">{Perfil?.name}</span>
                <div className="flex items-center gap-2">
                    <img src={Svgs.email} className="h-5 invert" alt="local" />
                    <span className="sm:text-lg italic text-gray-300">@{Perfil?.email}</span>
                </div>
                <div className="flex items-center gap-5 pr-5">
                    <div className="flex items-center gap-2">
                        <img src={Svgs.local} className="h-5 invert" alt="local" />
                        <span className="text-md italic text-gray-300">{Perfil?.location || "Desconhecido"}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <img src={Svgs.calendar} className="h-5 invert" alt="local" />
                        <span className="text-md italic text-gray-300">Criado em:</span>
                        <span className="text-sm italic text-gray-300">{Perfil?.created_at && new Date(Perfil.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between max-sm:flex-col sm:items-center gap-5">
                <div className="mt-5 sm:ml-12.5 max-sm:ml-3 w-[50%] max-sm:w-[75%]">
                    <p className="text-lg text-left">{Perfil?.about}</p>
                </div>
                <div className="sm:pr-15 max-sm:pl-3 font-bold text-xl max-sm:text-md flex items-center sm:justify-center gap-7">
                    <span className="">0 Seguidores</span>
                    <span className="">0 Seguindo</span>
                </div>
            </div>
            <div className="border-b border-zinc-800 mt-10">
                <div className="flex justify-around text-xl font-semibold text-zinc-500">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="relative py-4 px-2 transition-colors hover:bg-zinc-900 cursor-pointer"
                        >
                            <span
                                className={
                                    activeTab === tab
                                        ? "text-white"
                                        : "hover:text-zinc-300"
                                }
                            >
                                {tab}
                            </span>

                            {activeTab === tab && (
                                <span className="absolute left-1/2 -bottom-px h-1 w-10 -translate-x-1/2 rounded-full bg-indigo-600" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
            
            {activeTab === "Likes" &&  <LikesPerfil user_id={userId || ""}/>}

            {activeTab === "Media" &&  <Media user_id={userId || ""}/>}


            {activeTab === "Replies" &&  <div>Ola</div>}


            {activeTab === "Posts" && <PostList user_id={userId} isPostUser={true}/>}

        </div>
    )
}