import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";

export default function BackButton() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate("/floor-plan")}
            className="fixed bottom-6 left-6 z-[100] flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#C89D54] hover:text-[#C89D54] sm:bottom-8 sm:left-8 cursor-pointer"
            aria-label="Back to floor plan"
        >
            <FaAngleLeft className="size-4" />
        </button>
    );
}