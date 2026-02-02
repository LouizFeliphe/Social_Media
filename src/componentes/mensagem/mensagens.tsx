import { useState } from "react";
import { Svgs } from "../../assets/assets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EnviarMensagem } from "../backend/Post";
import { useAuth } from "../../contexto/auth/useAuth";
import { Carregamento } from "../Carregamento";

export const Mensagens = ({mensagens, chatID}:{
    mensagens: unknown,
    chatID: string,
}) => {
    const {usuario} = useAuth()
    const [texto, setTexto] = useState("")
    const useQuery = useQueryClient()

     const { mutate, error, isPending } = useMutation({
        mutationFn: (data: {
            chatId: string,
            senderId: string,
            conteudo: string
        }) => {
            return EnviarMensagem(data.chatId,data.senderId,data.conteudo)
        },onSuccess:()=>{
            useQuery.invalidateQueries({ queryKey: ["messages"] })
        },
    })

    const handleSubmit = (event: React.FormEvent)=>{
        event.preventDefault()
        if(usuario?.user_metadata) mutate({chatId: chatID, senderId: usuario?.id, conteudo: texto})
    }

    if (isPending) return <div className="mt-10">
            <Carregamento tamanho="10" texto="" />
        </div>
    
    if (error) {
            return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar as mensagens</div>
        }
        
    console.log(mensagens);
    
    return (
        <>
        <div className="bg-red-600">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, nulla quam et delectus pariatur nesciunt exercitationem aliquid quos. Ad voluptatum, totam cum qui modi eos ullam deserunt? Obcaecati, in debitis.</p>
        </div>
         <div className="w-full flex items-center gap-5">
            <button className="bg-[#202327] rounded-xl py-2.5"><img src={Svgs.mais} alt="icone" className="h-12 invert" /></button>
            <div className="w-full bg-[#202327] flex items-center justify-between">
                <input type="text" onChange={(e) => setTexto(e.target.value)}className='py-5 pl-5 rounded-xl  outline-none placeholder-gray-400' placeholder='Digite alguma coisa....' />
                <button className="bg-[#202327] rounded-xl py-2.5 cursor-pointer" onClick={handleSubmit}><img src={Svgs.mais} alt="icone" className="h-12 invert" /></button>
            </div>
        </div>
        </>
    )
}