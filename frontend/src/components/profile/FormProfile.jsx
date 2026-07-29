import { useEffect, useState } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"
import { MdEdit, MdCloudUpload } from "react-icons/md"

const FormularioPerfil = () => {
    const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200"

    const { user, updateProfile } = storeProfile()
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
    const [preview, setPreview] = useState(null)
    const esAdmin = user?.rol === "admin"

    const avatarFile = watch("avatar")

    useEffect(() => {
        if (avatarFile && avatarFile[0]) {
            const objectUrl = URL.createObjectURL(avatarFile[0])
            setPreview(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [avatarFile])

    const updateUser = (dataForm) => {
        if (esAdmin) {
            const payload = {
                nombre: dataForm.nombre,
                email: dataForm.email
            }
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/actualizarperfil`
            updateProfile(url, payload)
        } else {
            const formData = new FormData()
            formData.append("nombre", dataForm.nombre)
            formData.append("apellido", dataForm.apellido)
            formData.append("direccion", dataForm.direccion)
            formData.append("celular", dataForm.celular)

            if (dataForm.avatar?.[0]) {
                formData.append("avatar", dataForm.avatar[0])
            }

            const url = `${import.meta.env.VITE_BACKEND_URL}/user/actualizarperfil/${user._id}`
            updateProfile(url, formData)
        }
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre,
                apellido: user?.apellido,
                direccion: user?.direccion,
                celular: user?.celular,
                email: user?.email,
            })
            setPreview(user?.avatar || null)
        }
    }, [user])

    if (esAdmin) {
        return (
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                        <MdEdit className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Editar Datos del Administrador</h2>
                        <p className="text-xs text-slate-500">Actualiza tu nombre y correo electrónico oficial.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(updateUser)} className="space-y-4">
                    {/* Campo Nombre Administrador */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nombre del Administrador</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu nombre"
                            className={inputCls}
                            {...register("nombre", { required: "El nombre es obligatorio" })}
                        />
                        {errors.nombre && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.nombre.message}</p>}
                    </div>

                    {/* Campo Correo Electrónico */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Correo Electrónico</label>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            className={inputCls}
                            {...register("email", { required: "El correo es obligatorio" })}
                        />
                        {errors.email && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.email.message}</p>}
                    </div>

                    {/* Botón para actualizar el perfil admin */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl py-3 text-sm shadow-md shadow-emerald-900/20 transition-all duration-200 active:scale-[0.99] mt-2 cursor-pointer"
                    >
                        Actualizar Datos
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                    <MdEdit className="text-xl" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Editar Datos Personales</h2>
                    <p className="text-xs text-slate-500">Actualiza tu información de contacto y foto de perfil.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(updateUser)} className="space-y-4">

                {/* Campo Selección de Foto de Perfil */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Cambiar Foto de Perfil</label>
                    <div className="flex items-center gap-3 flex-wrap">
                        <input
                            type="file"
                            accept="image/*"
                            id="avatar-input"
                            className="hidden"
                            {...register("avatar")}
                        />
                        <label
                            htmlFor="avatar-input"
                            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-50 px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                            <MdCloudUpload className="text-base" /> Seleccionar Foto
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">
                            {avatarFile?.[0]?.name ? `Archivo: ${avatarFile[0].name}` : "Formatos permitidos: JPG, PNG o WEBP"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Campo Nombre */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu nombre"
                            className={inputCls}
                            {...register("nombre", { required: "El nombre es obligatorio" })}
                        />
                        {errors.nombre && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.nombre.message}</p>}
                    </div>

                    {/* Campo Apellido */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Apellido</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu apellido"
                            className={inputCls}
                            {...register("apellido", { required: "El apellido es obligatorio" })}
                        />
                        {errors.apellido && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.apellido.message}</p>}
                    </div>
                </div>

                {/* Campo Dirección */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Dirección / Invernadero</label>
                    <input
                        type="text"
                        placeholder="Ingresa tu dirección"
                        className={inputCls}
                        {...register("direccion", { required: "La dirección es obligatoria" })}
                    />
                    {errors.direccion && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.direccion.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Campo Celular */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Celular</label>
                        <input
                            type="text"
                            inputMode="tel"
                            placeholder="Ingresa tu teléfono"
                            className={inputCls}
                            {...register("celular", { required: "El celular es obligatorio" })}
                        />
                        {errors.celular && <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.celular.message}</p>}
                    </div>

                    {/* Campo Correo Electrónico */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Correo electrónico</label>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo"
                            value={user?.email || ""}
                            className={`${inputCls} bg-slate-100/70 text-slate-500 cursor-not-allowed`}
                            disabled
                        />
                    </div>
                </div>

                {/* Botón para actualizar el perfil */}
                <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl py-3 text-sm shadow-md shadow-emerald-900/20 transition-all duration-200 active:scale-[0.99] mt-2 cursor-pointer"
                >
                    Actualizar Datos
                </button>
            </form>
        </div>
    )
}

export default FormularioPerfil