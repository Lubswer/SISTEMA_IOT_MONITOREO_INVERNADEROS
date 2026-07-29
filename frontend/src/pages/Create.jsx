import { Form } from '../components/create/Form'

const Create = () => {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className='font-black text-2xl text-gray-700'>Registrar Nuevo Cultivo</h1>
                <hr className='my-3 border-t-2 border-gray-300' />
                <p className='text-xs text-slate-500 font-medium'>
                    Ingresa los detalles de tu cultivo para iniciar el monitoreo en tiempo real.
                </p>
            </div>
            <Form />
        </div>
    )
}

export default Create