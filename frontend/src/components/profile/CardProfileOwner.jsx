import storeProfile from "../../context/storeProfile"

export const CardProfileOwner = () => {

    const { user } = storeProfile()

    return (
        <div className="bg-white border border-slate-200 h-auto p-6 
                        flex flex-col gap-3 shadow-xl rounded-lg">

            {/* Avatar */}
            <div className="flex justify-center mb-2">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2138/2138440.png"
                    alt="avatar-propietario"
                    width={110}
                    height={110}
                />
            </div>

            {/* ── Datos del propietario ── */}
            <p className="font-bold text-gray-600 uppercase text-xs tracking-widest border-b pb-1">
                Propietario
            </p>

            <div className="self-start">
                <b>Nombre:</b>
                <p className="inline-block ml-3 text-gray-600">{user?.nombrePropietario ?? "—"}</p>
            </div>

            <div className="self-start">
                <b>Email:</b>
                <p className="inline-block ml-3 text-gray-600">{user?.emailPropietario ?? "—"}</p>
            </div>

            {/* ── Datos del cultivo ── */}
            <p className="font-bold text-gray-600 uppercase text-xs tracking-widest border-b pb-1 mt-2">
                Cultivo
            </p>

            <div className="self-start">
                <b>Nombre del cultivo:</b>
                <p className="inline-block ml-3 text-gray-600">{user?.nombreCultivo ?? "—"}</p>
            </div>

            <div className="self-start">
                <b>Tipo de planta:</b>
                <p className="inline-block ml-3 text-gray-600 capitalize">{user?.tipoPlanta ?? "—"}</p>
            </div>

            <div className="self-start">
                <b>Cantidad:</b>
                <p className="inline-block ml-3 text-gray-600">{user?.cantidad ?? "—"}</p>
            </div>

            {/* ── Niveles ── */}
            <p className="font-bold text-gray-600 uppercase text-xs tracking-widest border-b pb-1 mt-2">
                Niveles
            </p>

            <div className="self-start">
                <b>Humedad:</b>
                <p className="inline-block ml-3 text-gray-600 capitalize">{user?.nivelhumedad ?? "—"}</p>
            </div>

            <div className="self-start">
                <b>Riego:</b>
                <p className="inline-block ml-3 text-gray-600 capitalize">{user?.nivelRiego ?? "—"}</p>
            </div>

            <div className="self-start">
                <b>Luz:</b>
                <p className="inline-block ml-3 text-gray-600 capitalize">{user?.nivelLuz ?? "—"}</p>
            </div>

        </div>
    )
}