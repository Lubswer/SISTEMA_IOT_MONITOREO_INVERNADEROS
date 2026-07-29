import Table from "../components/list/Table"

const List = () => {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className='font-black text-2xl text-gray-700'>Listar Cultivos Activos</h1>
                <hr className='my-3 border-t-2 border-gray-300' />
                <p className='text-xs text-slate-500 font-medium'>
                    Visualización en tarjetas de los cultivos que se encuentran actualmente en curso y sin fecha de salida.
                </p>
            </div>
            <Table />
        </div>
    )
}

export default List