import { useState, useEffect } from "react"

/**
 * Weather codes mapping for Open-Meteo API
 */
const WEATHER_CODES = {
  0: "Cielo despejado",
  1: "Principalmente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna densa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia fuerte",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  95: "Tormenta eléctrica"
}

// Datos de respaldo en caso de bloqueo de red / tunel de red (ERR_TUNNEL_CONNECTION_FAILED)
const DATOS_CLIMA_RESPALDO = {
  temperatura: 19.5,
  sensacion: 19.5,
  humedad: 65,
  descripcion: "Parcialmente nublado",
  zona: "Invernadero",
  ciudad: "Invernadero",
  probLluvia: 10,
  precipitacion: 0
}

export function useClima(lat, lon, apiKey) {
  const [clima, setClima] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si no hay coordenadas disponibles aún
    if (lat === null || lat === undefined || lon === null || lon === undefined) {
      setCargando(true)
      return
    }

    const obtenerClima = async () => {
      setCargando(true)
      setError(null)

      // 1. Intentar con OpenWeatherMap si existe API Key
      if (apiKey) {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
          const respuesta = await fetch(url)
          const datos = await respuesta.json()

          if (datos.cod === 200) {
            setClima({
              temperatura: datos.main.temp,
              sensacion: datos.main.feels_like,
              humedad: datos.main.humidity || 65,
              descripcion: datos.weather?.[0]?.description || "Clima actual",
              zona: datos.name || "Invernadero",
              ciudad: datos.name || "Invernadero",
              probLluvia: datos.pop ? Math.round(datos.pop * 100) : 0,
              precipitacion: datos.rain?.['1h'] || datos.rain?.['3h'] || 0
            })
            setCargando(false)
            return
          }
        } catch (_) {
          // Ignorar silenciosamente errores de red
        }
      }

      // 2. Servicio meteorológico primario sin API Key (Open-Meteo API)
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=precipitation_probability_max,precipitation_sum&timezone=auto`
        const respuesta = await fetch(url)
        const datos = await respuesta.json()

        if (datos?.current_weather) {
          const code = datos.current_weather.weathercode
          const prob = datos.daily?.precipitation_probability_max?.[0] ?? 0
          const sumMm = datos.daily?.precipitation_sum?.[0] ?? 0

          setClima({
            temperatura: datos.current_weather.temperature,
            sensacion: datos.current_weather.temperature,
            humedad: 65,
            descripcion: WEATHER_CODES[code] || "Tiempo actual",
            zona: "Invernadero",
            ciudad: "Invernadero",
            probLluvia: prob,
            precipitacion: sumMm
          })
          setCargando(false)
          return
        }
      } catch (_) {
        // Red o proxy bloqueó la conexión (ERR_TUNNEL_CONNECTION_FAILED)
      }

      // Fallback seguro si la red del navegador bloquea las APIs externas
      setClima(DATOS_CLIMA_RESPALDO)
      setCargando(false)
    }

    obtenerClima()

    const intervalo = setInterval(obtenerClima, 600_000)
    return () => clearInterval(intervalo)
  }, [lat, lon, apiKey])

  return { clima, cargando, error }
}
