import { useState } from "react"
import { Svgs } from "../assets/assets"
import { EnviarPost } from "../componentes/Post/CriarPost/EnviarPost"

const CriarPost = () => {
    const [titulo, setTitulo] = useState<string>("")
    const [conteudo, setConteudo] = useState<string>("")
    const [imageFile, setImageFile] = useState<File | null>(null);
   
    const MutateOptionsBackend = EnviarPost({titulo, conteudo, imageFile})

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
        <form className="p-10 " onSubmit={handleSubmit}>
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
                                    <img src={imageFile ? URL.createObjectURL(imageFile) : Svgs.fotoIcone} alt="fotoIcone" className={`${imageFile ? "h-30 object-cover" : "invert h-15 w-15"}  mx-auto`} />

                                    <div className="mt-4 flex text-sm/6 text-gray-400">

                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
                                        >
                                            <span className="underline">Envie um arquivo</span>
                                            <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only"
                                            onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">clicando <span className="font-semibold text-indigo-400">lá</span> 👈 !</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-400">PNG, JPG ou JPEG são ideais</p>
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

export default CriarPost