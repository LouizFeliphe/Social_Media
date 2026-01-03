import { useState } from "react"
import { Svgs } from "../assets/assets"
import PostList from "../componentes/Post/PostList"
import { useAuth } from "../contexto/auth/useAuth"
import { useMutation } from "@tanstack/react-query"
import type { PostInput } from "../componentes/Post/interface"
import { CriarPostBackend } from "../componentes/backend/Post"

const Home = () =>{


    const [titulo, setTitulo] = useState<string>("Titulo")
    const [conteudo, setConteudo] = useState<string>("")
    const [imageFile, setImageFile] = useState<File | null>(null);
    const {usuario} = useAuth()
    const fotoPerfil = usuario?.user_metadata.avatar_url


    const { mutate, isError, isPending, error } = useMutation({ mutationFn: (data: { post: PostInput, imageFile: File | null }) => CriarPostBackend(data.post, data.imageFile), onSuccess: ()=>{
        setConteudo("")
    }})

     

    const HandleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        mutate({ post: { titulo, conteudo, avatar_url: usuario?.user_metadata.avatar_url || null }, imageFile: imageFile })
    }

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];

    //     if (!file) return;


    //     // if (file.size > 15 * 1024 * 1024) {
    //     // setFileError("A imagem deve ter no máximo 15MB");
    //     // event.target.value = "";
    //     // return;
    //     // }

    //     setImageFile(file);

    // }

    const bgClass = isPending
        ? "bg-orange-600 hover:bg-orange-700"
        : isError
            ? "bg-red-600 hover:bg-red-700"
            : "bg-indigo-600 hover:bg-indigo-700";

    const bgAviso = isPending
        ? "Carregando"
        : isError
            ? "Aconteceu um erro"
            : "Enviar";

    const bgAvisoSecundario = isPending
        ? "Carregando..."
        : isError
            ? "Tentar enviar novamente"
            : "Confirmar";

   

    return (
        <div className="bg-[#0E1113] p-5">
            {usuario && ( <form onSubmit={HandleSubmit} className="flex flex-col mb-1 p-5 border-gray-500 border-b-[1px]">
                <div className="flex gap-5 mx-auto">
               
                        <img src={fotoPerfil ? usuario.user_metadata.avatar_url : Svgs.user} alt="UsuarioFoto" className={`h-15 w-15 rounded-full object-cover ${ fotoPerfil ?? "invert"}`} />
              
                      
                                
                                <textarea
                                value={conteudo}
                                    className="lg:w-200 max-lg:120 max-sm:w-60 min-h-20 pl-3 pt-1 text-2xl resize-none outline-none border-none bg-transparent focus:ring-0 focus:outline-none scrollbar-hide"
                                    placeholder="Escreva um post..."
                                    onChange={(e)=>setConteudo(e.target.value)}
                                    style={{ border: 'none', overflow: 'hidden' }}
                                    rows={1}
                                    onInput={e => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = target.scrollHeight + 'px';
                                    }}
                                />
                </div>
                <div className="flex sm:px-20 items-center justify-between ">
                    <div className="flex items-center gap-5 max-sm:gap-3 cursor-pointer">
                        <img src={Svgs.fotoIcone} alt="fotoicone" className="h-15 max-sm:h-7 invert" />
                       <img src={Svgs.gif} alt="fotoicone" className="h-15 max-sm:h-7 invert" />
                    </div>
                    
                    <button className={`group px-8 py-2.5 my-10 rounded-lg text-white
                    cursor-pointer active:scale-95 transition duration-300 w-40 max-sm:w-33
                    ${bgClass}`}>
                                <p className="relative h-6 overflow-hidden">
                                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">{bgAviso}</span>
                                    <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%]">{bgAvisoSecundario}</span>
                                </p>
                    </button>
                </div>
            </form>)}
            <PostList/>
        </div>
    )
}

export default Home