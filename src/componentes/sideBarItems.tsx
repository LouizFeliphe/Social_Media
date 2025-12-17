import { NavLink } from "react-router";
import { useSidebar } from "../contexto/sideBar/useSideBar";


export const SidebarItem = ({ icon, text, link, alert, }: {
    icon: string
    text: string
    link: string
    alert?: boolean
}) => {

    const {expandir} = useSidebar()

    return (
        <li className="W-full py-2  px-3 my-1 font-medium rounded-md cursor-pointer">
            <NavLink
                to={link}
                className={({ isActive }) =>
                    `
            w-full h-10 relative flex items-center p-4 transition-colors rounded-md
            ${isActive
                        ? "bg-[#2A3236] text-white"
                        : "hover:bg-[#181C1F] text-gray-500"
                    }
            `
                }
            >
                <img src={icon} alt="icone" className="h-4 w-4 shrink-0 invert" />

                <span
                    className={`overflow-hidden transition-all duration-100 ${expandir ? "w-52 ml-3" : "w-0"
                        }`}
                >
                    {text}
                </span>

                {alert && (
                    <div
                        className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expandir ? "" : "top-2"
                            }`}
                    />
                )}
            </NavLink>
        </li>
    )
}

