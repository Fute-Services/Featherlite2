import PanoramaViewer from '../../Components/FloorPlanPages/Pano';
interface VRModelProps {
    setShowVRModal: React.Dispatch<React.SetStateAction<boolean>>;
    activePoint: any; // Replace with your actual type
}

export default function VRModel({
    setShowVRModal,
    activePoint,
}: VRModelProps) {
    return (<>

        <div className="fixed inset-0 z-[1000] flex items-center justify-center 
                bg-black/90 backdrop-blur-sm">
            {/* Close Button */}
            <button
                onClick={() => setShowVRModal(false)}
                className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white transition-all"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Modal Container */}
            <div className="relative w-11/12 h-[95vh] max-w-7xl rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)] bg-[#051a2d]">

                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                        {activePoint.name} - 360° View
                    </h3>
                </div>

                {/* 360 Three.js Viewer */}
                <div className="w-full h-full">
                    <PanoramaViewer imageUrl={activePoint.detailImage} />
                </div>

            </div>
        </div>
    </>)
}