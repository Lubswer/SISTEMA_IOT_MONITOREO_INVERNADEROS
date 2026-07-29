import storeProfile from "../../context/storeProfile"
import { MdPerson, MdEmail, MdAdminPanelSettings, MdPhone, MdLocationOn, MdVerifiedUser } from "react-icons/md"

export const CardProfile = () => {
    const { user } = storeProfile()
    const esAdmin = user?.rol === "admin"

    if (esAdmin) {
        return (
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Información del Administrador */}
                    <div className="space-y-4 w-full">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                {user?.nombre}
                            </h3>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60 mt-1.5">
                                <MdAdminPanelSettings className="text-sm" /> Administrador del Sistema
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                                <MdPerson className="text-emerald-700 text-xl flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre del Administrador</p>
                                    <p className="font-bold text-slate-800 text-sm">{user?.nombre}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                                <MdEmail className="text-emerald-700 text-xl flex-shrink-0" />
                                <div className="truncate">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</p>
                                    <p className="font-bold text-slate-800 text-sm truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* A la izquierda: Información del Usuario */}
                <div className="md:col-span-8 space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                            {user?.nombre} {user?.apellido}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60 mt-1.5">
                            <MdVerifiedUser className="text-sm" /> Usuario Registrado
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <MdPerson className="text-emerald-700 text-lg flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</p>
                                <p className="font-bold text-slate-800 text-sm">{user?.nombre} {user?.apellido}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <MdEmail className="text-emerald-700 text-lg flex-shrink-0" />
                            <div className="truncate">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</p>
                                <p className="font-bold text-slate-800 text-xs truncate">{user?.email || "No especificado"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <MdPhone className="text-emerald-700 text-lg flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono / Celular</p>
                                <p className="font-bold text-slate-800 text-xs">{user?.celular || "No especificado"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            <MdLocationOn className="text-emerald-700 text-lg flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección / Invernadero</p>
                                <p className="font-bold text-slate-800 text-xs">{user?.direccion || "No especificada"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* A la derecha: Foto del Usuario más grande */}
                <div className="md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={`Foto de ${user?.nombre}`}
                            className="w-40 h-40 md:w-44 md:h-44 rounded-2xl object-cover shadow-md"
                        />
                    ) : (
                        <div className="w-40 h-40 md:w-44 md:h-44 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-4xl font-bold shadow-inner">
                            {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}