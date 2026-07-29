import { useState } from "react"
import { MdEdit, MdDeleteForever, MdLock } from "react-icons/md"
import { useNavigate } from "react-router"
import GlareHover from "../GlareHover"
import ModalClaveAcceso from "./ModalClaveAcceso"

// SVG de alta resolución embebido localmente en memoria (Data URI)
const INLINE_PLANT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23065f46"/><circle cx="200" cy="150" r="90" fill="%23047857"/><path d="M200 80 Q230 130 200 190 Q170 130 200 80" fill="%2334d399"/><path d="M200 140 Q250 120 270 135 Q240 170 200 140" fill="%2310b981"/><path d="M200 150 Q150 130 130 145 Q160 180 200 150" fill="%23059669"/><text x="200" y="245" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ecfdf5" text-anchor="middle">Cultivo Invernadero</text></svg>`

export default function CardCultivo({ cultivo, onDelete }) {
  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [estadoActivo, setEstadoActivo] = useState(
    cultivo?.estadoCultivo === true || cultivo?.estadoCultivo === "true"
  )

  // ── Filtro de Negocio Robusto ──────────────────────────────────
  const tieneFechaSalida = Boolean(
    cultivo?.fechaSalidaCultivo &&
    cultivo.fechaSalidaCultivo !== null &&
    cultivo.fechaSalidaCultivo !== "null" &&
    cultivo.fechaSalidaCultivo !== "" &&
    cultivo.fechaSalidaCultivo !== undefined
  )

  if (tieneFechaSalida) {
    return null
  }

  // Manejar el clic al intentar ingresar o actualizar el cultivo
  const handleAccesoCultivo = (e, rutaDestino) => {
    e.stopPropagation()
    if (!estadoActivo) {
      // Si está en false, exigir la clave enviada al correo
      setMostrarModal(true)
    } else {
      // Si ya está en true (Activo), permitir ingresar directamente
      navigate(rutaDestino)
    }
  }

  // Callback cuando la clave se verifica exitosamente
  const handleClaveExitosa = () => {
    setEstadoActivo(true)
    navigate(`/dashboard/details/${cultivo._id}`)
  }

  return (
    <>
      <GlareHover
        glareColor="#ffffffe5"
        glareOpacity={0.2}
        glareAngle={-30}
        glareSize={280}
        transitionDuration={600}
        borderRadius="16px"
        className="shadow-xl shadow-[rgba(226,232,240,0.9)] hover:shadow-2xl hover:shadow-[rgba(5,46,22,0.15)] transition-all duration-300 transform hover:-translate-y-1.5 border border-[rgba(226,232,240,0.8)]"
      >
        <div 
          onClick={(e) => handleAccesoCultivo(e, `/dashboard/details/${cultivo._id}`)}
          className="bg-[#fffdfd] flex flex-col justify-between group h-full overflow-hidden min-h-[300px] cursor-pointer"
        >
          
          {/* ── Encabezado / Imagen del Cultivo ── */}
          <div className="relative h-44 w-full bg-[rgba(241,245,249,0.5)] overflow-hidden">
            <img
              src={cultivo.avatarCultivo || INLINE_PLANT_SVG}
              alt={cultivo.nombreCultivo}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = INLINE_PLANT_SVG
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badge: Tipo de Planta */}
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-[rgba(4,120,87,0.9)] text-[#ffffff] text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider border border-[rgba(52,211,153,0.3)]">
                {cultivo.tipoPlanta || 'Cultivo'}
              </span>
            </div>

            {/* Badge: Estado del Cultivo (Activo / Inactivo) sobre la imagen */}
            <div className="absolute top-3 right-3 z-20">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs border flex items-center gap-1 ${
                estadoActivo 
                  ? "bg-[rgba(5,150,105,0.9)] text-[#ffffff] border-[rgba(52,211,153,0.3)]" 
                  : "bg-[rgba(51,65,85,0.9)] text-[#ffffff] border-[rgba(148,163,184,0.3)]"
              }`}>
                {!estadoActivo && <MdLock className="text-xs" />}
                {estadoActivo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          {/* ── Cuerpo con Nombre (Fondo Blanco y Texto Negro) ── */}
          <div className="p-6 flex-1 flex items-center justify-center bg-[#ffffff]">
            <h3 className="text-xl font-extrabold text-[#000000] leading-tight capitalize text-center tracking-wide group-hover:text-[rgba(4,120,87,1)] transition-colors">
              {cultivo.nombreCultivo}
            </h3>
          </div>

          {/* ── Acciones (Fondo Claro y Botones Claros con Texto Negro) ── */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="p-3.5 bg-[rgba(248,250,252,0.9)] border-t border-[rgba(226,232,240,0.8)] flex items-center justify-between gap-2 z-20"
          >
            <button
              type="button"
              onClick={(e) => handleAccesoCultivo(e, `/dashboard/update/${cultivo._id}`)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-[#000000] hover:text-[rgba(29,78,216,1)] bg-[#ffffff] hover:bg-[rgba(239,246,255,1)] border border-[rgba(226,232,240,1)] hover:border-[rgba(191,219,254,1)] py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Gestionar / Actualizar cultivo"
            >
              <MdEdit className="text-base text-[rgba(37,99,235,1)]" /> 
              {estadoActivo ? "Actualizar" : "Ingresar Clave"}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(cultivo._id)
              }}
              className="p-2 text-[#000000] hover:text-[rgba(225,29,72,1)] bg-[#ffffff] hover:bg-[rgba(255,241,242,1)] border border-[rgba(226,232,240,1)] hover:border-[rgba(254,202,202,1)] rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Eliminar cultivo"
            >
              <MdDeleteForever className="text-lg text-[rgba(225,29,72,1)]" />
            </button>
          </div>

        </div>
      </GlareHover>

      {/* Modal interactivo de validación de clave de acceso enviada al correo */}
      <ModalClaveAcceso
        cultivo={cultivo}
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSuccess={handleClaveExitosa}
      />
    </>
  )
}
