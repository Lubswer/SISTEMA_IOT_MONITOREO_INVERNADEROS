import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const getAuthHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser?.state?.token}`,
        },
    }
}


const storeProfile = create((set) => ({
        
    user: null,
    clearUser: () => set({ user: null }),
    profile: async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("auth-token"))
            const rol = storedUser?.state?.rol
            const endpoint = rol === "admin"
                ? "admin/perfil"
                : rol === "usuario"
                ? "user/perfil"
                : "cultivo/perfil"
            const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ user: respuesta.data })
        } catch (error) {
            toast.error(error.response?.data?.msg)
            console.log(error)
        }
    },
    updateProfile: async (url, data) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("auth-token"))
            const isFormData = data instanceof FormData
            const headers = {
                Authorization: `Bearer ${storedUser?.state?.token}`,
            }
            if (!isFormData) {
                headers["Content-Type"] = "application/json"
            }
            const respuesta = await axios.put(url, data, { headers })
            set({ user: respuesta.data })
            toast.dismiss()
            toast.success("Perfil actualizado correctamente", { autoClose: 3000 })
        } catch (error) {
            console.log(error)
            toast.dismiss()
            toast.error(error.response?.data?.msg || "Error al actualizar el perfil", { autoClose: 3000 })
        }
    },
    
    updatePasswordProfile:async(url,data)=>{
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            toast.success("Contraseña actualizada exitosamente")
            return respuesta
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg)
        }
    }
    })
)

export default storeProfile
