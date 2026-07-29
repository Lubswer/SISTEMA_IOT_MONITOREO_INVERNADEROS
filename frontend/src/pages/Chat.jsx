import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import storeProfile from "../context/storeProfile"
import { useFetch } from "../hooks/useFetch"
import { MdSend, MdSupportAgent, MdSmartToy, MdOutlineQuestionAnswer, MdAutoAwesome } from "react-icons/md"

const getSocketUrl = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL
    if (envUrl && envUrl.includes("http")) {
        return envUrl.replace(/\/api\/?$/, "")
    }
    return "https://gplantita.chilecentral.cloudapp.azure.com"
}
const SOCKET_SERVER_URL = getSocketUrl()

const Chat = () => {
    const { user } = storeProfile()
    const { fetchDataBackend } = useFetch()

    // ── ESTADOS DEL CHAT DE SOPORTE TÉCNICO (IZQUIERDA - ADMIN SOCKET.IO) ──
    const [socket, setSocket] = useState(null)
    const [mensajeSoporte, setMensajeSoporte] = useState("")
    const [mensajesSoporte, setMensajesSoporte] = useState([])
    const soporteEndRef = useRef(null)

    // ── ESTADOS DEL CHAT DE IA (DERECHA - ASISTENTE BACKEND GROQ) ────────
    const [mensajeIA, setMensajeIA] = useState("")
    const [mensajesIA, setMensajesIA] = useState([
        {
            id: "ia-welcome",
            emisorRol: "ia",
            mensaje: "¡Hola! Soy tu asistente de Inteligencia Artificial GreenHOUSE 🌿. ¿En qué puedo ayudarte hoy sobre tus cultivos, el sistema o recomendaciones agrícolas?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [cargandoIA, setCargandoIA] = useState(false)
    const iaEndRef = useRef(null)

    const getHeaders = () => {
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser?.state?.token}`,
        }
    }

    // Scroll automático
    const scrollToBottomSoporte = () => soporteEndRef.current?.scrollIntoView({ behavior: "smooth" })
    const scrollToBottomIA = () => iaEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Conexión Socket.IO para Soporte
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL)
        setSocket(newSocket)

        newSocket.on("enviar-mensaje-front-back", (payload) => {
            if (payload.chatRoomId === user?._id || payload.emisorRol === "admin") {
                setMensajesSoporte(prev => [...prev, payload])
            }
        })

        return () => {
            newSocket.disconnect()
        }
    }, [user])

    useEffect(() => {
        scrollToBottomSoporte()
    }, [mensajesSoporte])

    useEffect(() => {
        scrollToBottomIA()
    }, [mensajesIA])

    // Enviar mensaje al Administrador (Soporte)
    const handleEnviarSoporte = (e) => {
        e.preventDefault()
        if (!mensajeSoporte.trim() || !socket || !user) return

        const nuevoPayload = {
            id: Date.now().toString(),
            emisorId: user._id,
            emisorNombre: `${user.nombre || 'Usuario'} ${user.apellido || ''}`.trim(),
            emisorAvatar: user.avatar || null,
            emisorRol: user.rol || "usuario",
            mensaje: mensajeSoporte.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            chatRoomId: user._id
        }

        setMensajesSoporte(prev => [...prev, nuevoPayload])
        socket.emit("enviar-mensaje-front-back", nuevoPayload)
        setMensajeSoporte("")
    }

    // Enviar mensaje a la IA
    const handleEnviarIA = async (e) => {
        e.preventDefault()
        if (!mensajeIA.trim() || cargandoIA) return

        const userMsgText = mensajeIA.trim()
        const userMsgObj = {
            id: Date.now().toString(),
            emisorRol: "user",
            mensaje: userMsgText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMensajesIA(prev => [...prev, userMsgObj])
        setMensajeIA("")
        setCargandoIA(true)

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/ia/chat`
            const res = await fetchDataBackend(url, { mensaje: userMsgText }, "POST", getHeaders())

            const iaMsgObj = {
                id: (Date.now() + 1).toString(),
                emisorRol: "ia",
                mensaje: res?.respuesta || "No pude obtener una respuesta en este momento.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMensajesIA(prev => [...prev, iaMsgObj])
        } catch (error) {
            console.error(error)
            setMensajesIA(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                emisorRol: "ia",
                mensaje: "Ocurrió un error al consultar con el servicio de IA.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
        } finally {
            setCargandoIA(false)
        }
    }

    // Formateador de texto para renderizar negritas **texto** como etiquetas HTML limpias
    const renderFormattedMessage = (text) => {
        if (!text) return ""
        const parts = text.split(/(\*\*.*?\*\*)/g)
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
            }
            return part
        })
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div>
                <h1 className="font-black text-2xl text-gray-700">Centro de Asistencia GreenHOUSE</h1>
                <hr className="my-3 border-t-2 border-gray-300" />
                <p className="text-xs text-slate-500 font-medium">
                    Consulta con nuestro soporte técnico administrado o realiza preguntas al asistente virtual inteligente.
                </p>
            </div>

            {/* Layout de 2 Columnas: Soporte Técnico (Izq) y Chat IA (Der) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── COLUMNA IZQUIERDA: CHAT DE SOPORTE TÉCNICO (ADMINISTRADOR) ── */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[560px] overflow-hidden">
                    
                    {/* Header Soporte */}
                    <div className="p-4 bg-gray-500 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-xl text-black shadow-xs">
                                <MdSupportAgent className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold leading-tight">Soporte Técnico (Admin)</h3>
                                <p className="text-[11px] text-gray-100 font-medium">Atención directa con administradores</p>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold bg-gray-600 text-gray-100 px-2.5 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                            Soporte Activo
                        </span>
                    </div>

                    {/* Mensajes Soporte */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                        {mensajesSoporte.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                                <MdOutlineQuestionAnswer className="text-4xl text-slate-300" />
                                <p className="text-xs font-semibold">¿Necesitas ayuda técnica?</p>
                                <p className="text-[11px] text-center max-w-xs">Escribe un mensaje para conectarte en tiempo real con un Administrador.</p>
                            </div>
                        ) : (
                            mensajesSoporte.map(msg => {
                                const esMio = msg.emisorId === user?._id
                                return (
                                    <div key={msg.id} className={`flex flex-col ${esMio ? "items-end" : "items-start"}`}>
                                        <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                                            {esMio ? "Tú" : (msg.emisorNombre || "Administrador")} • {msg.timestamp}
                                        </span>
                                        <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs font-medium shadow-2xs ${
                                            esMio ? "bg-emerald-600 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                                        }`}>
                                            {renderFormattedMessage(msg.mensaje)}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={soporteEndRef} />
                    </div>

                    {/* Formulario Soporte */}
                    <form onSubmit={handleEnviarSoporte} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={mensajeSoporte}
                            onChange={(e) => setMensajeSoporte(e.target.value)}
                            placeholder="Escribe al administrador..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!mensajeSoporte.trim()}
                            className="bg-gray-600 hover:bg-gray-800  text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                            <span>Enviar</span>
                            <MdSend className="text-sm" />
                        </button>
                    </form>
                </div>

                {/* ── COLUMNA DERECHA: CHAT CON INTELIGENCIA ARTIFICIAL (IA) ── */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[560px] overflow-hidden">
                    
                    {/* Header IA */}
                    <div className="p-4 bg-gray-500 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-900/60 rounded-xl text-gray-200 shadow-xs border border-gray-500/30">
                                <MdSmartToy className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                                    <span>Asistente IA GreenHOUSE</span>
                                    
                                </h3>
                                <p className="text-[11px] text-gray-100 font-medium">Respuestas instantáneas sobre el sistema y cultivos</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase bg-gray-600 text-green-300 border border-gray-500 px-2.5 py-1 rounded-full tracking-wider">
                            IA Activa
                        </span>
                    </div>

                    {/* Mensajes IA */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                        {mensajesIA.map(msg => {
                            const esIA = msg.emisorRol === "ia"
                            return (
                                <div key={msg.id} className={`flex flex-col ${esIA ? "items-start" : "items-end"}`}>
                                    <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                                        {esIA ? "🤖 Asistente IA" : "Tú"} • {msg.timestamp}
                                    </span>
                                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs font-medium shadow-2xs whitespace-pre-line leading-relaxed ${
                                        esIA ? "bg-white text-slate-800 border border-slate-200 rounded-bl-none" : "bg-emerald-700 text-white rounded-br-none"
                                    }`}>
                                        {renderFormattedMessage(msg.mensaje)}
                                    </div>
                                </div>
                            )
                        })}
                        {cargandoIA && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 p-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                                <span>IA pensando respuesta...</span>
                            </div>
                        )}
                        <div ref={iaEndRef} />
                    </div>

                    {/* Formulario IA */}
                    <form onSubmit={handleEnviarIA} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={mensajeIA}
                            onChange={(e) => setMensajeIA(e.target.value)}
                            placeholder="Pregunta algo sobre tu cultivo o el sistema..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                            disabled={cargandoIA}
                        />
                        <button
                            type="submit"
                            disabled={!mensajeIA.trim() || cargandoIA}
                            className="bg-gray-600 hover:bg-gray-800  text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer "
                        >
                            <span>Preguntar</span>
                            <MdSend className="text-sm" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Chat
