
export const Carregamento = ({ tamanho, texto}: {
    tamanho: string
    texto:string
}) => {
    return (
        <div>
            <div className=" p-6 rounded-lg flex flex-col items-center gap-3">
                <span className={`animate-spin ${"h-" + tamanho} ${"w-" + tamanho} border-4 border-gray-300 border-t-blue-600 rounded-full`}></span>
                <p>{texto}</p>
            </div>
        </div>
    )
}