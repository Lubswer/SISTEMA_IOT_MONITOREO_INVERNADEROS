import { useFetch } from "../../hooks/useFetch"
import { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import CardCultivo from "./CardCultivo"

const Table = () => {
    const { fetchDataBackend } = useFetch()
    const [cultivos, setCultivos] = useState([])
    const [cargando, setCargando] = useState(true)

    const getHeaders = () => {
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser?.state?.token}`,
        }
    }

    // ── Listar cultivos ──────────────────────────────────────────
    const listCultivos = async () => {
        setCargando(true)
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/cultivos`
            const response = await fetchDataBackend(url, null, "GET", getHeaders())
            setCultivos(response || [])
        } catch (err) {
            console.error("Error al cargar cultivos:", err)
        } finally {
            setCargando(false)
        }
    }

    // ── Eliminar / Dar salida a cultivo ───────────────────────────
    const deleteCultivo = async (id) => {
        const confirmDelete = confirm("¿Estás seguro de dar salida / eliminar este cultivo?")
        if (!confirmDelete) return

        const url = `${import.meta.env.VITE_BACKEND_URL}/cultivo/eliminar/${id}`
        const response = await fetchDataBackend(url, null, "DELETE", getHeaders())

        if (response) {
            // Quita el cultivo de la vista sin recargar la página
            setCultivos(prev => prev.filter(cultivo => cultivo._id !== id))
        }
    }

    useEffect(() => {
        listCultivos()
    }, [])

    // ── Filtrado Robusto en la lista ────────────────────────────
    // Se muestran todos los cultivos que no cuentan con fechaSalidaCultivo establecida
    const cultivosVisibles = cultivos.filter(cultivo => {
        const tieneFechaSalida = Boolean(
            cultivo?.fechaSalidaCultivo &&
            cultivo.fechaSalidaCultivo !== null &&
            cultivo.fechaSalidaCultivo !== "null" &&
            cultivo.fechaSalidaCultivo !== "" &&
            cultivo.fechaSalidaCultivo !== undefined
        )

        return !tieneFechaSalida
    })

    if (cargando) {
        return (
            <div className="text-center py-16 text-slate-400 font-semibold animate-pulse">
                Cargando cultivos...
            </div>
        )
    }

    if (cultivosVisibles.length === 0) {
        return (
            <>
                <ToastContainer />
                <div className="bg-white rounded-2xl p-10 border-2 border-black shadow-md text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
                        🌱
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No hay cultivos registrados en proceso</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Todos los cultivos registrados cuentan con fecha de salida establecida.
                    </p>
                </div>
            </>
        )
    }

    return (
        <div className="space-y-6">
            <ToastContainer />

            {/* Grid de Cards de Cultivos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cultivosVisibles.map((cultivo) => (
                    <CardCultivo
                        key={cultivo._id}
                        cultivo={cultivo}
                        onDelete={deleteCultivo}
                    />
                ))}
            </div>
        </div>
    )
}

export default Table
