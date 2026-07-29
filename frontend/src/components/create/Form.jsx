import { useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import generateAvatar from "../../helpers/consultarIA"
import storeProfile from "../../context/storeProfile"

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/2138/2138440.png"


export const Form = ({ patient }) => {

    const { user } = storeProfile()
    const [avatar, setAvatar] = useState({
        image: DEFAULT_AVATAR,
        prompt: "",
        loading: false
    })

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
    const { fetchDataBackend } = useFetch()

    const selectedOption = watch("imageOption")


    // Genera imagen con IA y la inyecta en el formulario
    const handleGenerateImage = async () => {
        const cropName = watch("nombreCultivo")
        const promptText = avatar.prompt || cropName || "cultivo verde en invernadero"

        setAvatar(prev => ({ ...prev, loading: true }))

        try {
            const blob = await generateAvatar(promptText)

            const file = new File([blob], `cultivo_ia_${Date.now()}.png`, { type: blob.type || "image/png" })
            const imageUrl = URL.createObjectURL(blob)

            // Liberar memoria de la imagen previa si existía
            if (avatar.image && avatar.image.startsWith("blob:")) {
                URL.revokeObjectURL(avatar.image)
            }

            setAvatar({
                prompt: avatar.prompt,
                image: imageUrl,
                loading: false
            })
            setValue("imagen", [file], { shouldValidate: true, shouldDirty: true })
            toast.success("¡Nueva imagen generada exitosamente con IA!")

        } catch (error) {
            console.error(error)
            toast.error("Error al generar la imagen con IA")
            setAvatar(prev => ({ ...prev, loading: false }))
        }
    }


    // Envía el formulario al backend
    const registerCultivo = async (dataForm) => {

        const formData = new FormData()

        Object.keys(dataForm).forEach((key) => {
            if (key === "imagen") {
                if (dataForm.imagen?.[0]) {
                    formData.append("imagen", dataForm.imagen[0])
                }
            } else {
                formData.append(key, dataForm[key])
            }
        })

        // Auto-asignar propietario desde la sesión activa del usuario
        if (!dataForm.nombrePropietario) {
            formData.append("nombrePropietario", `${user?.nombre || 'Usuario'} ${user?.apellido || ''}`.trim())
        }
        if (!dataForm.emailPropietario) {
            formData.append("emailPropietario", user?.email || "usuario@gplantita.com")
        }

        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        const headers = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${storedUser.state.token}`
        }

        let url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/registro`
        let response

        if (patient?._id) {
            url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/actualizar/${patient._id}`
            response = await fetchDataBackend(url, formData, "PUT", headers)
        } else {
            response = await fetchDataBackend(url, formData, "POST", headers)
        }

        if (response) {
            if (response.claveAcceso) {
                toast.info(`🔑 Clave de Acceso generada para este cultivo: ${response.claveAcceso}`, {
                    autoClose: 10000
                })
            }
            setTimeout(() => {
                navigate("/dashboard/list")
            }, 3500)
        }
    }

    return (
        <form onSubmit={handleSubmit(registerCultivo)}>

            <ToastContainer />


            {/* ─── Sección: Información del cultivo ─── */}
            <fieldset className="border-2 border-gray-500 p-6 rounded-lg shadow-lg mt-10">

                <legend className="text-xl font-bold text-gray-700 bg-gray-200 px-4 py-1 rounded-md">
                    Información del cultivo
                </legend>

                {/* Nombre del cultivo */}
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-semibold">Nombre del cultivo</label>
                    <input
                        type="text"
                        placeholder="Ej. Tomate cherry, Lechuga romana..."
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                        {...register("nombreCultivo", { required: "El nombre del cultivo es obligatorio" })}
                    />
                    {errors.nombreCultivo && <p className="text-red-800 text-sm mt-1">{errors.nombreCultivo.message}</p>}
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                    {/* Tipo de planta */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Tipo de planta</label>
                        <select
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                            defaultValue=""
                            {...register("tipoPlanta", { required: "El tipo de planta es obligatorio" })}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="hortaliza">Hortaliza</option>
                            <option value="fruto">Fruto</option>
                            <option value="hierba">Hierba aromática</option>
                            <option value="flor">Flor</option>
                            <option value="otro">Otro</option>
                        </select>
                        {errors.tipoPlanta && <p className="text-red-800 text-sm mt-1">{errors.tipoPlanta.message}</p>}
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Cantidad</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            min="1"
                            placeholder="Ej. 10"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                            {...register("cantidad", { required: "La cantidad es obligatoria" })}
                        />
                        {errors.cantidad && <p className="text-red-800 text-sm mt-1">{errors.cantidad.message}</p>}
                    </div>
                </div>


                


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                    {/* Tiempo de cosecha */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Tiempo estimado de cosecha</label>
                        <input
                            type="text"
                            placeholder="Ej. 3 meses, 90 días..."
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                            {...register("tiempoCosecha", { required: "El tiempo de cosecha es obligatorio" })}
                        />
                        {errors.tiempoCosecha && <p className="text-red-800 text-sm mt-1">{errors.tiempoCosecha.message}</p>}
                    </div>

                    {/* Estado de madurez */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold">Estado de madurez</label>
                        <select
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                            defaultValue=""
                            {...register("estadoMadurezCultivo", { required: "El estado de madurez es obligatorio" })}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="semilla">Semilla</option>
                            <option value="germinacion">Germinación</option>
                            <option value="crecimiento">Crecimiento</option>
                            <option value="maduracion">Maduración</option>
                            <option value="cosecha">Listo para cosechar</option>
                        </select>
                        {errors.estadoMadurezCultivo && <p className="text-red-800 text-sm mt-1">{errors.estadoMadurezCultivo.message}</p>}
                    </div>
                </div>


                {/* Detalle / observaciones del cultivo */}
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-semibold">Detalle del cultivo</label>
                    <textarea
                        placeholder="Ingresa condiciones especiales, síntomas, notas del cultivo..."
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                        rows={3}
                        {...register("detalleCultivo", { required: "El detalle del cultivo es obligatorio" })}
                    />
                    {errors.detalleCultivo && <p className="text-red-800 text-sm mt-1">{errors.detalleCultivo.message}</p>}
                </div>


                {/* ─── Imagen del cultivo ─── */}
                <label className="mb-2 block text-sm font-semibold">Imagen del cultivo</label>

                <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="ia"
                            {...register("imageOption", { required: "Seleccione una opción para la imagen" })}
                        />
                        Generar con IA
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="upload"
                            {...register("imageOption", { required: "Seleccione una opción para la imagen" })}
                        />
                        Subir imagen
                    </label>
                </div>
                {errors.imageOption && <p className="text-red-800 text-sm mt-1">{errors.imageOption.message}</p>}


                {/* Imagen con IA */}
                {selectedOption === "ia" && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Imagen con IA</label>
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Describe el cultivo para generar imagen..."
                                className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                                value={avatar.prompt}
                                onChange={(e) => setAvatar(prev => ({ ...prev, prompt: e.target.value }))}
                            />
                            <button
                                type="button"
                                className="py-1 px-8 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white sm:w-80"
                                onClick={handleGenerateImage}
                                disabled={avatar.loading}
                            >
                                {avatar.loading ? "Generando..." : "Generar con IA"}
                            </button>
                        </div>
                        {avatar.image && (
                            <img src={avatar.image} alt="Avatar cultivo IA" width={100} height={100} className="rounded-md" />
                        )}
                    </div>
                )}

                {/* Subir imagen manual */}
                {selectedOption === "upload" && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Subir imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                            {...register("imagen")}
                        />
                    </div>
                )}

            </fieldset>


            {/* Botón de registro */}
            <input
                type="submit"
                className="bg-gray-800 w-full p-2 mt-5 text-slate-300 uppercase font-bold rounded-lg 
                hover:bg-gray-600 cursor-pointer transition-all"
                value={patient?._id ? "Actualizar cultivo" : "Registrar cultivo"}
            />

        </form>
    )
}