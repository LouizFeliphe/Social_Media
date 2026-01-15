import { useParams } from "react-router";
import { Svgs } from "../../assets/assets"


export const ConfirmarEmail = () => {

    const { email } = useParams<{ email: string }>();

    return (
        <div className="flex flex-col items-center justify-center h-[70%] text-lg p-3">
            <div className="flex flex-col items-center justify-center gap-3 bg-gray-800 rounded-md p-5 border">
            <span>Um link foi enviado ao seu email <span className="text-purple-500 sm:text-2xl">{email && email } </span>! </span>
            <span>Para logar no site, é necessário que confirme o link.</span>
            <img src={Svgs.email} alt="fotoIcone" className="invert h-15 w-15 mx-auto" />
            </div>
        </div>
    )
}