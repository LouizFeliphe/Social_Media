import { useEffect, useRef, useState } from "react";
import { Svgs } from "../../assets/assets";
import { useMutation, 
// useQueryClient 
} from "@tanstack/react-query";
import { EnviarMensagem } from "../backend/Post";
import { useAuth } from "../../contexto/auth/useAuth";
import { Carregamento } from "../Carregamento";
import type { Mensagem } from "./interface";
import { useScroll } from "../../contexto/scroll/useScroll";



export const Mensagens = ({ mensagens, chatID }: {
    mensagens: Mensagem[],
    chatID: string,
}) => {
    const { usuario, rastrearDigitacao, usuariosDigitando } = useAuth()
    const [texto, setTexto] = useState("")
    // const useQuery = useQueryClient()
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const [showScrollDown, setShowScrollDown] = useState(false)
    const { scrollRef } = useScroll()
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
    const [erroMensagem, setErroMensagem] = useState<string | null>(null)
    const isDigitandoRef = useRef(false)
    const digitandoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const el = scrollRef?.current
        if (!el) return

        const handleScroll = () => {
            const scrollPosition = el.scrollTop + el.clientHeight
            const pageHeight = el.scrollHeight

            const isAtBottom = pageHeight - scrollPosition < 50
            setShowScrollDown(!isAtBottom)
        }

        el.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => el.removeEventListener("scroll", handleScroll)
    }, [scrollRef])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" })
    }, [mensagens])

    useEffect(() => {
        if (!erroMensagem) return

        const timer = setTimeout(() => setErroMensagem(null), 4000)
        return () => clearTimeout(timer)
    }, [erroMensagem])


    const { mutate, isPending } = useMutation({
        mutationFn: (data: {
            chatId: string,
            senderId: string,
            conteudo: string
        }) => {
            return EnviarMensagem(data.chatId, data.senderId, data.conteudo)
        }, onSuccess: () => {
            setTexto("")
            // useQuery.invalidateQueries({ queryKey: ["messages"] })
        }, onError: () => {
            setErroMensagem("Erro ao enviar a mensagem. Tente novamente.")
        },
    })

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        if (!texto) return
        if (usuario?.user_metadata) mutate({ chatId: chatID, senderId: usuario?.id, conteudo: texto })
    }

    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTexto(e.target.value)
        e.target.style.height = "auto"
        e.target.style.height = `${e.target.scrollHeight}px`

        if(!isDigitandoRef.current){
            await rastrearDigitacao(chatID, true)
            isDigitandoRef.current = true
        }

        if(digitandoTimeoutRef.current) clearTimeout(digitandoTimeoutRef.current)
        
        digitandoTimeoutRef.current = setTimeout(async ()=>{
            if(!isDigitandoRef.current) return
            await rastrearDigitacao(chatID, false)
            isDigitandoRef.current = false
        },2000)
    }

    const PessoasDigitando = usuariosDigitando.filter((u) => u.chatId === chatID && u.userId !== usuario?.id)

    return (
        <>
            <div className="flex flex-col gap-2 sm:px-7 sm:p-6 max-sm:mb-4">
                {mensagens.map(message => {
                    const isMine = message.sender_id === usuario?.id
                    const isExpanded = !!expandedMap[message.id]

                    return (
                        <div key={message.id} className="max-sm:px-2">
                            <div
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`
                
                max-w-[75%]
                rounded-2xl
                px-4 py-2
                sm:text-lg
                break-words
                ${isExpanded ? "" : "line-clamp-5"}
                ${isMine
                                            ? "bg-blue-500 text-white rounded-br-sm"
                                            : "bg-zinc-200 text-zinc-900 rounded-bl-sm"}
              `}
                                >
                                    {message.content}
                                </div>
                            </div>
                            {message?.content.length > 250 && <button
                                onClick={() => setExpandedMap(prev => ({ ...prev, [message.id]: !isExpanded }))}
                                className={`text-md font-semibold text-indigo-400 hover:underline cursor-pointer w-full flex pr-5 `}
                            >
                                {isMine ? (<><div className="flex-1"></div>
                                {isExpanded ? "Ler menos" : "Ler mais"}</>) : (<>
                                {isExpanded ? "Ler menos" : "Ler mais"}
                                <div className="flex-1"></div>
                                </>)}
                            </button>}
                        </div>
                    )
                })}
            </div>

            {erroMensagem && (
                <div className="px-4 pb-2 text-sm text-red-500">
                    {erroMensagem}
                </div>
            )}


            <div className="sm:p-5 max-sm:mb-2">
                {PessoasDigitando.length > 0 && (
                    <span className="m-0 text-sm max-sm:pl-3 text-white">
                        {PessoasDigitando.length === 1 || PessoasDigitando.length === 2
                            ? "Digitando..."
                            : `${PessoasDigitando.length} Pessoas estão digitando...`}
                    </span>
                )}
                <div className="w-full bg-[#202327] flex items-center justify-between sm:rounded-xl mt-5">
                    <textarea
                        value={texto}
                        onChange={handleChange}
                        rows={1}
                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSubmit(e)
                            }
                        }}
                        placeholder="Digite..."
                        className="
                         w-full
                     resize-none
                     overflow-y-auto
                         rounded-2xl
                         bg-zinc-900
                     px-5 py-4
                    text-white
                    placeholder-gray-400
                        outline-none
                    max-h-70
                    "
                    />
                    <button className="bg-[#202327] rounded-2xl py-2.5 cursor-pointer" onClick={handleSubmit}>{isPending ? <Carregamento tamanho="5" texto="" /> : <img src={Svgs.setaCima} alt="icone" className="h-10 invert" />}</button>
                </div>
            </div>
            {showScrollDown && <button
                onClick={() =>
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="
      fixed
      bottom-25
      right-17
      z-50
      bg-[#343b45]
      text-white
      rounded-full
      p-3
      shadow-lg
      hover:bg-zinc-800
      transition
    "
            >
                <img src={Svgs.setaBaixo} alt="dads" className="h-5 invert" />
            </button>}
            <div ref={bottomRef} />
        </>
    )
}