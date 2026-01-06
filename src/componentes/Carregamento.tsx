
export const Carregamento = ({ tamanho }: {
    tamanho: string
}) => {
    return (
        <div>
            <div className=" p-6 rounded-lg flex flex-col items-center gap-3">
                <span className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></span>
                <p>Enviando arquivo...</p>
            </div>
        </div>
    )
}