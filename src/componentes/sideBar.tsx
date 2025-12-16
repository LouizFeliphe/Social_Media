import { Svgs } from "../assets/assets"
import type { ReactNode } from "react";


// const SideBar = () =>{
//     return (
//         <aside className="h-screen">
//             <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                 <div className="p-4 pb-2 flex justify-between items-center">
//                     <img src={Svgs.simboloMenu} alt="logo" className="h-15 w-20"/>
//                     <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
//                         <img src={Svgs.menu} alt="fechar" className="h-5 w-20"/>
//                     </button>
//                 </div>
//             </nav>
//         </aside>
//     )
// }

export const SideBar = ({children}:{
  children: ReactNode;
}) => {
    return (
        <aside className="max-w-64 h-full">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img src={Svgs.simboloMenu} alt="logo" className="h-15" />
                    <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                        <img src={Svgs.menu} alt="menu" className="h-5 w-5" />
                    </button>
                </div>

                <ul className="flex-1 px-3">{children}</ul>

                <div className="border-t flex p-3">
                    <img src={Svgs.menu} alt="item" className="h-10 rounded-md" />
                    <div className={`flex justify-between items-center w-52 ml-3`}>

                    <div>
                        <h4 className="font-semibold text-gray-600">John Doe</h4>
                        <span className="text-xs text-gray-600">johdowe@gmail.com</span>
                    </div>
                </div>
                </div>
                
            </nav>
        </aside>
    )
}

export const SidebarItem = ({icon, text}:{
  icon: string;
  text: string;
}) => {
    return (
        <li>
            <img src={icon} alt="icone" className="h-5" />
            <span>{text}</span>
        </li>
    )
}


