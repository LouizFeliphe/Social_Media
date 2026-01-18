import { useState } from "react";
import { EnviarPost, FileChange, GifConversor } from "./EnviarPostinterface";
import { Svgs } from "../../../assets/assets";
import { useAuth } from "../../../contexto/auth/useAuth";
import { Carregamento } from "../../Carregamento";
import { useNavigate } from "react-router";

export const PostPagina = () =>{

    const [conteudo, setConteudo] = useState<string>("")
    const [imageFile, setImageFile] = useState<File | null >(null);
    const [titulo,setTitulo] = useState("")
    const navegar = useNavigate()
    
    const {usuario} = useAuth()
    
    const MutateOptionsBackend = EnviarPost()

    const MutateGifToFileBackend = GifConversor(setImageFile)
    
    const handleSubmit = async (event: React.FormEvent) =>{
        event.preventDefault()
        if(MutateOptionsBackend.isPending) return
        try {
            await MutateOptionsBackend.IniciarEnvio({titulo: titulo ? titulo : usuario?.user_metadata.name || "Post", conteudo, imageFile: imageFile, user_id: usuario!.id})
            setConteudo("")
            setImageFile(null)
        }
        catch{
            console.log("Erro ao enviar");   
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = FileChange(event)
        if(!file) return
        setImageFile(file)
    }

    const isVideo = imageFile ? imageFile.type.startsWith("video") ? true : false : false
    

    return (
       <form className="p-10 " onSubmit={(e:React.FormEvent)=>{
        if(usuario?.user_metadata) {handleSubmit(e)}
        else {
            alert("Você precisa estar logado")
            navegar("/")
        }
       }}>
            <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
            <h2 className="text-base/7 font-semibold text-white">Criar Post</h2>
            <p className="mt-1 text-sm/6 text-gray-400">
                Faça um post para causar a anarquia !
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="titulo" className="block text-sm/6 font-medium text-white">
                        Título
                    </label>
                    <div className="mt-2">
                        <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                            <div className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">Título :</div>
                            <input
                                id="titulo"
                                name="titulo"
                                type="text"
                                placeholder="Pensar ou Não Pensar..."
                                className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                                maxLength={20}
                                required
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-full">
                    <label htmlFor="conteudo" className="block text-sm/6 font-medium text-white">
                        Conteúdo
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="conteudo"
                            name="conteudo"
                            rows={7}
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                            defaultValue={''}
                            required
                            onChange={(e) => setConteudo(e.target.value)}
                        />
                    </div>
                    <p className="mt-3 text-sm/6 text-gray-400">Escreva ali em cima.</p>
                </div>

                <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-white">
                        Inserir arquivo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                        <div className="text-center">
                            {imageFile ? <></> : (<img src={Svgs.fotoIcone} alt="fotoIcone" className="invert h-15 w-15 mx-auto" />)}
                            {!MutateOptionsBackend.isPending && imageFile ? isVideo ? (<video src={imageFile && URL.createObjectURL(imageFile)} 
                            className={`${imageFile ? "h-30 object-cover" : "invert h-15 w-15"}  mx-auto`} controls/>): !MutateGifToFileBackend.isPending ? (<img src={imageFile ? URL.createObjectURL(imageFile) : Svgs.correto} alt="fotoIcone" className={`${imageFile ? "h-30 object-cover" : "invert h-15 w-15"}  mx-auto`} />) : <Carregamento tamanho="8" texto="Carregando Gifs..."/> : (<></>)}
                            {MutateOptionsBackend.isPending && <Carregamento tamanho="8" texto="Carregando..." />}

                            <div className="mt-4 flex text-sm/6 text-gray-400">

                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
                                >
                                    <span className="underline">Envie um arquivo</span>
                                    <input id="file-upload" name="file-upload" type="file" accept="video/mp4,image/jpeg,image/jpg,image/png,image/gif" className="sr-only"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="pl-1">clicando <span className="font-semibold text-indigo-400">lá</span> 👈 !</p>
                            </div>
                            <p className="text-xs/5 text-gray-400">MP4, PNG, GIF, JPG ou JPEG são ideais</p>
                        </div>
                    </div>
                    <button className={`group px-8 py-2.5 my-10 rounded-lg text-white
cursor-pointer active:scale-95 transition duration-300
mx-auto w-full ${MutateOptionsBackend.bgClass}`}>
                        <p className="relative h-6 overflow-hidden">
                            <span className="block transition-transform duration-300 group-hover:-translate-y-full">{MutateOptionsBackend.bgAviso}</span>
                            <span className="absolute w-full top-full left-1/2 -translate-x-1/2 block transition-transform duration-300 group-hover:translate-y-[-100%]">{MutateOptionsBackend.bgAvisoSecundario}</span>
                        </p>
                    </button>
                </div>
            </div>
        </div>
            </div>
        </form>
    )
}