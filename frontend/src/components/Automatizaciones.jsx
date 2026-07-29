import { useState, useEffect } from "react"
import { useFetch } from "../hooks/useFetch"
import storeProfile from "../context/storeProfile"
import { MdSchedule, MdPlaylistAddCheck } from "react-icons/md"
import axios from "axios"

export default function Automatizaciones() {
  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all duration-200";

  const { fetchDataBackend } = useFetch()

  // ── Estados del Formulario y Mensaje ───────────────────────────
  const [form, setForm] = useState({
    nombreActividad: "Riego Automático",
    nombreCultivo: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: "08:00",
    descripcion: ""
  })

  const [actividades, setActividades] = useState([])
  const [misCultivos, setMisCultivos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const getHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser?.state?.token}`,
    }
  }

  // ── Cargar Actividades del Usuario ─────────────────────────────
  const obtenerPerfilYActividades = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/perfil`
      const res = await fetchDataBackend(url, null, "GET", getHeaders())
      if (res?.actividades) {
        setActividades(res.actividades.slice().reverse())
      }
    } catch (err) {
      console.error("Error al cargar actividades:", err)
    }
  }

  // ── Cargar Cultivos Activos del Usuario ────────────────────────
  const obtenerCultivosActivos = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cultivos`
      const res = await fetchDataBackend(url, null, "GET", getHeaders())
      const activos = (res || []).filter(c => {
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
      setMisCultivos(activos)
    } catch (err) {
      console.error("Error al cargar cultivos activos:", err)
    }
  }

  const { user } = storeProfile()

  useEffect(() => {
    if (user?.rol !== "admin") {
      obtenerPerfilYActividades()
      obtenerCultivosActivos()
    }
  }, [user])

  // ── Manejar cambios en el formulario ───────────────────────────
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ── Cambiar Estado de Actividad (Pendiente / Concluida) Silencioso ────────
  const handleCambiarEstado = async (idActividad, nuevoEstado) => {
    if (!idActividad) return

    // Actualizar estado local inmediatamente sin toasts ni alertas
    setActividades(prev =>
      prev.map(act => (act._id === idActividad ? { ...act, estado: nuevoEstado } : act))
    )

    try {
      const storedUser = JSON.parse(localStorage.getItem("auth-token"))
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/actividad/estado`
      await axios.put(
        url,
        { idActividad, estado: nuevoEstado },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser?.state?.token}`,
          }
        }
      )
    } catch (err) {
      console.error("Error al actualizar estado de la actividad:", err)
    }
  }

  // ── Enviar Formulario al Backend ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje(null)

    if (!form.nombreActividad || !form.nombreCultivo || !form.fecha || !form.hora) {
      setMensaje({ tipo: "error", texto: "Por favor completa todos los campos requeridos." })
      return
    }

    setCargando(true)
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/actividad`
      const payload = {
        nombreActividad: form.nombreActividad,
        nombreCultivo: form.nombreCultivo,
        fecha: form.fecha,
        hora: form.hora,
        estado: "Pendiente",
        descripcion: form.descripcion
      }

      const res = await fetchDataBackend(url, payload, "POST", getHeaders())

      if (res?.actividad) {
        setMensaje({ tipo: "exito", texto: res.msg || "Actividad registrada con éxito." })
        // Agregar la nueva actividad al inicio de la lista local
        setActividades(prev => [res.actividad, ...prev])
        // Reiniciar campos opcionales del formulario
        setForm(prev => ({
          ...prev,
          nombreCultivo: "",
          descripcion: ""
        }))
      } else if (res?.msg) {
        setMensaje({ tipo: "error", texto: res.msg })
      }
    } catch (err) {
      console.error("Error al registrar actividad:", err)
      setMensaje({ tipo: "error", texto: "Ocurrió un error al conectar con el servidor." })
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">

      {/* Formulario: Programar Actividad */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <MdSchedule className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Programar Nueva Actividad</h2>
          </div>
        </div>

        {mensaje && (
          <div className={`p-3 text-xs font-bold rounded-xl ${mensaje.tipo === "exito" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}>
            {mensaje.texto}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombreActividad" className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nombre de la Actividad</label>
            <input
              id="nombreActividad"
              name="nombreActividad"
              value={form.nombreActividad}
              onChange={handleChange}
              className={inputCls}
              placeholder="Ej. Riego Automático, Fertilización..."
              required
            />
          </div>

          <div>
            <label htmlFor="nombreCultivo" className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Nombre del Cultivo</label>
            {misCultivos.length > 0 ? (
              <select
                id="nombreCultivo"
                name="nombreCultivo"
                value={form.nombreCultivo}
                onChange={handleChange}
                className={inputCls}
                required
              >
                <option value="">-- Selecciona un cultivo activo --</option>
                {misCultivos.map((cultivo) => (
                  <option key={cultivo._id} value={cultivo.nombreCultivo}>
                    🌱 {cultivo.nombreCultivo} {cultivo.tipoPlanta ? `(${cultivo.tipoPlanta})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="nombreCultivo"
                name="nombreCultivo"
                value={form.nombreCultivo}
                onChange={handleChange}
                className={inputCls}
                placeholder="Ej. Tomate Cherry, Lechuga Romana"
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fecha" className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Fecha</label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label htmlFor="hora" className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Hora</label>
              <input
                id="hora"
                name="hora"
                type="time"
                value={form.hora}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Descripción / Notas</label>
            <input
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className={inputCls}
              placeholder="Ej. Incluye 200ml de nutrientes líquidos..."
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold rounded-xl py-3 text-sm shadow-md shadow-emerald-900/20 transition-all duration-200 active:scale-[0.99] mt-2 cursor-pointer"
          >
            {cargando ? "Guardando..." : "Guardar "}
          </button>
        </form>
      </div>

      {/* Lista de Actividades Registradas del Usuario */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
        <div>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MdPlaylistAddCheck className="text-emerald-600 text-xl" />
              Mis Actividades
            </h2>
          </div>

          {actividades.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <p className="text-sm font-semibold">No tienes actividades registradas aún</p>
              <p className="text-xs">Usa el formulario para agregar tu primera programación.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 mt-3 space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {actividades.map((act, index) => {
                const esConcluida = act.estado === "Concluida" || act.estado === "Completado"
                return (
                  <li key={act._id || index} className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-xl transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{act.hora}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          {act.nombreCultivo}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-mono">{act.fecha}</span>
                      </div>
                      <p className="text-xs text-slate-800 font-bold">{act.nombreActividad}</p>
                      {act.descripcion && (
                        <p className="text-xs text-slate-500 font-medium">{act.descripcion}</p>
                      )}
                    </div>

                    {/* Selector de Estado interactivo (Pendiente / Concluida) */}
                    <select
                      value={esConcluida ? "Concluida" : "Pendiente"}
                      onChange={(e) => handleCambiarEstado(act._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-all ${
                        esConcluida
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300 focus:ring-2 focus:ring-emerald-400"
                          : "bg-amber-100 text-amber-800 border-amber-300 focus:ring-2 focus:ring-amber-400"
                      }`}
                    >
                      <option value="Pendiente">⏳ Pendiente</option>
                      <option value="Concluida">✅ Concluida</option>
                    </select>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
         
        </div>
      </div>

    </section>
  )
}
