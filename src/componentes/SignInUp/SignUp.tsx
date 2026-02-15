import { useState } from "react"
import { useAuth } from "../../contexto/auth/useAuth"
import { useNavigate } from "react-router"
import { Carregamento } from "../Carregamento"


export const SignUp = () => {

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [nome, setNome] = useState("")
    const [erro, setErro] = useState("")
    const [loading,setLoading] = useState(false)
   
    const navegar = useNavigate()
    const {signUp, usuario} = useAuth()

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
         if(usuario?.user_metadata){
            alert("Você já está logado")
            navegar("/")
            return 
        }
        setLoading(true)
        try{
            const cadastro = await signUp(email,senha,nome)
            navegar(`/email_confirmar/${(cadastro.user?.email)?.toString()}`)
        } catch(erro){
            console.log(erro);
            setErro("Erro ao cadastrar, tente novamente")
        }finally{
            setLoading(false)
        }
        
    }

    return (
        <div className="flex flex-col justify-center w-full sm:max-w-90 max-sm:w-full max-sm:h-screen rounded-xl px-6 py-8 border border-slate-700 bg-slate-900 text-white text-sm mx-auto sm:mt-7 sm:mb-10">
            <div className="flex items-center gap-10">
                <div> <h2 className="text-2xl font-semibold">SignUP</h2>
            <p className="text-slate-300 mt-1">Cadastre sua conta</p></div>
            </div>
            
            <form className="mt-8" onSubmit={handleSubmit}>
                <label htmlFor="email" className="block mb-1 font-medium text-slate-300">Email</label>
                <input type="email" id="email" name="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Email@gmail.com" className="w-full p-2 mb-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" />

                <label htmlFor="password" className="block mb-1 font-medium text-slate-300">Senha</label>
                <input type="password" id="password" name="password" placeholder="Senha com 8 digitos..." 
                onChange={(e)=>setSenha(e.target.value)}className="w-full p-2 mb-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" />
                <label htmlFor="nome" className="block mb-1 font-medium text-slate-300">Nome</label>
                <input type="nome" id="nome" maxLength={12}name="nome" onChange={(e)=>setNome(e.target.value)} placeholder="Nome de usuário" className="w-full p-2 mb-3 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500" />
                {loading ? (<Carregamento tamanho="10" texto="Cadastrando..."/>) : (<button type="submit" className="w-full mt-10 px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Cadastrar-se</button>)}
                {erro && (<span className="text-red-600 text-md">{erro}</span>)}
            </form>
        </div>
    )
}