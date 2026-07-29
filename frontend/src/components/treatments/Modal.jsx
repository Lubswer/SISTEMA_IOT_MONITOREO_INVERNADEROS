import { useForm } from "react-hook-form"
import storeTreatments from "../../context/store/storeTreatments"

const ModalTreatments = ({ cultivoUserID }) => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { toggleModal, registerTreatments } = storeTreatments()

    const registerTreatmentsForm = (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/tratamiento/registro`
        const newData = { ...dataForm, cultivoUser: cultivoUserID }
        registerTreatments(url, newData)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.6)] backdrop-blur-xs p-4">
            <div className="bg-[#ffffff] rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-[rgba(226,232,240,0.8)] relative animate-fadeIn">
                
                {/* Encabezado */}
                <div className="bg-[rgba(4,120,87,0.9)] p-4 text-center">
                    <h2 className="text-[#ffffff] font-extrabold text-base tracking-wide uppercase">
                        Registrar Tratamientos
                    </h2>
                    <p className="text-[rgba(236,253,245,0.8)] text-xs font-medium">
                        Ingresa los niveles para el cultivo
                    </p>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit(registerTreatmentsForm)}>

                    {/* Nivel de Humedad */}
                    <div>
                        <label className="block text-xs font-bold text-[rgba(100,116,139,1)] uppercase mb-1">
                            Nivel de Humedad
                        </label>
                        <select
                            className="w-full text-xs font-semibold text-[#0f172a] bg-[rgba(248,250,252,0.9)] border border-[rgba(226,232,240,0.8)] rounded-xl px-3 py-2.5 outline-none focus:border-[rgba(4,120,87,1)] transition-colors cursor-pointer"
                            {...register("nivelhumedad", { required: "El nivel de humedad es obligatorio" })}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="Alto">Alto</option>
                            <option value="Medio">Medio</option>
                            <option value="Bajo">Bajo</option>
                        </select>
                        {errors.nivelhumedad && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">{errors.nivelhumedad.message}</p>
                        )}
                    </div>

                    {/* Nivel de Riego */}
                    <div>
                        <label className="block text-xs font-bold text-[rgba(100,116,139,1)] uppercase mb-1">
                            Nivel de Riego
                        </label>
                        <select
                            className="w-full text-xs font-semibold text-[#0f172a] bg-[rgba(248,250,252,0.9)] border border-[rgba(226,232,240,0.8)] rounded-xl px-3 py-2.5 outline-none focus:border-[rgba(4,120,87,1)] transition-colors cursor-pointer"
                            {...register("nivelRiego", { required: "El nivel de riego es obligatorio" })}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="Alto">Alto</option>
                            <option value="Medio">Medio</option>
                            <option value="Bajo">Bajo</option>
                        </select>
                        {errors.nivelRiego && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">{errors.nivelRiego.message}</p>
                        )}
                    </div>

                    {/* Nivel de Luz */}
                    <div>
                        <label className="block text-xs font-bold text-[rgba(100,116,139,1)] uppercase mb-1">
                            Nivel de Luz
                        </label>
                        <select
                            className="w-full text-xs font-semibold text-[#0f172a] bg-[rgba(248,250,252,0.9)] border border-[rgba(226,232,240,0.8)] rounded-xl px-3 py-2.5 outline-none focus:border-[rgba(4,120,87,1)] transition-colors cursor-pointer"
                            {...register("nivelLuz", { required: "El nivel de luz es obligatorio" })}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="Alto">Alto</option>
                            <option value="Medio">Medio</option>
                            <option value="Bajo">Bajo</option>
                        </select>
                        {errors.nivelLuz && (
                            <p className="text-red-500 text-[11px] font-bold mt-1">{errors.nivelLuz.message}</p>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => toggleModal()}
                            className="px-4 py-2 text-xs font-bold text-[#0f172a] bg-[rgba(241,245,249,1)] hover:bg-[rgba(226,232,240,1)] rounded-xl border border-[rgba(203,213,225,1)] transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-xs font-bold text-[#ffffff] bg-[rgba(4,120,87,0.9)] hover:bg-[rgba(4,120,87,1)] rounded-xl shadow-md transition-all cursor-pointer"
                        >
                            Guardar Tratamientos
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ModalTreatments
