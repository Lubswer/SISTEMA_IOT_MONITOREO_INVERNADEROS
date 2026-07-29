import { MdDeleteForever, MdOutlinePayments } from "react-icons/md";
import ModalPayment from "./ModalPayment";


const TableTreatments = ({ treatments }) => {
    return (
        <>
            <table className='w-full mt-5 table-auto shadow-lg bg-white'>
                <thead className='bg-green-800 text-slate-200'>
                    <tr>
                        <th className="p-2">N°</th>
                        <th className="p-2">Actividad</th>
                        <th className="p-2">Descripción</th>
                        <th className="p-2">Prioridad</th>
                        <th className="p-2">Costo</th>
                        <th className="p-2">Estado pago</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {treatments.map((treatment, index) => (
                        <tr className="hover:bg-green-50 text-center" key={treatment._id || index}>
                            <td>{index + 1}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <span className="bg-green-100 text-green-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"></span>
                            </td>
                            <td className='py-2 text-center'>
                                <MdOutlinePayments
                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-green-600"
                                    title="Pagar"
                                />
                                <MdDeleteForever
                                    className="h-8 w-8 text-red-900 cursor-pointer inline-block hover:text-red-600"
                                    title="Eliminar"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {false && <ModalPayment />}
        </>
    )
}

export default TableTreatments
