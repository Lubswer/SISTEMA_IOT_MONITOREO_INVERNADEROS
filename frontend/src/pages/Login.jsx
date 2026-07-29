import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link, useNavigate } from "react-router"
import { useFetch } from '../hooks/useFetch'
import { ToastContainer, toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import storeAuth from "../context/storeAuth"
import axios from "axios"


const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const  {fetchDataBackend,loading} = useFetch()
    const { setToken, setRol } = storeAuth()

    const loginUser = async (dataForm) => {
        if (dataForm.password.startsWith("GH")) {
            const url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/login`
            const response = await fetchDataBackend(url, dataForm, 'POST')
            if (response) {
                setToken(response.token)
                setRol(response.rol)
                navigate('/dashboard')
            }
            return
        }

        try {
            // Intentar primero con el login de usuario general
            const urlUser = `${import.meta.env.VITE_BACKEND_URL}/user/login`
            const response = await axios.post(urlUser, dataForm)
            if (response?.data) {
                toast.success(response.data.msg || "¡Bienvenido!")
                setToken(response.data.token)
                setRol(response.data.rol)
                navigate('/dashboard')
                return
            }
        } catch (errorUser) {
            // Si el usuario no existe en userApp (404), intentamos autenticar como Administrador
            if (errorUser.response?.status === 404) {
                try {
                    const urlAdmin = `${import.meta.env.VITE_BACKEND_URL}/admin/login`
                    const responseAdmin = await axios.post(urlAdmin, dataForm)
                    if (responseAdmin?.data) {
                        toast.success(responseAdmin.data.msg || "¡Bienvenido Administrador!")
                        setToken(responseAdmin.data.token)
                        setRol(responseAdmin.data.rol)
                        navigate('/dashboard/chats')
                        return
                    }
                } catch (errorAdmin) {
                    toast.error(errorAdmin.response?.data?.msg || errorUser.response?.data?.msg || "Credenciales incorrectas")
                    return
                }
            } else {
                toast.error(errorUser.response?.data?.msg || "Error al iniciar sesión")
            }
        }
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            <ToastContainer />

            {/* Panel izquierdo decorativo */}
            <div className="hidden sm:flex sm:w-1/2 bg-gradient-to-br from-green-800 to-green-500 flex-col items-center justify-center text-white p-10">
                <div className="text-[8rem] mb-6 select-none">🏡</div>
                <h2 className="text-4xl font-black mb-4">GreenHOUSE</h2>
                <p className="text-xl text-green-100 text-center">Gestiona tu invernadero de forma inteligente</p>
                <div className="flex gap-6 mt-10 text-5xl">
                    <span>🌱</span><span>🌿</span><span>🌾</span>
                </div>
            </div>

            <div className="w-full sm:w-1/2 flex justify-center items-center bg-white">
                <div className="w-4/5">
                    <h1 className="text-3xl font-semibold text-center text-gray-500">Bienvenido(a)</h1>
                    <p className="text-gray-400 text-center my-4">Por favor ingresa tus datos</p>

                    <form onSubmit={handleSubmit(loginUser)}>
                        <div className="mb-3">
                            <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="Ingresa tu correo"
                                className="w-full rounded-md border border-gray-300 focus:ring-1 focus:ring-green-500 px-2 py-1 text-gray-500"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-semibold mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                {errors.password && <p className="text-red-800">{errors.password.message}</p>}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                            <button className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl 
                            hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </button>
                    </form>

                    <div className="mt-6 flex items-center text-gray-400">
                        <hr className="flex-1" />
                        <span className="px-2 text-sm">O</span>
                        <hr className="flex-1" />
                    </div>

                    {/*<button className="w-full mt-5 flex items-center justify-center border py-2 rounded-xl text-sm hover:bg-black hover:text-white">
                        <img className="w-5 mr-2" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="google" />
                        Ingresar con Google
                    </button>*/}

                    <div className="mt-5 text-xs border-b-2 py-4 text-left">
                        <Link to="/forgot/id" className="underline text-gray-400 hover:text-gray-900">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                        <Link to="/" className="underline text-gray-400 hover:text-gray-900">Regresar</Link>
                        <Link to="/register" className="py-2 px-5 bg-green-700 text-white rounded-xl hover:bg-green-900">Registrarse</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
