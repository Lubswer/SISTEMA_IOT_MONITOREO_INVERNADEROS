import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"

export function useFetch() {

    const [loading, setLoading] = useState(false)

    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}) => {

        const loadingToast = toast.loading("Procesando solicitud...")
        setLoading(true)
        try {
            const config = {
                method,
                url,
                headers: { ...headers }
            }
            if (data !== null && data !== undefined) {
                config.data = data
                if (!config.headers["Content-Type"]) {
                    config.headers["Content-Type"] = "application/json"
                }
            }
            const response = await axios(config)

            toast.dismiss(loadingToast)
            if(response?.data?.msg) toast.success(response.data.msg)
            return response?.data

        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error(error.response?.data?.msg || "Ocurrió un error inesperado")
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    return {fetchDataBackend,loading }
}

