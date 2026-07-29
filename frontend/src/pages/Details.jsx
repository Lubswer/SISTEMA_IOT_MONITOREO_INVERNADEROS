import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useFetch } from "../hooks/useFetch"
import { ToastContainer } from "react-toastify"
import storeTreatments from "../context/store/storeTreatments"
import ModalTreatments from "../components/treatments/Modal"
import { 
  MdArrowBack, 
  MdPerson, 
  MdGrass, 
  MdNumbers, 
  MdCalendarToday, 
  MdCategory, 
  MdInfo,
  MdAdd
} from "react-icons/md"

// SVG de alta resolución embebido localmente en memoria (Data URI)
const INLINE_PLANT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23065f46"/><circle cx="200" cy="150" r="90" fill="%23047857"/><path d="M200 80 Q230 130 200 190 Q170 130 200 80" fill="%2334d399"/><path d="M200 140 Q250 120 270 135 Q240 170 200 140" fill="%2310b981"/><path d="M200 150 Q150 130 130 145 Q160 180 200 150" fill="%23059669"/><text x="200" y="245" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ecfdf5" text-anchor="middle">Cultivo Invernadero</text></svg>`

const Details = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { fetchDataBackend } = useFetch()
    const [cultivo, setCultivo] = useState(null)
    const { modal, toggleModal } = storeTreatments()

    useEffect(() => {
        const getCultivo = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/detalle/${id}`
            const storedUser = JSON.parse(localStorage.getItem("auth-token"))
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedUser?.state?.token}`,
            }
            const response = await fetchDataBackend(url, null, "GET", headers)
            if (response) {
                setCultivo(response)
            }
        }
        
        if (!modal) {
            getCultivo()
        }
    }, [id, modal])

    if (!cultivo) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 border-4 border-[rgba(4,120,87,1)] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[rgba(100,116,139,1)] font-semibold text-sm">Cargando detalles del cultivo...</p>
                </div>
            </div>
        )
    }

    const esActivo = cultivo?.estadoCultivo === true || cultivo?.estadoCultivo === "true"

    // Extraer tratamiento desde el array de tratamientos o desde las propiedades mapeadas
    const tratamientoRelacionado = cultivo?.tratamientos?.[0] || cultivo?.tratamientos?.[cultivo?.tratamientos?.length - 1] || {}
    const nivelHumedad = cultivo?.nivelhumedad || tratamientoRelacionado?.nivelhumedad || "Sin registrar"
    const nivelRiego = cultivo?.nivelRiego || tratamientoRelacionado?.nivelRiego || "Sin registrar"
    const nivelLuz = cultivo?.nivelLuz || tratamientoRelacionado?.nivelLuz || "Sin registrar"

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <ToastContainer />

            {/* ── Encabezado y Navegación ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(226,232,240,0.8)] pb-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/list")}
                        className="p-2 bg-[#ffffff] hover:bg-[rgba(241,245,249,1)] border border-[rgba(226,232,240,1)] rounded-xl text-[#0f172a] transition-colors shadow-2xs cursor-pointer"
                        title="Volver a la lista"
                    >
                        <MdArrowBack className="text-xl" />
                    </button>
                    <div>
                        <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0f172a] capitalize">
                            {cultivo.nombreCultivo}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-xl shadow-xs border ${
                        esActivo 
                            ? "bg-[rgba(4,120,87,0.9)] text-[#ffffff] border-[rgba(52,211,153,0.3)]" 
                            : "bg-[rgba(51,65,85,0.9)] text-[#ffffff] border-[rgba(148,163,184,0.3)]"
                    }`}>
                        Estado: {esActivo ? "Activo" : "Inactivo / Salida"}
                    </span>
                </div>
            </div>

            {/* ── Grid Principal de 2 Columnas ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna Izquierda: Información Detallada (2/3 de ancho) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Card 1: Datos del Propietario */}
                    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(226,232,240,0.8)] p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-[rgba(241,245,249,1)] pb-3">
                            <MdPerson className="text-xl text-[rgba(4,120,87,1)]" />
                            <h2 className="text-base font-bold text-[#0f172a]">Información del Propietario</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="bg-[rgba(248,250,252,0.9)] p-3.5 rounded-xl border border-[rgba(226,232,240,0.8)] space-y-1">
                                <span className="text-[rgba(148,163,184,1)] font-bold uppercase tracking-wider block text-[10px]">Nombre Completo</span>
                                <span className="text-[#0f172a] font-bold text-sm block capitalize">
                                    {cultivo.nombrePropietario || cultivo.usuario?.nombre || "Lubswer Catagña"}
                                </span>
                            </div>

                            <div className="bg-[rgba(248,250,252,0.9)] p-3.5 rounded-xl border border-[rgba(226,232,240,0.8)] space-y-1">
                                <span className="text-[rgba(148,163,184,1)] font-bold uppercase tracking-wider block text-[10px]">Correo Electrónico</span>
                                <span className="text-[#0f172a] font-bold text-sm block truncate">
                                    {cultivo.emailPropietario || cultivo.usuario?.email || "lubswer@gmail.com"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Especificaciones del Cultivo */}
                    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(226,232,240,0.8)] p-6 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-[rgba(241,245,249,1)] pb-3">
                            <MdGrass className="text-xl text-[rgba(4,120,87,1)]" />
                            <h2 className="text-base font-bold text-[#0f172a]">Ficha Técnica del Cultivo</h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            
                            <div className="p-3 bg-[rgba(248,250,252,0.9)] rounded-xl border border-[rgba(226,232,240,0.8)]">
                                <div className="flex items-center gap-1.5 text-[rgba(148,163,184,1)] mb-1">
                                    <MdGrass className="text-[rgba(4,120,87,1)]" />
                                    <span className="font-semibold text-[10px] uppercase">Tipo de Planta</span>
                                </div>
                                <span className="font-bold text-[#0f172a] text-sm capitalize">
                                    {cultivo.tipoPlanta || "Sin especificar"}
                                </span>
                            </div>

                            <div className="p-3 bg-[rgba(248,250,252,0.9)] rounded-xl border border-[rgba(226,232,240,0.8)]">
                                <div className="flex items-center gap-1.5 text-[rgba(148,163,184,1)] mb-1">
                                    <MdNumbers className="text-[rgba(4,120,87,1)]" />
                                    <span className="font-semibold text-[10px] uppercase">Cantidad</span>
                                </div>
                                <span className="font-bold text-[#0f172a] text-sm">
                                    {cultivo.cantidad || "1"} unidades
                                </span>
                            </div>

                            <div className="p-3 bg-[rgba(248,250,252,0.9)] rounded-xl border border-[rgba(226,232,240,0.8)]">
                                <div className="flex items-center gap-1.5 text-[rgba(148,163,184,1)] mb-1">
                                    <MdCategory className="text-[rgba(4,120,87,1)]" />
                                    <span className="font-semibold text-[10px] uppercase">Etapa de Madurez</span>
                                </div>
                                <span className="font-bold text-[#0f172a] text-sm capitalize">
                                    {cultivo.estadoMadurezCultivo || "Germinación"}
                                </span>
                            </div>

                            <div className="p-3 bg-[rgba(248,250,252,0.9)] rounded-xl border border-[rgba(226,232,240,0.8)]">
                                <div className="flex items-center gap-1.5 text-[rgba(148,163,184,1)] mb-1">
                                    <MdCalendarToday className="text-[rgba(4,120,87,1)]" />
                                    <span className="font-semibold text-[10px] uppercase">Fecha de Ingreso</span>
                                </div>
                                <span className="font-bold text-[#0f172a] text-sm">
                                    {cultivo.fechaIngresoCultivo
                                        ? new Date(cultivo.fechaIngresoCultivo).toLocaleDateString("es-EC")
                                        : "—"}
                                </span>
                            </div>

                            <div className="p-3 bg-[rgba(248,250,252,0.9)] rounded-xl border border-[rgba(226,232,240,0.8)]">
                                <div className="flex items-center gap-1.5 text-[rgba(148,163,184,1)] mb-1">
                                    <MdCalendarToday className="text-[rgba(4,120,87,1)]" />
                                    <span className="font-semibold text-[10px] uppercase">Tiempo Cosecha</span>
                                </div>
                                <span className="font-bold text-[#0f172a] text-sm">
                                    {cultivo.tiempoCosecha || "En seguimiento"}
                                </span>
                            </div>

                            <div className="p-3 bg-[rgba(248,250,252,0.9)] rounded-xl border border-[rgba(226,232,240,0.8)]">
                                <div className="flex items-center gap-1.5 text-[rgba(148,163,184,1)] mb-1">
                                    <MdInfo className="text-[rgba(4,120,87,1)]" />
                                    <span className="font-semibold text-[10px] uppercase">Estado Actual</span>
                                </div>
                                <span className={`font-bold text-xs uppercase px-2 py-0.5 rounded-md inline-block ${
                                    esActivo 
                                        ? "bg-[rgba(236,253,245,1)] text-[rgba(6,95,70,1)] border border-[rgba(167,243,208,1)]" 
                                        : "bg-[rgba(241,245,249,1)] text-[rgba(30,41,59,1)] border border-[rgba(226,232,240,1)]"
                                }`}>
                                    {esActivo ? "Activo" : "Inactivo"}
                                </span>
                            </div>

                        </div>

                        {/* Observaciones o Detalle */}
                        {cultivo.detalleCultivo && (
                            <div className="pt-3 border-t border-[rgba(241,245,249,1)]">
                                <span className="text-[rgba(148,163,184,1)] font-bold uppercase tracking-wider block text-[10px] mb-1">
                                    Detalle / Observaciones
                                </span>
                                <p className="text-xs text-[#0f172a] bg-[rgba(248,250,252,0.9)] p-3.5 rounded-xl border border-[rgba(226,232,240,0.8)] leading-relaxed font-medium">
                                    {cultivo.detalleCultivo}
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Columna Derecha: Fotografía del Cultivo y Tratamientos */}
                <div className="flex flex-col items-center justify-start pt-2 space-y-6">
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-[rgba(255,255,255,0.93)] border-4 border-[rgb(255,255,255)] shadow-2xl flex items-center justify-center">
                        <img
                            src={cultivo.avatarCultivo || INLINE_PLANT_SVG}
                            alt={`Imagen de ${cultivo.nombreCultivo}`}
                            onError={(e) => {
                                e.target.onerror = null
                                e.target.src = INLINE_PLANT_SVG
                            }}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {/* 3 Tratamientos + Botón "Registrar tratamientos" */}
                    <div className="bg-[#ffffff] rounded-2xl border border-[rgba(226,232,240,0.8)] p-5 shadow-xs w-full max-w-sm space-y-3.5">
                        <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider text-center border-b border-[rgba(241,245,249,1)] pb-2">
                            Tratamientos del Cultivo
                        </h3>
                        <div className="space-y-3">
                            {/* Fila 1: Humedad */}
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-xs font-bold text-[rgba(100,116,139,1)] uppercase whitespace-nowrap min-w-[110px]">
                                    Nivel de Humedad
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={nivelHumedad}
                                    className="flex-1 text-xs font-bold text-[#0f172a] bg-[rgba(248,250,252,0.9)] border border-[rgba(226,232,240,0.8)] rounded-xl px-3 py-2 text-center outline-none focus:ring-0 capitalize"
                                />
                            </div>

                            {/* Fila 2: Riego */}
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-xs font-bold text-[rgba(100,116,139,1)] uppercase whitespace-nowrap min-w-[110px]">
                                    Nivel de Riego
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={nivelRiego}
                                    className="flex-1 text-xs font-bold text-[#0f172a] bg-[rgba(248,250,252,0.9)] border border-[rgba(226,232,240,0.8)] rounded-xl px-3 py-2 text-center outline-none focus:ring-0 capitalize"
                                />
                            </div>

                            {/* Fila 3: Luz */}
                            <div className="flex items-center justify-between gap-3">
                                <label className="text-xs font-bold text-[rgba(100,116,139,1)] uppercase whitespace-nowrap min-w-[110px]">
                                    Nivel de Luz
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={nivelLuz}
                                    className="flex-1 text-xs font-bold text-[#0f172a] bg-[rgba(248,250,252,0.9)] border border-[rgba(226,232,240,0.8)] rounded-xl px-3 py-2 text-center outline-none focus:ring-0 capitalize"
                                />
                            </div>
                        </div>

                        {/* Botón de Registrar Tratamientos */}
                        <button
                            type="button"
                            onClick={() => toggleModal("treatments")}
                            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#ffffff] bg-[rgba(4,120,87,0.9)] hover:bg-[rgba(4,120,87,1)] active:scale-98 border border-[rgba(52,211,153,0.3)] py-2.5 rounded-xl transition-all cursor-pointer shadow-md mt-4"
                        >
                            <MdAdd className="text-base" /> Registrar tratamientos
                        </button>
                    </div>
                </div>

            </div>

            {/* Modal para registrar tratamiento */}
            {modal === "treatments" && (<ModalTreatments cultivoUserID={cultivo._id} />)}
        </div>
    )
}

export default Details
