export const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
            <div className="text-[10rem] select-none mb-4">🚫</div>
            <div className="flex flex-col items-center justify-center text-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-green-800 font-bold mt-6">Acceso no permitido</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-4">No tienes permiso para acceder a esta sección del invernadero.</p>
            </div>
        </div>
    )
}
