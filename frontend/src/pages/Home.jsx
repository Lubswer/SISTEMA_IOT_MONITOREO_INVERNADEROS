import { Link } from 'react-router'
import { MdDashboard, MdOutlineSensors, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaRobot } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { FaCommentSms } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { GiWateringCan, GiThermometerCold } from "react-icons/gi";
import { TbPlant2, TbReportAnalytics } from "react-icons/tb";


export const Home = () => {
    return (
        <div className="scroll-smooth">
            <header className="container mx-auto h-40 text-center py-4 md:flex justify-between items-center px-4 md:h-15 sticky top-0 bg-white/90 backdrop-blur-md z-50">
                <h1 className='font-bold text-2xl my-2 text-green-700'>Green<span className='text-black'>HOUSE</span></h1>
                <ul className='flex gap-5 justify-center my-4 flex-wrap'>
                    <li><a href="#inicio" className='font-bold hover:text-green-700 hover:underline transition-colors'>Inicio</a></li>
                    <li><a href="#nosotros" className='font-bold hover:text-green-700 hover:underline transition-colors'>Nosotros</a></li>
                    <li><a href="#servicios" className='font-bold hover:text-green-700 hover:underline transition-colors'>Servicios</a></li>
                    <li><a href="#contacto" className='font-bold hover:text-green-700 hover:underline transition-colors'>Contacto</a></li>
                </ul>
                <ul className='flex justify-center items-center gap-5 my-4'>
                    <li><span className="text-2xl">🌿</span></li>
                </ul>
            </header>

            {/* SECCIÓN INICIO */}
            <main id="inicio" className='text-center py-6 px-8 bg-green-50 md:text-left md:flex justify-between items-center gap-10 md:py-12 scroll-mt-20'>
                <div className=''>
                    <h1 className='font-lato font-extrabold text-green-800 uppercase text-4xl my-4 md:text-6xl'>Software inteligente</h1>
                    <p className='font-bold text-left my-8 md:text-2xl underline'>Potenciado por</p>
                    <p className='text-2xl my-6 font-sans'>Inteligencia artificial, monitoreo en tiempo real, alertas de riego y mucho más...</p>
                    <Link to="/login" className='block bg-green-800 w-40 py-2 mx-auto text-white rounded-2xl text-center sm:mx-0 hover:bg-green-700 transition-colors shadow-md'>Comenzar</Link>
                    <p className='font-bold text-left my-4 md:text-2xl'>Encuéntranos</p>
                    <div className="flex justify-center gap-4">
                    </div>
                </div>
                <div className='hidden md:flex items-center justify-center text-[10rem] select-none'>
                    🏡
                </div>
            </main>

            {/* SECCIÓN NOSOTROS */}
            <section id="nosotros" className='container mx-auto px-4 pt-12 scroll-mt-20'>
                <div className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-1 w-50 text-center mx-auto bg-white'>NOSOTROS</h2>
                    <div className='text-green-900 border-2 absolute top-1/2 w-full z-0' />
                </div>
                <div className='my-10 flex flex-col gap-10 items-center sm:flex-row sm:justify-around sm:items-center'>
                    <div className='sm:w-1/2 flex items-center justify-center text-[8rem] select-none'>🌾</div>
                    <div className='px-10 sm:w-1/2'>
                        <p className='my-4'>GreenHOUSE es el primer software del mercado para invernaderos que incluye</p>
                        <ul className='space-y-4'>
                            <li><MdDashboard className='inline text-2xl mr-2 text-green-700' />Panel administrativo</li>
                            <li><FaRobot className='inline text-2xl mr-2 text-green-700' />Inteligencia artificial</li>
                            <li><BsCashCoin className='inline text-2xl mr-2 text-green-700' />Gestión de costos</li>
                            <li><FaCommentSms className='inline text-2xl mr-2 text-green-700' />Alertas en tiempo real</li>
                            <li><TbPlant2 className='inline text-2xl mr-2 text-green-700' />Gestión de cultivos</li>
                            <li><GiWateringCan className='inline text-2xl mr-2 text-green-700' />Control de riego</li>
                            <li><GiThermometerCold className='inline text-2xl mr-2 text-green-700' />Monitoreo ambiental</li>
                        </ul>
                        <p className='my-4'>Y más funcionalidades que aprovechan las tecnologías modernas</p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN SERVICIOS */}
            <section id="servicios" className='container mx-auto px-4 pt-12 scroll-mt-20'>
                <div className='container mx-auto relative mt-6'>
                    <h2 className='font-semibold text-3xl relative z-1 w-50 text-center mx-auto bg-white'>SERVICIOS</h2>
                    <div className='text-green-900 border-2 absolute top-1/2 w-full z-0' />
                </div>
                <div className='my-10 flex justify-between flex-wrap gap-5'>
                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 sm:flex-1">
                        <TbPlant2 className='inline text-5xl text-green-700' />
                        <h4 className="text-xl font-bold py-4 text-green-700 hover:underline">Gestión de Cultivos</h4>
                        <p className="my-4 px-2">Registra, monitorea y gestiona todos tus cultivos en un solo lugar. Controla el crecimiento, etapas de cosecha y salud de cada planta.</p>
                        <hr className="border-1 border-green-900 absolute w-full" />
                    </div>
                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 bg-green-50 sm:flex-1">
                        <GiWateringCan className='inline text-5xl text-green-700' />
                        <h4 className="text-xl font-bold py-4 text-green-700 hover:underline">Control de Riego</h4>
                        <p className="my-4 px-2">Programa y automatiza el sistema de riego. Recibe alertas cuando tus plantas necesiten agua y registra el historial de riegos.</p>
                        <hr className="border-1 border-green-900 absolute w-full" />
                    </div>
                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 bg-green-50 sm:flex-1">
                        <MdOutlineSensors className='inline text-5xl text-green-700' />
                        <h4 className="text-xl font-bold py-4 text-green-700 hover:underline">Monitoreo Ambiental</h4>
                        <p className="my-4 px-2">Controla temperatura, humedad y luminosidad en tiempo real. Recibe alertas automáticas ante condiciones adversas para tus plantas.</p>
                        <hr className="border-1 border-green-900 absolute w-full" />
                    </div>
                    <div className="text-center shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.3)] hover:shadow-[0.1rem_0.1rem_1rem_rgba(0,0,0,0.5)] transition-shadow duration-300 relative pt-4 sm:flex-1">
                        <TbReportAnalytics className='inline text-5xl text-green-700' />
                        <h4 className="text-xl font-bold py-4 text-green-700 hover:underline">Reportes y Costos</h4>
                        <p className="my-4 px-2">Genera reportes de producción, controla costos de insumos y gestiona los pagos de manera integrada con tu sistema de invernadero.</p>
                        <hr className="border-1 border-green-900 absolute w-full" />
                    </div>
                </div>
            </section>

            {/* SECCIÓN CONTACTO */}
            <footer id="contacto" className='bg-green-50 p-6 sm:px-16 sm:py-10 mt-20 rounded-tr-3xl rounded-tl-3xl space-y-8 border-t border-green-200 scroll-mt-20'>
                <div className='flex justify-between items-center border-b border-green-200 pb-4'>
                    <div className='text-3xl font-extrabold text-green-800'>Contáctanos</div>
                    <ul className='flex gap-4'>
                        <li>
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-800 hover:text-green-600 transition-colors"
                            >
                                <FaFacebook className='text-2xl' />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-800 hover:text-green-600 transition-colors"
                            >
                                <FaSquareInstagram className='text-2xl' />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-800 hover:text-green-600 transition-colors"
                            >
                                <FaXTwitter className='text-2xl' />
                            </a>
                        </li>
                    </ul>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left'>
                    {/* Información de Contacto */}
                    <div className='space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col justify-between'>
                        <h3 className='text-xl font-bold text-green-800 border-b border-green-100 pb-2'>Información de Contacto</h3>
                        
                        <div className='flex items-center gap-4 text-gray-700 hover:translate-x-1 transition-transform duration-200'>
                            <div className='bg-green-100 p-3 rounded-xl text-green-800'>
                                <MdEmail className='text-2xl' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500 font-semibold uppercase tracking-wider'>Correo Electrónico</p>
                                <p className='font-bold text-gray-800 text-sm sm:text-base'>admin@greenhouse.com</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 text-gray-700 hover:translate-x-1 transition-transform duration-200'>
                            <div className='bg-green-100 p-3 rounded-xl text-green-800'>
                                <MdPhone className='text-2xl' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500 font-semibold uppercase tracking-wider'>Teléfono / WhatsApp</p>
                                <p className='font-bold text-gray-800 text-sm sm:text-base'>0995644186</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 text-gray-700 hover:translate-x-1 transition-transform duration-200'>
                            <div className='bg-green-100 p-3 rounded-xl text-green-800'>
                                <MdLocationOn className='text-2xl' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500 font-semibold uppercase tracking-wider'>Ubicación</p>
                                <p className='font-bold text-gray-800 text-sm sm:text-base'>Escuela Politécnica Nacional, Quito - Ecuador</p>
                            </div>
                        </div>
                    </div>

                    {/* Mapa Interactivo */}
                    <div className='w-full rounded-2xl overflow-hidden shadow-sm border border-green-100 min-h-[240px]'>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.15009985838!2d-78.51237729261271!3d-0.2251148387309881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a107e1cd44b%3A0x88a284f66939ed4!2sESCUELA%20POLIT%C3%89CNICA%20NACIONAL!5e0!3m2!1ses!2sec!4v1784076726068!5m2!1ses!2sec"
                            width="100%"
                            height="100%"
                            className="w-full h-64 md:h-full border-0 rounded-2xl"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                        />
                    </div>
                </div>

                <hr className='border-t border-green-200' />
                <p className='font-semibold text-center text-gray-600 text-sm'>copyright - © - GreenHOUSE</p>
            </footer>
        </div>
    )
}
