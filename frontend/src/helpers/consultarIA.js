/**
 * Genera una imagen de cultivo utilizando inteligencia artificial (IA)
 * a partir de una descripción en texto (prompt).
 * 
 * Implementa semillas aleatorias y timestamps para garantizar que cada 
 * clic genere una nueva imagen diferente y no se guarde en caché.
 * 
 * @param {string} promptFormUser - Descripción del cultivo.
 * @returns {Promise<Blob>} Imagen binaria Blob.
 */
async function generateAvatar(promptFormUser) {
    const promptText = promptFormUser?.trim() || "cultivo verde en invernadero"
    const uniqueSeed = Math.floor(Math.random() * 1000000) + Date.now()
    const encodedPrompt = encodeURIComponent(`${promptText} realistic crop plant greenhouse photography`)

    // 1. Nivel 1: Motor Principal Pollinations AI con Semilla Única y anti-cache
    try {
        const iaUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${uniqueSeed}&nologo=true&cache=false&t=${Date.now()}`
        
        const response = await fetch(iaUrl)
        if (response.ok) {
            const blob = await response.blob()
            if (blob && blob.size > 500) {
                return blob
            }
        }
    } catch (err) {
        console.warn("Motor AI Nivel 1 no disponible, pasando a Nivel 2:", err)
    }

    // 2. Nivel 2: Motor Secundario (LoremFlickr / Unsplash Plant Search) con Anti-cache
    try {
        const keywords = encodeURIComponent(promptText.replace(/\s+/g, ','))
        const backupUrl = `https://loremflickr.com/512/512/plant,greenhouse,${keywords}?random=${uniqueSeed}`
        const response = await fetch(backupUrl)
        if (response.ok) {
            const blob = await response.blob()
            if (blob && blob.size > 500) {
                return blob
            }
        }
    } catch (err) {
        console.warn("Motor AI Nivel 2 no disponible, pasando a Nivel 3:", err)
    }

    // 3. Nivel 3: Generador de Lienzo Canvas (Garantiza 100% éxito sin conexión)
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas")
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext("2d")

        // Fondo degradado dinámico según tiempo
        const grad = ctx.createLinearGradient(0, 0, 512, 512)
        const hue = (uniqueSeed % 120) + 120 // Variaciones de tonos verdes/azules
        grad.addColorStop(0, `hsl(${hue}, 80%, 25%)`)
        grad.addColorStop(1, `hsl(${hue}, 70%, 15%)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 512, 512)

        // Decoración de círculos
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.beginPath()
        ctx.arc(256, 256, 180, 0, Math.PI * 2)
        ctx.fill()

        // Texto e ícono
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 42px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("🌿 Cultivo IA", 256, 230)

        ctx.font = "bold 22px sans-serif"
        ctx.fillStyle = "#a7f3d0"
        ctx.fillText(promptText.slice(0, 25), 256, 280)

        canvas.toBlob((blob) => {
            resolve(blob || new Blob([], { type: "image/png" }))
        }, "image/png")
    })
}

export default generateAvatar