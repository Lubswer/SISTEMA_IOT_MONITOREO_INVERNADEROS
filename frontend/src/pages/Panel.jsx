import { useClima } from "../hooks/useClima"
import { useFetch } from "../hooks/useFetch"
import storeProfile from "../context/storeProfile"
import Carousel from "../components/Carousel"
import Automatizaciones from "../components/Automatizaciones"
import { GiSprout, GiWateringCan } from "react-icons/gi"
import { WiThermometer, WiRain } from "react-icons/wi"
import { useEffect, useState } from "react"
import { Navigate } from "react-router"

const DEFAULT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80'
]

export default function Panel() {
  // ── TODOS LOS HOOKS VAN AL INICIO (REGLA FUNDAMENTAL DE REACT) ─────
  const { user } = storeProfile()
  const { fetchDataBackend } = useFetch()
  const [cultivosActivos, setCultivosActivos] = useState([])
  const [cargandoCultivos, setCargandoCultivos] = useState(true)
  const [actividadesHoy, setActividadesHoy] = useState(0)

  const latitud = user?.latitud ?? -0.2251
  const longitud = user?.longitud ?? -78.5123
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
  const { clima, cargando: cargandoClima } = useClima(latitud, longitud, API_KEY)

  const getHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser?.state?.token}`,
    }
  }

  const listCultivosActivos = async () => {
    if (user?.rol === "admin") return
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cultivos`
      const response = await fetchDataBackend(url, null, "GET", getHeaders())
      const activos = (response || []).filter(c => {
        const tieneFechaSalida = Boolean(
          c?.fechaSalidaCultivo &&
          c.fechaSalidaCultivo !== null &&
          c.fechaSalidaCultivo !== "null" &&
          c.fechaSalidaCultivo !== "" &&
          c.fechaSalidaCultivo !== undefined
        )
        const esActivo = c?.estadoCultivo === true || c?.estadoCultivo === "true"
        return esActivo && !tieneFechaSalida
      })
      setCultivosActivos(activos)
    } catch (err) {
      console.error("Error al cargar cultivos en el panel:", err)
    } finally {
      setCargandoCultivos(false)
    }
  }

  const obtenerActividadesHoy = async () => {
    if (user?.rol === "admin") return
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/perfil`
      const res = await fetchDataBackend(url, null, "GET", getHeaders())
      if (res?.actividades) {
        // Filtrar o contar actividades
        setActividadesHoy(res.actividades.length)
      }
    } catch (err) {
      console.error("Error al obtener actividades:", err)
    }
  }

  useEffect(() => {
    if (user?.rol !== "admin") {
      listCultivosActivos()
      obtenerActividadesHoy()
    }
  }, [user])

  // ── REDIRECCIÓN CONDICIONAL SI ES ADMINISTRADOR (DESPUÉS DE HOOKS) ──
  if (user?.rol === "admin") {
    return <Navigate to="/dashboard/chats" replace />
  }

  // Mapear cultivos reales para el carrusel
  const carouselItems = cultivosActivos.map((cultivo, idx) => ({
    id: cultivo._id || idx,
    title: cultivo.nombreCultivo,
    description: `${cultivo.tipoPlanta || 'Cultivo activo'} — Cantidad: ${cultivo.cantidad || 1}`,
    image: cultivo.avatarCultivo || DEFAULT_FALLBACK_IMAGES[idx % DEFAULT_FALLBACK_IMAGES.length],
    icon: <GiSprout className="h-4 w-4 text-white" />
  }))

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Sección Superior: Métricas (Vertical) + Carrusel de Fotos Reales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* ── COLUMNA IZQUIERDA: Métricas Rectangulares Verticales ── */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
          <div>
            <h1 className='font-black text-2xl text-gray-700'>Métricas Generales</h1>
            <hr className='my-3 border-t-2 border-gray-300' />
          </div>

          {/* Lista Vertical de las 4 Métricas Idénticas a la Imagen */}
          <div className="flex flex-col gap-3.5 flex-1">

            {/* 1. Cultivos Activos */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                  <GiSprout />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Cultivos Activos</p>
                  <p className="text-[11px] font-semibold text-emerald-600">
                    {cargandoCultivos ? 'Cargando...' : `${cultivosActivos.length} cultivos registrados`}
                  </p>
                </div>
              </div>

              <span className="text-2xl font-black text-slate-800 pr-2">
                {cultivosActivos.length}
              </span>
            </div>

            {/* 2. Actividades para hoy */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100/90 text-cyan-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                  <GiWateringCan />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Actividades para hoy</p>
                  <p className="text-[11px] font-semibold text-cyan-600">
                    Programadas para la jornada
                  </p>
                </div>
              </div>

              <span className="text-2xl font-black text-slate-800 pr-2">
                {actividadesHoy}
              </span>
            </div>

            {/* 3. Temperatura Clima */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/90 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                  <WiThermometer className="text-3xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Temperatura Clima</p>
                  <p className="text-[11px] font-semibold text-slate-400 capitalize">
                    {cargandoClima ? 'Cargando...' : (clima?.descripcion || 'Nublado')}
                  </p>
                </div>
              </div>

              <span className="text-2xl font-black text-slate-800 pr-2">
                {cargandoClima ? '--' : `${clima?.temperatura ?? 11.6}°C`}
              </span>
            </div>

            {/* 4. Probabilidad de Lluvia */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100/90 text-blue-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                  <WiRain className="text-3xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Probabilidad de Lluvia</p>
                  <p className="text-[11px] font-semibold text-blue-600">
                    {(clima?.probLluvia ?? 22) > 40 ? 'Alta probabilidad de lluvia' : 'Baja probabilidad de lluvia'}
                  </p>
                </div>
              </div>

              <span className="text-2xl font-black text-slate-800 pr-2">
                {cargandoClima ? '--' : `${clima?.probLluvia ?? 22}%`}
              </span>
            </div>

          </div>
        </div>

        {/* ── COLUMNA DERECHA: Carrusel de Fotos Reales de los Cultivos ── */}
        <div className="lg:col-span-5 flex flex-col">
          <div>
            <h1 className='font-black text-2xl text-gray-700 flex items-center gap-2'>
              <span>Vista previa de tus cultivos</span>
            </h1>
            <hr className='my-3 border-t-2 border-gray-300' />
          </div>

          <div className="w-full flex-1 flex items-center justify-center py-2">
            {carouselItems.length > 0 ? (
              <Carousel items={carouselItems} autoplay={true} autoplayDelay={1700} loop={true} />
            ) : (
              <div className="w-full h-64 rounded-2xl bg-white border border-slate-200/80 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                <GiSprout className="text-4xl text-slate-300 mb-2" />
                <p className="text-xs font-bold">No hay cultivos activos para mostrar</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sección Inferior: Automatizaciones y Actividades */}
      <Automatizaciones />

    </div>
  )
}
