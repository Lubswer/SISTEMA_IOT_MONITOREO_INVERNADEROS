import { useState } from "react"
import { MdKey, MdLock, MdClose, MdCheckCircle } from "react-icons/md"
import { useFetch } from "../../hooks/useFetch"
import { toast } from "react-toastify"

export default function ModalClaveAcceso({ cultivo, isOpen, onClose, onSuccess }) {
  const [clave, setClave] = useState("")
  const [cargando, setCargando] = useState(false)
  const { fetchDataBackend } = useFetch()

  if (!isOpen || !cultivo) return null

  const getHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser?.state?.token}`,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!clave.trim()) {
      toast.warning("Por favor ingresa la clave de acceso enviada a tu correo.")
      return
    }

    setCargando(true)
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/verificar-clave/${cultivo._id}`
      const response = await fetchDataBackend(
        url,
        { passwordPropietario: clave.trim() },
        "POST",
        getHeaders()
      )

      if (response) {
        toast.success("¡Clave correcta! Tu cultivo ha sido activado.")
        onSuccess(cultivo._id)
        onClose()
      }
    } catch (err) {
      console.error("Error al verificar clave de acceso:", err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <MdClose className="text-xl" />
        </button>

        {/* Encabezado e Icono */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner">
            <MdKey />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Clave de Acceso Requerida</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Para gestionar el cultivo <strong className="text-slate-800 capitalize">"{cultivo.nombreCultivo}"</strong>, ingresa la clave de acceso enviada a tu correo electrónico.
          </p>
        </div>

        {/* Formulario de Clave */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Clave de acceso de tu cultivo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MdLock className="text-lg" />
              </div>
              <input
                type="text"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Ejemplo: 8K9F2A"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 text-slate-900 text-sm font-semibold tracking-widest uppercase rounded-xl transition-all outline-none"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {cargando ? (
                <span>Verificando...</span>
              ) : (
                <>
                  <MdCheckCircle className="text-base" /> Verificar y Entrar
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
