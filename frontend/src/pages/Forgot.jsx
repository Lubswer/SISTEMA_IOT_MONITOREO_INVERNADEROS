import { Link } from 'react-router'
import { useForm } from 'react-hook-form';
import { ToastContainer} from 'react-toastify'
import {useFetch} from '../hooks/useFetch'

export const Forgot = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const {fetchDataBackend,loading} = useFetch()

    const sendMail = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`
        await fetchDataBackend(url, dataForm,'POST')
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen">

            <ToastContainer/>

            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
                <div className="md:w-4/5 sm:w-full">

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">¿Olvidaste tu contraseña?</h1>
                    <small className="text-gray-400 block my-4 text-sm">No te preocupes, te enviaremos un enlace de recuperación</small>

                    <form  onSubmit={handleSubmit(sendMail)}>
                        <div className="mb-1">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="Ingresa un correo electrónico válido"
                                className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                                {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                        </div>
                        <div className="mb-3">
                            <button className="bg-green-700 text-white border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-green-900">
                                {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4" />

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya posees una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-green-700 text-white border rounded-xl hover:scale-110 duration-300 hover:bg-green-900">
                            Iniciar sesión
                        </Link>
                    </div>

                </div>
            </div>

            {/* Panel decorativo */}
            <div className="hidden sm:flex sm:w-1/2 bg-gradient-to-bl from-green-700 to-lime-500 flex-col items-center justify-center text-white p-10">
                <div className="text-[8rem] mb-6 select-none">🔑</div>
                <h2 className="text-3xl font-black mb-4 text-center">Recupera tu acceso</h2>
                <p className="text-xl text-green-100 text-center">Te ayudamos a volver a tu invernadero</p>
                <div className="flex gap-6 mt-10 text-5xl">
                    <span>🌱</span><span>🌿</span><span>🌾</span>
                </div>
            </div>

        </div>
    )
}
