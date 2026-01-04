import { useState } from "react";
import { Svgs } from "../../../assets/assets";
import { useAuth } from "../../../contexto/auth/useAuth";
import { EnviarPost } from "./EnviarPost";
import { log } from "console";

export const PostHome = () =>{

    const [titulo, setTitulo] = useState<string>("")
    const [conteudo, setConteudo] = useState<string>("")
    const [imageFile, setImageFile] = useState<File | null>(null);
    // const [fileError, setFileError] = useState<string | null>(null);

    const {usuario} = useAuth()
    const fotoPerfil = usuario?.user_metadata.avatar_url
  
    const MutateOptionsBackend = EnviarPost({titulo: "Home", conteudo, imageFile})

    const handleSubmit = (event: React.FormEvent) =>{
        event.preventDefault()
        MutateOptionsBackend.IniciarEnvio()
        if(!MutateOptionsBackend.isError) setConteudo("")
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;


        // if (file.size > 15 * 1024 * 1024) {
        // setFileError("A imagem deve ter no máximo 15MB");
        // event.target.value = "";
        // return;
        // }

       
       setImageFile(file);

    }

    return (
        <div>
            {usuario && ( <form onSubmit={handleSubmit} className="flex flex-col mb-1 p-5 border-gray-500 border-b-[1px]">
                <div className="flex gap-3">
               
                        <img src={fotoPerfil ? usuario.user_metadata.avatar_url : Svgs.user} alt="UsuarioFoto" className={`h-15 w-15 max-sm:h-10 max-sm:w-10 rounded-full object-cover ${ fotoPerfil ?? "invert"}`} />       
                        <textarea
                        value={conteudo}
                        className="
                            md:w-full
                            max-md:w-120
                            max-sm:w-60 min-h-20 pl-3 pt-1 text-2xl resize-none outline-none border-none border bg-transparent focus:ring-0 focus:outline-none scrollbar-hide"
                        placeholder="Escreva um post..."
                        onChange={(e)=>setConteudo(e.target.value)}
                        style={{  overflow: 'hidden' }}
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
                        <label htmlFor="file-upload" className="cursor-pointer inline-block">
                        <img
                        src={Svgs.fotoIcone}
                        alt="fotoicone"
                        className="h-15 max-sm:h-7 invert"
                        />
                        </label>
                        <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only"
                        onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer inline-block">
                        <img src={Svgs.gif} alt="fotoicone" className="h-15 max-sm:h-7 invert" />
                        </label>
                       
                    </div>
                    
                    <button className={`group px-8 sm:py-2.5 sm:my-10 my-5 rounded-lg text-white
                    cursor-pointer active:scale-95 transition duration-300 w-40 max-sm:w-33 max-sm:h-9
                    ${MutateOptionsBackend.bgClass}`}>
                        <p className="relative h-6 overflow-hidden">
                            <span className="block transition-transform duration-300 group-hover:-translate-y-full">{MutateOptionsBackend.bgAviso}</span>
                            <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%]">{MutateOptionsBackend.bgAvisoSecundario}</span>
                        </p>
                    </button>
                </div>
            </form>)}
        </div>
    )
}