import { useState } from "react";
import { Link } from "react-router";
import { Svgs } from "../assets/assets";

const NavBar = () => {

    const [menuAberto,setMenuAberto] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to={"/"} className="font-mono text-xl font-bold text-white">
                    Rede <span className="text-purple-500">media</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to={"/"} className="text-gray-300 hover:text-white transition-colors">Home</Link>
                        <Link to={"/criar"} className="text-gray-300 hover:text-white transition-colors">Criar Post</Link>
                        <Link to={"/comunidades"} className="text-gray-300 hover:text-white transition-colors">Comunidades</Link>
                        <Link to={"/comunidade/criar"} className="text-gray-300 hover:text-white transition-colors">Criar comunidade</Link>
                    </div>

                    {/*Mobile menu botao*/}
                    <div className="md:hidden">
                        <button onClick={()=>setMenuAberto((anter)=> !anter)} className="text-gray-300 focus:outline-none" aria-label="Toggle Menu">{
                        menuAberto ?    
                        <img src={Svgs.menu} alt="menu" className="h-6 invert"/> 
                        : 
                        <img src={Svgs.xFechar} alt="fechar" className="h-5 invert my-1" />
                        }
                        </button>
                    </div>


                    {/*Mobile*/}
                    { menuAberto && (
                    <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link to={"/"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Home</Link>
                            <Link to={"/criar"}  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Criar Post</Link>
                            <Link to={"/comunidades"}  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Comunidades</Link>
                            <Link to={"/comunidade/criar"}  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Criar comunidade</Link>
                        </div>
                    </div> )
                    }
                </div>
            </div>
        </nav>
    )

}

export default NavBar;