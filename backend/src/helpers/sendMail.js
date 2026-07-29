import sendMail from "../config/nodemaler.js";

const sendMailToRegister = (userMail, token) => {
    return sendMail(
        userMail,
        "Bienvenido a greenHOUSE ☘",
        `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; background-color: #f4f9f4; padding: 32px; border-radius: 12px;">
            
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px;">☘</span>
                <h1 style="color: #2e7d32; font-size: 22px; margin: 8px 0 0;">greenHOUSE</h1>
            </div>

            <div style="background-color: #ffffff; padding: 24px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1b1b1b; font-size: 18px; margin-top: 0;">Confirma tu cuenta</h2>
                <p style="color: #444444; font-size: 15px; line-height: 1.5;">
                    ¡Hola! Gracias por registrarte en greenHOUSE. Solo falta un paso: confirma tu cuenta haciendo clic en el siguiente botón.
                </p>

                <div style="text-align: center; margin: 28px 0;">
                    <a href="${process.env.URL_FRONTEND}confirmar/${token}"
                       style="background-color: #2e7d32; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: bold; display: inline-block;">
                        Confirmar cuenta
                    </a>
                </div>

                <p style="color: #888888; font-size: 13px; line-height: 1.4;">
                    Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                    <a href="${process.env.URL_BACKEND}confirmar/${token}" style="color: #2e7d32; word-break: break-all;">
                        ${process.env.URL_FRONTEND}confirmar/${token}
                    </a>
                </p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    El equipo de greenHOUSE ☘ te da la más cordial bienvenida.
                </p>
            </div>

        </div>
        `
    )
}
const sendMailToRecoveryPassword = (userMail, token) => {
    return sendMail(
        userMail,
        "Recupera tu contraseña",
        `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; background-color: #f4f9f4; padding: 32px; border-radius: 12px;">
            
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px;">☘</span>
                <h1 style="color: #2e7d32; font-size: 22px; margin: 8px 0 0;">greenHOUSE</h1>
            </div>

            <div style="background-color: #ffffff; padding: 24px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1b1b1b; font-size: 18px; margin-top: 0;">Restablece tu contraseña</h2>
                <p style="color: #444444; font-size: 15px; line-height: 1.5;">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para crear una nueva contraseña.
                </p>

                <div style="text-align: center; margin: 28px 0;">
                    <a href="${process.env.URL_FRONTEND}recuperarpassword/${token}"
                       style="background-color: #2e7d32; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: bold; display: inline-block;">
                        Restablecer contraseña
                    </a>
                </div>

                <p style="color: #888888; font-size: 13px; line-height: 1.4;">
                    Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                    <a href="${process.env.URL_FRONTEND}recuperarpassword/${token}" style="color: #2e7d32; word-break: break-all;">
                        ${process.env.URL_FRONTEND}recuperarpassword/${token}
                    </a>
                </p>

                <p style="color: #888888; font-size: 13px; line-height: 1.4; margin-top: 20px;">
                    Si no solicitaste este cambio, puedes ignorar este correo — tu contraseña seguirá siendo la misma.
                </p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    El equipo de greenHOUSE ☘ está aquí para ayudarte.
                </p>
            </div>

        </div>
        `
    )
}
const sendMailToOwner = (userMail, passwordPropietario, nombreUsuario) => {
    return sendMail(
        userMail,
        "Bienvenido a greenHOUSE ☘",
        `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; background-color: #f4f9f4; padding: 32px; border-radius: 12px;">
            
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px;">☘</span>
                <h1 style="color: #2e7d32; font-size: 22px; margin: 8px 0 0;">greenHOUSE</h1>
            </div>

            <div style="background-color: #ffffff; padding: 24px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1b1b1b; font-size: 18px; margin-top: 0;">Tus credenciales de acceso</h2>
                <p style="color: #444444; font-size: 15px; line-height: 1.5;">
                    Hola <strong>${nombreUsuario}</strong>, se haz creado un nuevo cultivo en greenHOUSE. Aquí tienes tu clave de acceso para gestionar tu cultivo:
                </p>

                <div style="background-color: #f4f9f4; border: 1px solid #cfe3cf; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
                    <p style="margin: 0; color: #444444; font-size: 14px;">
                        <strong>Contraseña:</strong>
                        <span style="background-color: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 20px;">${passwordPropietario}</span>
                    </p>
                </div>

                <p style="color: #888888; font-size: 13px; line-height: 1.4;">
                    Guardala muy bien!!
                </p>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    El equipo de greenHOUSE ☘ te da la más cordial bienvenida.
                </p>
            </div>

        </div>
        `
    )
}
export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
}