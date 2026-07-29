import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useFetch } from "../hooks/useFetch"
import { ToastContainer } from "react-toastify"
import { MdEdit, MdArrowBack } from "react-icons/md"

const Update = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { fetchDataBackend } = useFetch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [cargando, setCargando] = useState(true)

    const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200"

    const getHeaders = () => {
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser?.state?.token}`,
        }
    }

    // Cargar datos actuales del cultivo
    useEffect(() => {
        const obtenerCultivo = async () => {
            if (!id) return
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/detalle/${id}`
                const res = await fetchDataBackend(url, null, "GET", getHeaders())
                if (res) {
                    reset({
                        nombreCultivo: res.nombreCultivo || "",
                        tipoPlanta: res.tipoPlanta || "",
                        cantidad: res.cantidad || 1,
                        detalleCultivo: res.detalleCultivo || ""
                    })
                }
            } catch (err) {
                console.error("Error al cargar cultivo:", err)
            } finally {
                setCargando(false)
            }
        }
        obtenerCultivo()
    }, [id])

    // Enviar actualización
    const onSubmit = async (dataForm) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/actualizar/${id}`
            const res = await fetchDataBackend(url, dataForm, "PUT", getHeaders())
            if (res) {
                setTimeout(() => {
                    navigate("/dashboard/list")
                }, 1500)
            }
        } catch (err) {
            console.error("Error al actualizar cultivo:", err)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <ToastContainer autoClose={3000} />

            {/* Cabecera */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className='font-black text-2xl text-gray-700'>Actualizar Datos del Cultivo</h1>
                    <hr className='my-3 border-t-2 border-gray-300' />
                    <p className='text-xs text-slate-500 font-medium'>
                        Modifica únicamente la información general de este cultivo activo.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard/list")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                    <MdArrowBack className="text-base" /> Volver a Cultivos
                </button>
            </div>

            {cargando ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center text-slate-500">
                    <p className="text-sm font-semibold">Cargando información del cultivo...</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-2xl shadow-xs space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                            <MdEdit className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Formulario de Edición</h2>
                            <p className="text-xs text-slate-500">Actualiza los campos permitidos del cultivo.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* 1. Nombre del Cultivo */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                    Nombre del Cultivo *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. Tomate cherry, Lechuga romana..."
                                    className={inputCls}
                                    {...register("nombreCultivo", { required: "El nombre del cultivo es obligatorio" })}
                                />
                                {errors.nombreCultivo && (
                                    <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.nombreCultivo.message}</p>
                                )}
                            </div>

                            {/* 2. Tipo de Planta */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                    Tipo de Planta *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. Hortaliza, Fruta, Hierba aromática..."
                                    className={inputCls}
                                    {...register("tipoPlanta", { required: "El tipo de planta es obligatorio" })}
                                />
                                {errors.tipoPlanta && (
                                    <p className="text-rose-600 text-xs mt-1 font-semibold">{errors.tipoPlanta.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 3. Cantidad */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                Cantidad de Plantas / Macetas
                            </label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Ej. 10"
                                className={inputCls}
                                {...register("cantidad")}
                            />
                        </div>

                        {/* 4. Detalle del Cultivo / Notas */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                Detalle / Notas del Cultivo
                            </label>
                            <textarea
                                rows="3"
                                placeholder="Ingresa detalles sobre la variedad, etapa o notas de seguimiento..."
                                className={`${inputCls} resize-none`}
                                {...register("detalleCultivo")}
                            />
                        </div>

                        {/* Botón de Enviar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard/list")}
                                className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
                            >
                                Actualizar Cultivo
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    )
}

export default Update