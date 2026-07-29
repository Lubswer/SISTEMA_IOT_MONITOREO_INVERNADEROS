import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import { CardProfileOwner } from '../components/profile/CardProfileOwner'
import FormProfile from '../components/profile/FormProfile'
import storeProfile from '../context/storeProfile'
import { ToastContainer } from 'react-toastify'

const Profile = () => {
    const { user } = storeProfile()

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <ToastContainer autoClose={3000} />
            <div>
                <h1 className='font-black text-2xl text-gray-700'>Perfil de Usuario</h1>
                <hr className='my-3 border-t-2 border-gray-300' />
                <p className='text-xs text-slate-500 font-medium'>
                    Gestiona tu información personal y los parámetros de seguridad de tu cuenta.
                </p>
            </div>

            {user?.rol === "cultivo" ? (
                /* Propietario del cultivo → solo muestra su tarjeta de datos */
                <div className='flex justify-center'>
                    <div className='w-full max-w-lg'>
                        <CardProfileOwner />
                    </div>
                </div>
            ) : (
                <div className='space-y-6'>
                    {/* 1. Tarjeta Superior: Información a la izquierda y Foto grande sin borde a la derecha */}
                    <CardProfile />

                    {/* 2. Sección Inferior: Formularios uno al lado del otro */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
                        {/* Formulario Editar Datos Personales */}
                        <FormProfile />

                        {/* Formulario Cambiar Contraseña */}
                        <CardPassword />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile