import { LuSettings, LuList, LuLayoutList, LuUsers } from 'react-icons/lu';
import { PiPiggyBankBold } from 'react-icons/pi';
import { MdOutlineFmdGood } from 'react-icons/md';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
    FiEdit2,
    FiLogIn,
    FiLogOut,
    FiSearch,
    FiTrash2,
} from 'react-icons/fi';
import { 
    IoMenu,
    IoClose,
    IoChevronUp,
    IoChevronDown,
    IoChevronForward,
} from 'react-icons/io5';
import { 
    FaCheck,
    FaCircleArrowLeft,
    FaCircleArrowRight,
    FaRotateLeft,
} from 'react-icons/fa6';

export const ICONS = {
    add: BiMessageSquareAdd,
    edit: FiEdit2,
    search: FiSearch,
    arrowLeft: FaCircleArrowLeft,
    arrowRight: FaCircleArrowRight,
    check: FaCheck,
    chevronDown: IoChevronDown,
    chevronRight: IoChevronForward,
    chevronUp: IoChevronUp,
    close: IoClose,
    finances: PiPiggyBankBold,
    local: MdOutlineFmdGood,
    login: FiLogIn,
    logout: FiLogOut,
    menuHamburger: IoMenu,
    settings: LuSettings,
    friends: LuUsers,
    viewCard: LuLayoutList,
    viewList: LuList,
    spinLoader: AiOutlineLoading3Quarters,
    trash: FiTrash2,
    undo: FaRotateLeft,
}