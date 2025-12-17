import { Svgs } from "../assets/assets"
import { useState, type ReactNode } from "react";
import { sideBarContext } from "../contexto/sideBarContext";

export const SideBar = ({ children }: {
    children?: ReactNode;

}) => {

    const [expandir, setExpandir] = useState(false)

    return (
        <aside className={`max-w-64 h-full hidden lg:block `}>
            <nav className="h-full flex flex-col bg-[#0E1113] border-r shadow-sm gap-3">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <h2 className={`text-xl overflow-hidden transition-all ${expandir ? "text-xl ml-3" : "w-0"}`}>Opções</h2>
                    <button className="p-1.5 mr-3.5 rounded-lg bg-gray-50 hover:bg-gray-100" onClick={() => setExpandir(prev => !prev)}>
                        {expandir ? <img src={Svgs.xFechar} alt="menu" className="h-5 w-5" /> : <img src={Svgs.menu} alt="menu" className="h-5 w-5" />}
                    </button>
                </div>
                <sideBarContext.Provider value={{ expandir }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </sideBarContext.Provider>


                <div className="border-t flex p-3 mx-auto">
                    <img src={Svgs.menu} alt="item" className="h-10 rounded-md invert" />
                    <div className={`flex justify-between items-center overflow-hidden transition-all ${expandir ? "w-52 ml-3" : "w-0"}`}>

                        <div>
                            <h4 className="font-semibold text-white">John Doe</h4>
                            <span className="text-xs text-white">johdowe@gmail.com</span>
                        </div>

                        <img src={Svgs.mais} alt="mais" className="h-9 invert cursor-pointer" />
                    </div>
                </div>

            </nav>
        </aside>
    )
}




