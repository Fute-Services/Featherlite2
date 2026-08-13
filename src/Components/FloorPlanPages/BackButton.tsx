import { IoReturnUpBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
export default function BackButton() {
    const navigate = useNavigate();
    return (<>

        <button
            onClick={() => navigate("/floor-plan")}
            className="absolute bottom-10 left-[5%] z-30 p-2.5
                    bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md border 
                    border-white/70 rounded-full transition-all duration-500 ease-in-out cursor-pointer
                     hover:scale-110 active:scale-95 shadow-xl"
        >
            {/* <ChevronLeft className="w-4 h-4 text-white/80" /> */}
            {/* <TiArrowBackOutline className="w-4 h-4 text-white/80"/> */}

            <IoReturnUpBack className="w-4 h-4 text-white/80" />

        </button>
    </>)
}