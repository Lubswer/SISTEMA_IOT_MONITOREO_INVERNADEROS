import { useForm } from "react-hook-form"
import storeProfile from "../../context/storeProfile"
import storeAuth from "../../context/storeAuth"
import { ToastContainer } from 'react-toastify'
import { MdLock } from "react-icons/md"

const CardPassword = () => {
    const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200"

    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const { user, updatePasswordProfile } = storeProfile()
    const { clearToken } = storeAuth()

    const updatePassword = async (dataForm) => {
        const url = user?.rol === "admin"
            ? `${import.meta.env.VITE_BACKEND_URL}/admin/actualizarpassword`
            : `${import.meta.env.VITE_BACKEND_URL}/user/actualizarpassword/${user._id}`

        const response = await updatePasswordProfile(url, dataForm)
        if (response) {
            reset()
            clearToken()
        }
    }

    return (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                    <MdLock className="text-xl" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Seguridad y Contraseña</h2>
                    <p className="text-xs text-slate-500">Actualiza la clave de acceso a tu cuenta.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(updatePassword)} className="space-y-4">
                {/* Campo contraseña actual */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Contraseña actual</label>
                    <input
                        type="password"
                        placeholder="Ingresa tu contraseña actual"
                        className={inputCls}
                        {...register("passwordActual", { required: "La contraseña actual es obligatoria" })}
                    />
                    {errors.passwordActual && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.passwordActual.message}</p>}
                </div>

                {/* Campo contraseña nueva */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nueva contraseña</label>
                    <input
                        type="password"
                        placeholder="Ingresa la nueva contraseña"
                        className={inputCls}
                        {...register("confirmPassword", { required: "La nueva contraseña es obligatoria" })}
                    />
                    {errors.confirmPassword && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.confirmPassword.message}</p>}
                </div>

                {/* Confirmar nueva contraseña */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Repetir nueva contraseña</label>
                    <input
                        type="password"
                        placeholder="Repite la nueva contraseña"
                        className={inputCls}
                        {...register("repeatComfirmPassword", { required: "Debes confirmar la contraseña" })}
                    />
                    {errors.repeatComfirmPassword && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.repeatComfirmPassword.message}</p>}
                </div>

                {/* Botón para actualizar la contraseña */}
                <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl py-3 text-sm shadow-md shadow-slate-900/10 transition-all duration-200 active:scale-[0.99] mt-2 cursor-pointer"
                >
                    Cambiar Contraseña
                </button>
            </form>
        </div>
    )
}

export default CardPassword