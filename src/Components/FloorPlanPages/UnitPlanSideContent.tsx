// import hidedetails from '../../assets/floorplan/icons/hide_details.png'
// import vr from '../../assets/floorplan/icons/view-vr.png'
// import view from '../../assets/floorplan/icons/table details.png'
interface UnitPlanSideContentProps {
    activePoint: any;
    setShowVRModal: (show: boolean) => void;
    viewdata: any;
    setViewdata: React.Dispatch<React.SetStateAction<any>>;
}

export default function UnitPlanSideContent({
    activePoint,
    // setShowVRModal,
    // viewdata,
    // setViewdata,
}: UnitPlanSideContentProps) {


  const active= activePoint.id!==101
    return (<>

     {active && (

     <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2
                 z-30 w-64 md:w-52 h-[52%] bg-[#082338]/90 backdrop-blur-xl border border-white/30 rounded-2xl
                  p-4 flex-col gap-3 shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border
                         border-white/80 text-xs text-white/90 font-mono font-bold">
                    {activePoint.id}
                </span>
                <h2 className="text-sm font-bold text-white tracking-wide">
                    {activePoint.name}
                </h2>
            </div>

            {/* Location Image Preview */}
            <div className="w-full h-36 rounded-xl overflow-hidden border border-white/20 shadow-inner">
                <img
                    // onClick={() => setShowVRModal(true)}
                    src={activePoint.detailImage}
                    alt={activePoint.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform
                            duration-500 hover:scale-105"
                />
            </div>

            <p className="text-xs text-slate-300 h-5 mb-1 leading-relaxed">
                {activePoint.subtitle}
            </p>

            {/* Action CTA Buttons 
            <div className="flex flex-col gap-2 mt-2">
                <button
                    onClick={() => setShowVRModal(true)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-cyan-950/60 hover:bg-cyan-900/80 border border-white/40 rounded-full text-xs text-bg-white/80 font-medium transition-all shadow-md active:scale-98">
                    
                    <img src={vr} className="w-4 h-4" />
                    View in VR
                </button>
                <button
                    onClick={() => setViewdata((prev: any) => !prev)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-cyan-950/60 hover:bg-cyan-900/80 border border-white/40 rounded-full text-xs text-bg-white/80 font-medium transition-all shadow-md active:scale-98">
                  
                    <img src={`${viewdata ? hidedetails : view}`} className="w-4 h-4" />
                    {viewdata ? " Hide details" : " View details"}
                </button>
            </div>*/}
        </div> )}  
    </>)
}