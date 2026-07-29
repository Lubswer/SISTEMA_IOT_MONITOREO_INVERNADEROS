import { Link } from 'react-router';

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-50">
            <div className="text-[10rem] select-none mb-4">🌵</div>

            <div className="flex flex-col items-center justify-center text-center mt-6">
                <p className="text-3xl md:text-4xl lg:text-5xl text-green-800 font-bold">Página no encontrada</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-4">Esta zona del invernadero no existe</p>
                <Link to="/" className="p-3 m-5 w-full text-center bg-green-700 text-white border rounded-xl hover:scale-110 duration-300 hover:bg-green-900">
                    Regresar al inicio
                </Link>
            </div>
        </div>
    );
};
