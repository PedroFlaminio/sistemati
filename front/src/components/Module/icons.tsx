import { ReactNode } from "react";
import { FaFile, FaFileExcel, FaGlasses, FaKey, FaPencilAlt, 
    FaPrint, FaRegCalendarAlt, FaTrash,FaRecycle,FaRegCalendarCheck, FaTimes, FaUserMinus, FaUserPlus, FaCheck,FaTimesCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { RiArrowGoBackFill } from "react-icons/ri";


export type IconType = 
  "new"|"edit"|"delete"|"report"|"excel"|
  "view"|"calendar"|"key"|"clear"|"update"|
  "confirm"|"cancelar"|"ativo"|"inativo"|"back"|
  "check"|"uncheck"
const Icons: {[id: string] : ReactNode} = {
    new: (<FaFile/>),
    edit: (<FaPencilAlt/>),
    delete: (<FaTrash/>),
    report: (<FaPrint/>),
    view: (<FaGlasses/>),
    excel: (<FaFileExcel/>),
    key: (<FaKey/>),
    clear: (<FaRecycle/>),
    update: (<FiRefreshCw />),
    calendar: (<FaRegCalendarAlt/>),
    confirm: (<FaRegCalendarCheck/>),
    inativo: (<FaUserMinus/>),
    ativo: (<FaUserPlus/>),
    cancelar: (<FaTimesCircle/>),
    back: (<RiArrowGoBackFill/>),
    check:  (<FaCheck/>),
    uncheck:  (<FaTimes/>)

}

export default Icons;