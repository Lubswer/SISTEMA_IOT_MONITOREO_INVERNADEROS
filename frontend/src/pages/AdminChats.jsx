import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import storeProfile from "../context/storeProfile"
import { MdSend, MdQuestionAnswer, MdPerson, MdChat } from "react-icons/md"

const getSocketUrl = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL
    if (envUrl && envUrl.includes("http")) {
        return envUrl.replace(/\/api\/?$/, "")
    }
    return "https://gplantita.chilecentral.cloudapp.azure.com"
}
const SOCKET_SERVER_URL = getSocketUrl()

const AdminChats = () => {
    const { user: adminUser } = storeProfile()
    const [socket, setSocket] = useState(null)
    const [chatsMap, setChatsMap] = useState({}) // { [chatRoomId]: { user: {...}, mensajes: [...] } }
    const [activeChatId, setActiveChatId] = useState(null)
    const [mensajeRespuesta, setMensajeRespuesta] = useState("")
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL)
        setSocket(newSocket)

        newSocket.on("enviar-mensaje-front-back", (payload) => {
            const roomId = payload.chatRoomId || payload.emisorId

            setChatsMap(prev => {
                const chatExistente = prev[roomId] || {
                    user: {
                        id: payload.emisorId,
                        nombre: payload.emisorNombre || "Usuario",
                        avatar: payload.emisorAvatar || null
                    },
                    mensajes: []
                }

                // Si el mensaje es emitido por el admin, actualizar solo mensajes
                const personaNombre = payload.emisorRol === "admin"
                    ? (chatExistente.user.nombre || "Usuario")
                    : (payload.emisorNombre || "Usuario")

                const updatedUser = {
                    ...chatExistente.user,
                    nombre: payload.emisorRol === "admin" ? chatExistente.user.nombre : personaNombre,
                    avatar: payload.emisorAvatar || chatExistente.user.avatar
                }

                return {
                    ...prev,
                    [roomId]: {
                        user: updatedUser,
                        mensajes: [...chatExistente.mensajes, payload]
                    }
                }
            })

            // Seleccionar automáticamente como activo el primer chat que llegue si no hay ninguno seleccionado
            setActiveChatId(prev => prev || roomId)
        })

        return () => {
            newSocket.disconnect()
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [chatsMap, activeChatId])

    const handleEnviarRespuesta = (e) => {
        e.preventDefault()
        if (!mensajeRespuesta.trim() || !socket || !activeChatId || !adminUser) return

        const nuevoPayload = {
            id: Date.now().toString(),
            emisorId: adminUser._id,
            emisorNombre: `${adminUser.nombre || 'Administrador'}`,
            emisorAvatar: adminUser.avatar || null,
            emisorRol: "admin",
            mensaje: mensajeRespuesta.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            chatRoomId: activeChatId
        }

        // Agregar localmente al estado del admin
        setChatsMap(prev => {
            const chatExistente = prev[activeChatId]
            if (!chatExistente) return prev
            return {
                ...prev,
                [activeChatId]: {
                    ...chatExistente,
                    mensajes: [...chatExistente.mensajes, nuevoPayload]
                }
            }
        })

        // Emitir al backend
        socket.emit("enviar-mensaje-front-back", nuevoPayload)

        setMensajeRespuesta("")
    }

    const chatsList = Object.keys(chatsMap).map(key => ({
        roomId: key,
        ...chatsMap[key]
    }))

    const activeChat = activeChatId ? chatsMap[activeChatId] : null

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            
            {/* Header Admin Chats */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shadow-xs">
                        <MdChat className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Panel de Chats y Consultas de Usuarios</h2>
                        <p className="text-xs text-slate-500 font-medium">Gestiona y responde las solicitudes enviadas por los usuarios registrados en tiempo real.</p>
                    </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Chats Activos: {chatsList.length}
                </span>
            </div>

            {/* Layout de 2 Columnas para Administrador */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[560px] bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                
                {/* Columna Izquierda: Lista de Usuarios con Chats */}
                <div className="md:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
                    <div className="p-3.5 border-b border-slate-200/80 bg-white">
                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Conversaciones</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {chatsList.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 space-y-2">
                                <p className="text-xs font-semibold">Esperando consultas...</p>
                                <p className="text-[11px]">Los usuarios que inicien conversación aparecerán aquí en tiempo real.</p>
                            </div>
                        ) : (
                            chatsList.map(chat => {
                                const ultimoMensaje = chat.mensajes[chat.mensajes.length - 1]
                                const isSelected = chat.roomId === activeChatId
                                return (
                                    <button
                                        key={chat.roomId}
                                        type="button"
                                        onClick={() => setActiveChatId(chat.roomId)}
                                        className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                                            isSelected ? "bg-emerald-50 border-l-4 border-emerald-600" : "hover:bg-slate-100/80"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
                                            {chat.user?.avatar ? (
                                                <img src={chat.user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <MdPerson className="text-xl" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className="text-xs font-bold text-slate-800 truncate">{chat.user?.nombre || "Usuario"}</p>
                                                <span className="text-[10px] text-slate-400 font-semibold">{ultimoMensaje?.timestamp}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5">
                                                {ultimoMensaje?.mensaje || "Sin mensajes"}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Conversación Activa */}
                <div className="md:col-span-8 flex flex-col h-full bg-white">
                    {activeChat ? (
                        <>
                            {/* Cabecera del chat activo */}
                            <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/50 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                    {activeChat.user?.nombre?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">{activeChat.user?.nombre}</h4>
                                    <span className="text-[10px] font-semibold text-emerald-700">Consulta de Usuario Activa</span>
                                </div>
                            </div>

                            {/* Mensajes del chat activo */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                                {activeChat.mensajes.map(msg => {
                                    const esAdmin = msg.emisorRol === "admin"
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${esAdmin ? "items-end" : "items-start"}`}
                                        >
                                            <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                                                {esAdmin ? "Tú (Administrador)" : msg.emisorNombre} • {msg.timestamp}
                                            </span>
                                            <div
                                                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium shadow-xs leading-relaxed ${
                                                    esAdmin
                                                        ? "bg-emerald-700 text-white rounded-br-none"
                                                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                                                }`}
                                            >
                                                {msg.mensaje}
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Formulario de Respuesta del Admin */}
                            <form onSubmit={handleEnviarRespuesta} className="p-3 border-t border-slate-200/80 flex items-center gap-3 bg-white">
                                <input
                                    type="text"
                                    value={mensajeRespuesta}
                                    onChange={(e) => setMensajeRespuesta(e.target.value)}
                                    placeholder={`Responder a ${activeChat.user?.nombre}...`}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={!mensajeRespuesta.trim()}
                                    className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Responder</span>
                                    <MdSend className="text-sm" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 p-6">
                            <MdQuestionAnswer className="text-5xl text-slate-200" />
                            <p className="text-sm font-semibold">Selecciona una conversación</p>
                            <p className="text-xs">Elige un chat de la lista de la izquierda para comenzar a responder.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default AdminChats
