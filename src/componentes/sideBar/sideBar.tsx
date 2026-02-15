import { type ReactNode } from "react";
import { Svgs } from "../../assets/assets";
import { useSidebar } from "../../contexto/sideBar/useSideBar";
import { useAuth } from "../../contexto/auth/useAuth";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FetchPerfil } from "../backend/Get";
import { Carregamento } from "../Carregamento";
import type { Perfil } from "../Perfil/interface";


export const SideBar = ({ children }: {
    children?: ReactNode;
}) => {

    const { expandir, toggle } = useSidebar()
    const { usuario } = useAuth()
    
    const { data: Perfil, error, isLoading: isLoadingPerfil } = useQuery({
        queryKey: ["perfil", usuario?.id  || ""], queryFn: ({ queryKey }) => {
            const [, usuarioId] = queryKey
            if (usuarioId)
                return FetchPerfil(usuarioId)
            return {} as Perfil
        }
    })

    const mostrarNome = Perfil?.name
    const mostrarEmail = Perfil?.email
    const fotoPerfil = Perfil?.avatar_url
    
    

    return (
        <>

            {expandir && (
                <div
                    className="
          max-lg:fixed inset-0 max-lg:bg-black/60 z-40
          transition-opacity duration-300
        "
                    onClick={() => toggle()}
                />
            )}
            
            <aside className={`
            lg:block
            max-lg:fixed
            max-lg:h-[calc(100vh-4rem)]
            max-lg:w-80
            max-lg:top-16
            max-lg:right-0
            max-lg:z-50
            transition-all 
            duration-200
            ${expandir ? "max-lg:translate-x-0" : "max-lg:translate-x-full"}
            `}>
                <nav className="h-full max-sm:h-[70%] flex flex-col bg-[#0E1113] lg:border-r max-lg:border-l max-lg:border-t max-sm:border-b shadow-sm gap-3">
                    <div className="p-4 pb-2 flex justify-between items-center max-md:hidden">
                        <h2 className={`text-xl overflow-hidden transition-all duration-500 ${expandir ? "text-xl ml-3" : "w-0"}`}>Opções</h2>
                        <button className="p-1.5 mr-3.5 rounded-lg bg-gray-50 hover:bg-gray-100" onClick={() => toggle()}>
                            {expandir ? <img src={Svgs.xFechar} alt="menu" className="h-5 w-5" /> : <img src={Svgs.menu} alt="menu" className="h-5 w-5" />}
                        </button>
                    </div>

                    <ul className="flex-1 px-3">{children}</ul>

                    {isLoadingPerfil ? <Carregamento tamanho="10" texto=""/> : error ? <span className="text-red-600 mx-auto pb-5">Erro</span>: <div className="border-t flex p-3 mx-auto">
                    
                        
                        {usuario?.id ? <Link to={`/perfil/${usuario.id}`} className="cursor-pointer"><img src={fotoPerfil ?? undefined} alt="item" className="h-10 w-10 rounded-full object-cover"/></Link> : <Link to={"/signin"}><img src={Svgs.user} alt="item" className="h-10 w-10 rounded-full object-cover invert"/></Link>}
                        <div className={`flex justify-between items-center overflow-hidden transition-all duration-700 ${expandir ? "w-52 ml-3" : "w-0"}`}>

                            { mostrarNome ? 
                            <>
                            <div>
                                <h4 className="font-semibold text-white">{mostrarNome}</h4>
                                <span className="text-xs text-white">{mostrarEmail}</span>
                            </div>
                            </>
                            : <Link to={"/signin"} className="cursor-pointer" ><h4 className="font-semibold text-white">Desconhecido</h4><span className="text-xs text-white">Log-in</span></Link>}
                        </div>
                    </div>}

                </nav>
            </aside>
        </>
    )
}




