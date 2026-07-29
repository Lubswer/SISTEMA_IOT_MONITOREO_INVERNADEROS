import { Link, Outlet, useLocation } from 'react-router'
import storeAuth from '../context/storeAuth'
import storeProfile from '../context/storeProfile'
import { MdDashboard, MdPerson, MdAddCircleOutline, MdNotificationsActive, MdLogout, MdChat } from "react-icons/md"
import { TbPlant2 } from "react-icons/tb"

const Dashboard = () => {
    const location = useLocation()
    const urlActual = location.pathname
    const { clearToken } = storeAuth()
    const { user } = storeProfile()

    const esAdmin = user?.rol === "admin"

    const navItems = esAdmin
        ? [
            { path: '/dashboard/profile', label: 'Perfil', icon: MdPerson },
            { path: '/dashboard/chats', label: 'Chats', icon: MdChat },
          ]
        : [
            { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
            { path: '/dashboard/profile', label: 'Perfil', icon: MdPerson },
            { path: '/dashboard/list', label: 'Cultivos', icon: TbPlant2 },
            { path: '/dashboard/create', label: 'Registrar', icon: MdAddCircleOutline },
            { path: '/dashboard/chat', label: 'Asistencia', icon: MdNotificationsActive },
          ]

    return (
        <div className='min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col'>

            {/* Menú de navegación superior horizontal (Sin fondo verde completo) */}
            <header className='bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 md:px-8 py-3.5'>
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>

                    {/* Logo & Usuario Badge */}
                    <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-start'>
                        <div className='flex items-center gap-2.5'>
                            <div>
                                <h1 className='text-3xl font-black tracking-tight text-slate-900 leading-none'>
                                    Green<span className='text-emerald-600'>HOUSE</span>
                                </h1>

                            </div>
                        </div>

                        {/* Botón Salir Móvil */}
                        <Link
                            to='/'
                            onClick={() => clearToken()}
                            className="md:hidden flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 px-3 py-1.5 rounded-xl transition-all"
                        >
                            <MdLogout className='text-sm' />
                            <span>Salir</span>
                        </Link>
                    </div>

                    {/* Botones de Navegación Horizontal con fondo verde suave */}
                    <nav className='flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none justify-start md:justify-center'>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = urlActual === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                                        isActive
                                            ? 'bg-emerald-600 text-white border border-emerald-600 shadow-md shadow-emerald-900/15'
                                            : 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 hover:border-emerald-300'
                                    }`}
                                >
                                    <Icon className={`text-base sm:text-lg ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Perfil & Salir (Escritorio) */}
                    <div className='hidden md:flex items-center gap-3'>
                        <div className='flex items-center gap-2.5 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/80'>
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={`Foto de ${user?.nombre}`}
                                    className="w-7 h-7 rounded-lg object-cover border  shadow-xs"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                    {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className='text-left'>
                                <p className='text-xs font-bold text-slate-800 leading-tight'>
                                    {user?.nombre} {user?.apellido}
                                </p>
                                <p className='text-[10px] text-emerald-700 font-semibold capitalize'>
                                    {user?.rol || 'Usuario'}
                                </p>
                            </div>
                        </div>

                        <Link
                            to='/'
                            onClick={() => clearToken()}
                            className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 px-3.5 py-2 rounded-xl transition-all duration-200 shadow-xs"
                        >
                            <MdLogout className='text-sm' />
                            <span>Salir</span>
                        </Link>
                    </div>

                </div>
            </header>

            {/* Contenido Dinámico de las Páginas */}
            <main className='flex-1 max-w-7xl w-full mx-auto p-4 md:p-8'>
                <Outlet />
            </main>

            {/* Footer Inferior */}
            <footer className='bg-white border-t border-slate-200 py-3.5 text-center text-xs text-slate-500 font-semibold'>
                GreenHOUSE Platform © {new Date().getFullYear()} — Todos los derechos reservados
            </footer>

        </div>
    )
}

export default Dashboard
