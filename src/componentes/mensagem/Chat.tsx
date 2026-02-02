import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { pegarMensagensChat } from "../backend/Get";
import { Carregamento } from "../Carregamento";
import { useAuth } from "../../contexto/auth/useAuth";
import { Svgs } from "../../assets/assets";
import { Mensagens } from "./mensagens";
import { Fragment } from "react/jsx-runtime";

export const Chat = () => {
    const { usuario } = useAuth()
    const { chatId } = useParams<{ chatId: string }>();

    const { data, error, isLoading } = useQuery({
        enabled: !!chatId,
        queryKey: ["messages", chatId],
        queryFn: ({ queryKey }) => {
            const [, chatID] = queryKey
            return pegarMensagensChat(chatID!)
        },
    })

    if (isLoading) return <div className="mt-10">
        <Carregamento tamanho="10" texto="" />
    </div>

    if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar as mensagens</div>
    }
    console.log(data);

    return (
        <div className="p-5 mr-10 sm:border-r-1 sm:border-gray-700">

            {data?.perfils.map((perfil, index) => {
                if (perfil.profile.user_id === usuario?.id) return
                return (
                    <Fragment key={index}>
                        <div key={index} className="fixed bg-black w-[90%] flex items-center gap-4">
                            <img src={Svgs.xFechar} alt="fechar" className="h-10 invert" />
                            <img src={perfil.profile.avatar_url}
                                className="h-15 w-15 object-cover rounded-full 
                        border-1 border-[#232a2e]" alt="ola" />
                            <span className="text-xl font-bold">{perfil.profile.name}</span>
                        </div>
                        <div className=" w-full flex flex-col
                    items-center justify-center h-100 gap-1">
                            <img src={perfil.profile.avatar_url}
                                className="h-20 w-20 object-cover rounded-full 
                        border-1 border-[#232a2e]" alt="ola" />
                            <span className="text-xl font-bold">{perfil.profile.name}</span>
                            <span className="text-xl text-gray-500">{perfil.profile.email}</span>
                            <button className="bg-[#f0f0f0] text-black font-semibold py-2 px-5 rounded-xl cursor-pointer mt-10 text-lg hover:bg-[#e0e0e0]">Ver Perfil</button>
                        </div>
                    </Fragment>)
            })}
            <Mensagens mensagens={data?.mensagens} chatID={chatId} />            
        </div>
    )
}