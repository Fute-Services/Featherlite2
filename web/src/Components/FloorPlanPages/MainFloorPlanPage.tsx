// import React, { useState } from "react";
// import UnitPlanContentPage from "./UnitPlanContentPage";
// import UnitPlanSideContent from "./UnitPlanSideContent";

// interface FloorPlanViewerProps {
//   floorPoints?: any;
//   units?: any[];
//   selectedId?: string | number;
//   setSelectedId?: (id: any) => void;
//   activePoint?: any;
//   setShowVRModal?: (val: boolean) => void;
//   viewdata?: boolean;
//   setViewdata?: (val: boolean) => void;
//   handlePrev?: () => void;
//   handleNext?: () => void;
//   idnew?: string | number;
//   zoomLevel?: number;
//   isDragging?: boolean;
//   position?: { x: number; y: number };
//   handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   handlePointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   handlePointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   left?: string;
//   right?: string;
// }

// export default function FloorPlanViewer({
//   floorPoints,
//   units = [],
//   selectedId = "",
//   setSelectedId = () => {},
//   activePoint,
//   setShowVRModal = () => {},
//   viewdata = true,
//   setViewdata = () => {},
//   handlePrev,
//   handleNext,
//   idnew = "default",
//   zoomLevel = 1,
//   isDragging = false,
//   position = { x: 0, y: 0 },
//   handlePointerDown,
//   handlePointerMove,
//   handlePointerUp,
//   left,
//   right,
// }: FloorPlanViewerProps) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [origin, setOrigin] = useState({ x: 50, y: 50 });

//   if (!floorPoints) return null;

//   // Track hover coordinates ONLY within the actual building image box
//   const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isDragging) return;

//     // Check if hovering on an interactive hotspot card or button
//     const target = e.target as HTMLElement;
//     if (target.closest("foreignObject") || target.closest("button")) {
//       setIsHovered(false);
//       return;
//     }

//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;

//     setOrigin({ x, y });
//     setIsHovered(true);
//   };

//   const handleImageLeave = () => {
//     setIsHovered(false);
//     setOrigin({ x: 50, y: 50 });
//   };

//   return (
//     <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden select-none">
//       {/* 1. Prev Navigation Button */}
//       {handlePrev && (
//         <button
//           onClick={handlePrev}
//           className="absolute left-[10%] md:left-[12%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
//           type="button"
//           title="Previous Floor"
//         >
//           {left && <img src={left} className="w-6 h-6 text-white" alt="Previous Floor" />}
//         </button>
//       )}

//       {/* 2. Scalable Floor Plan Wrapper (Pan / Global Zoom) */}
//       <div
//         key={`building-stage-${idnew}`}
//         className={`relative w-full h-full flex items-center justify-center will-change-transform`}
//       >
//         <div
//           className={`relative w-full h-full flex items-center justify-center ${
//             zoomLevel > 1 ? "cursor-grab" : "cursor-default"
//           } ${isDragging ? "cursor-grabbing" : ""}`}
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={handlePointerUp}
//           onPointerCancel={handlePointerUp}
//         >
//           {/* Main Positioned Layer */}
//           <div
//             className="relative flex items-center justify-center will-change-transform"
//             style={{
//               transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px) scale(${zoomLevel ?? 1})`,
//               transformOrigin: "center center",
//               transition: isDragging ? "none" : "transform 500ms ease-out",
//             }}
//           >
//             {/* Building-Only Clipped Frame: Hover listeners are strictly bound here */}
//             <div
//               onMouseMove={handleImageHover}
//               onMouseLeave={handleImageLeave}
//               className="relative w-[650px] md:w-[750px] lg:w-[1050px] aspect-[4/3] flex items-center 
//               justify-center rounded-2xl overflow-hidden cursor-crosshair"
//             >
//               {/* Inner Zoom Container */}
//               <div
//                 className="w-full h-full transform-gpu will-change-transform"
//                 style={{
//                   transform: isHovered ? "scale(1.65)" : "scale(1)",
//                   transformOrigin: `${origin.x}% ${origin.y}%`,
//                   transition: "transform 500ms cubic-bezier(0.16, 1, 0.7, 1)",
//                 }}
//               >
//                 <svg
//                   key={`floor-svg-${idnew}`}
//                   viewBox={floorPoints?.imagesvg || "0 0 1920 1080"}
//                   className="w-full h-full"
//                   preserveAspectRatio="xMidYMid meet"
//                 >
//                   {/* Floor Plan Base Image */}
//                   {floorPoints?.image && (
//                     <image
//                       href={floorPoints.image}
//                       x="0"
//                       y="0"
//                       width={floorPoints.imagew || "100%"}
//                       height={floorPoints.imageh || "100%"}
//                       preserveAspectRatio="xMidYMid meet"
//                       className="brightness-95 contrast-105 bg-transparent"
//                     />
//                   )}

//                   {/* Hotspots & Pins: Fades out only when the user is inspecting the building */}
//                   {viewdata && units.length > 0 && (
//                     <g
//                       key={`unit-group-${idnew}`}
//                       className={`transition-opacity duration-500 ease-out ${
//                         isHovered
//                           ? "opacity-0 pointer-events-none"
//                           : "opacity-100 pointer-events-auto"
//                       }`}
//                     >
//                       <UnitPlanContentPage
//                         setSelectedId={setSelectedId}
//                         pointsData={units}
//                         selectedId={selectedId}
//                       />
//                     </g>
//                   )}
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 3. Next Navigation Button */}
//       {handleNext && (
//         <button
//           onClick={handleNext}
//           className="absolute right-[12%] md:right-[16.5%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
//           type="button"
//           title="Next Floor"
//         >
//           {right && <img src={right} className="w-6 h-6 text-white" alt="Next Floor" />}
//         </button>
//       )}

//       {/* 4. Side Content Card: Always interactive and untouched */}
//       {activePoint && (
//         <div className="absolute right-0 top-0 bottom-0 z-40 flex items-center pointer-events-auto">
//           <UnitPlanSideContent
//             key={`side-content-${idnew}`}
//             activePoint={activePoint}
//             setShowVRModal={setShowVRModal}
//             viewdata={viewdata}
//             setViewdata={setViewdata}
//           />
//         </div>
//       )}
//     </main>
//   );
// }



// import React, { useState, useRef, useEffect } from "react";
// import UnitPlanContentPage from "./UnitPlanContentPage";
// import UnitPlanSideContent from "./UnitPlanSideContent";

// interface FloorPlanViewerProps {
//   floorPoints?: any;
//   units?: any[];
//   selectedId?: string | number;
//   setSelectedId?: (id: any) => void;
//   activePoint?: any;
//   setShowVRModal?: (val: boolean) => void;
//   viewdata?: boolean;
//   setViewdata?: (val: boolean) => void;
//   handlePrev?: () => void;
//   handleNext?: () => void;
//   idnew?: string | number;
//   zoomLevel?: number;
//   isDragging?: boolean;
//   position?: { x: number; y: number };
//   handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   handlePointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   handlePointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   left?: string;
//   right?: string;
// }

// export default function FloorPlanViewer({
//   floorPoints,
//   units = [],
//   selectedId = "",
//   setSelectedId = () => {},
//   activePoint,
//   setShowVRModal = () => {},
//   viewdata = true,
//   setViewdata = () => {},
//   handlePrev,
//   handleNext,
//   idnew = "default",
//   zoomLevel = 1,
//   isDragging = false,
//   position = { x: 0, y: 0 },
//   handlePointerDown,
//   handlePointerMove,
//   handlePointerUp,
//   left,
//   right,
// }: FloorPlanViewerProps) {
//   const [isHovered, setIsHovered] = useState(false);
//   const zoomTargetRef = useRef<HTMLDivElement>(null);

//   // Target and current interpolated coordinates
//   const targetPos = useRef({ x: 0, y: 0, scale: 1 });
//   const currentPos = useRef({ x: 0, y: 0, scale: 1 });
//   const animFrameId = useRef<number | null>(null);

//   const ZOOM_FACTOR = 1.65;
//   const LERP_SPEED = 0.08; // Lower = smoother & floaty, Higher = snappy

//   useEffect(() => {
//     const animate = () => {
//       // Linear interpolation (Lerp) for silky smooth movement
//       currentPos.current.x += (targetPos.current.x - currentPos.current.x) * LERP_SPEED;
//       currentPos.current.y += (targetPos.current.y - currentPos.current.y) * LERP_SPEED;
//       currentPos.current.scale += (targetPos.current.scale - currentPos.current.scale) * LERP_SPEED;

//       if (zoomTargetRef.current) {
//         zoomTargetRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(${currentPos.current.scale})`;
//       }

//       animFrameId.current = requestAnimationFrame(animate);
//     };

//     animFrameId.current = requestAnimationFrame(animate);
//     return () => {
//       if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
//     };
//   }, []);

//   if (!floorPoints) return null;

//   const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isDragging) return;

//     const target = e.target as HTMLElement;
//     if (target.closest("foreignObject") || target.closest("button")) {
//       handleImageLeave();
//       return;
//     }

//     const rect = e.currentTarget.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;

//     // Calculate translation offset so the zoom centers directly under the cursor
//     targetPos.current = {
//       x: -mouseX * (ZOOM_FACTOR - 1),
//       y: -mouseY * (ZOOM_FACTOR - 1),
//       scale: ZOOM_FACTOR,
//     };

//     setIsHovered(true);
//   };

//   const handleImageLeave = () => {
//     setIsHovered(false);
//     // Smoothly returns to rest state
//     targetPos.current = { x: 0, y: 0, scale: 1 };
//   };

//   return (
//     <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden select-none">
//       {/* 1. Prev Navigation Button */}
//       {handlePrev && (
//         <button
//           onClick={handlePrev}
//           className="absolute left-[10%] md:left-[12%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
//           type="button"
//           title="Previous Floor"
//         >
//           {left && <img src={left} className="w-6 h-6 text-white" alt="Previous Floor" />}
//         </button>
//       )}

//       {/* 2. Scalable Floor Plan Wrapper (Pan / Global Zoom) */}
//       <div
//         key={`building-stage-${idnew}`}
//         className="relative w-full h-full  flex items-center justify-center will-change-transform"
//       >
//         <div
//           className={`relative w-full h-full flex items-center justify-center ${
//             zoomLevel > 1 ? "cursor-grab" : "cursor-default"
//           } ${isDragging ? "cursor-grabbing" : ""}`}
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={handlePointerUp}
//           onPointerCancel={handlePointerUp}
//         >
//           {/* Main Positioned Layer */}
//           <div
//             className="relative flex animate-zoom-back-to-front items-center justify-center will-change-transform"
//             style={{
//               transform: `translate3d(${position?.x ?? 0}px, ${position?.y ?? 0}px, 0) scale(${zoomLevel ?? 1})`,
//               transformOrigin: "center center",
//               transition: isDragging ? "none" : "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
//             }}
//           >
//             {/* Building-Only Clipped Frame */}
//             <div
//               onMouseMove={handleImageHover}
//               onMouseLeave={handleImageLeave}
//               className="relative w-[650px] md:w-[750px] lg:w-[1050px] aspect-[4/3]  flex items-center justify-center rounded-2xl overflow-hidden cursor-crosshair"
//             >
//               {/* Hardware Accelerated Smooth Zoom Target */}
//               <div
//                 ref={zoomTargetRef}
//                 className="w-full h-full will-change-transform"
//                 style={{
//                   transformOrigin: "0% 0%",
//                 }}
//               >
//                 <svg
//                   key={`floor-svg-${idnew}`}
//                   viewBox={floorPoints?.imagesvg || "0 0 1920 1080"}
//                   className="w-full h-full"
//                   preserveAspectRatio="xMidYMid meet"
//                 >
//                   {/* Floor Plan Base Image */}
//                   {floorPoints?.image && (
//                     <image
//                       href={floorPoints.image}
//                       x="0"
//                       y="0"
//                       width={floorPoints.imagew || "100%"}
//                       height={floorPoints.imageh || "100%"}
//                       preserveAspectRatio="xMidYMid meet"
//                       className="brightness-95 contrast-105 bg-transparent"
//                     />
//                   )}

//                   {/* Hotspots & Pins: Seamless fade */}
//                   {viewdata && units.length > 0 && (
//                     <g
//                       key={`unit-group-${idnew}`}
//                       className={`transition-opacity duration-300 ease-out ${
//                         isHovered
//                           ? "opacity-0 pointer-events-none"
//                           : "opacity-100 pointer-events-auto"
//                       }`}
//                     >
//                       <UnitPlanContentPage
//                         setSelectedId={setSelectedId}
//                         pointsData={units}
//                         selectedId={selectedId}
//                       />
//                     </g>
//                   )}
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 3. Next Navigation Button */}
//       {handleNext && (
//         <button
//           onClick={handleNext}
//           className="absolute right-[12%] md:right-[16.5%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
//           type="button"
//           title="Next Floor"
//         >
//           {right && <img src={right} className="w-6 h-6 text-white" alt="Next Floor" />}
//         </button>
//       )}

//       {/* 4. Side Content Card */}
//       {activePoint && (
//         <div className="absolute right-0 top-0 bottom-0 z-40 flex items-center pointer-events-auto">
//           <UnitPlanSideContent
//             key={`side-content-${idnew}`}
//             activePoint={activePoint}
//             setShowVRModal={setShowVRModal}
//             viewdata={viewdata}
//             setViewdata={setViewdata}
//           />
//         </div>
//       )}
//     </main>
//   );
// }


// import React, { useState, useRef, useEffect, useCallback } from "react";
// import UnitPlanContentPage from "./UnitPlanContentPage";
// import UnitPlanSideContent from "./UnitPlanSideContent";

// interface FloorPlanViewerProps {
//   floorPoints?: any;
//   units?: any[];
//   selectedId?: string | number;
//   setSelectedId?: (id: any) => void;
//   activePoint?: any;
//   setShowVRModal?: (val: boolean) => void;
//   viewdata?: boolean;
//   setViewdata?: (val: boolean) => void;
//   handlePrev?: () => void;
//   handleNext?: () => void;
//   idnew?: string | number;
//   zoomLevel?: number;
//   isDragging?: boolean;
//   position?: { x: number; y: number };
//   handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   handlePointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   handlePointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
//   left?: string;
//   right?: string;
//   /** Magnification strength of the hover lens. Default 2.5 */
//   lensZoom?: number;
//   /** Diameter of the lens in px. Default 260 */
//   lensSize?: number;
// }

// export default function FloorPlanViewer({
//   floorPoints,
//   units = [],
//   selectedId = "",
//   setSelectedId = () => {},
//   activePoint,
//   setShowVRModal = () => {},
//   viewdata = true,
//   setViewdata = () => {},
//   handlePrev,
//   handleNext,
//   idnew = "default",
//   zoomLevel = 1,
//   isDragging = false,
//   position = { x: 0, y: 0 },
//   handlePointerDown,
//   handlePointerMove,
//   handlePointerUp,
//   left,
//   right,
//   lensZoom = 2.5,
//   lensSize = 260,
// }: FloorPlanViewerProps) {
//   const frameRef = useRef<HTMLDivElement>(null);
//   const lensRef = useRef<HTMLDivElement>(null);
//   const lensInnerRef = useRef<HTMLDivElement>(null);

//   const [isHovered, setIsHovered] = useState(false);
//   const [isTouchDevice, setIsTouchDevice] = useState(false);
//   const [dims, setDims] = useState({ w: 0, h: 0 });
//   const dimsRef = useRef({ w: 0, h: 0 });

//   // Target vs. current (lerped) lens state, kept in refs so we don't
//   // trigger a React re-render on every mouse-move / animation frame.
//   const target = useRef({ x: 0, y: 0, active: false });
//   const current = useRef({ x: 0, y: 0, opacity: 0 });
//   const rafId = useRef<number | null>(null);

//   const LERP = 0.18;

//   // Touch / coarse-pointer devices already get magnification via the
//   // existing pinch-to-zoom (zoomLevel prop) — the hover lens is a
//   // desktop-only affordance, so we don't fight the two against each other.
//   useEffect(() => {
//     const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
//     const update = () => setIsTouchDevice(!mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);

//   useEffect(() => {
//     const el = frameRef.current;
//     if (!el) return;
//     const ro = new ResizeObserver(([entry]) => {
//       const { width, height } = entry.contentRect;
//       dimsRef.current = { w: width, h: height };
//       setDims({ w: width, h: height });
//     });
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   const applyLensTransform = () => {
//     const { w, h } = dimsRef.current;
//     if (!lensRef.current || !lensInnerRef.current || !w || !h) return;

//     const half = lensSize / 2;
//     const cx = current.current.x;
//     const cy = current.current.y;

//     // Clamp so the lens circle never drifts past the frame edge.
//     const lensX = Math.min(Math.max(cx, half), w - half);
//     const lensY = Math.min(Math.max(cy, half), h - half);

//     lensRef.current.style.transform = `translate3d(${lensX - half}px, ${lensY - half}px, 0)`;
//     lensRef.current.style.opacity = String(current.current.opacity);

//     // Offset the magnified inner copy so the point under the cursor
//     // stays centered inside the lens.
//     const innerX = -(lensX * lensZoom - half);
//     const innerY = -(lensY * lensZoom - half);
//     lensInnerRef.current.style.transform = `translate3d(${innerX}px, ${innerY}px, 0) scale(${lensZoom})`;
//   };

//   const tick = useCallback(() => {
//     const dx = target.current.x - current.current.x;
//     const dy = target.current.y - current.current.y;
//     const targetOpacity = target.current.active ? 1 : 0;
//     const dOpacity = targetOpacity - current.current.opacity;

//     current.current.x += dx * LERP;
//     current.current.y += dy * LERP;
//     current.current.opacity += dOpacity * 0.15;

//     applyLensTransform();

//     const settled =
//       Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 && Math.abs(dOpacity) < 0.01;

//     rafId.current = settled ? null : requestAnimationFrame(tick);
//   }, [lensZoom, lensSize]);

//   const startLoop = () => {
//     if (rafId.current == null) rafId.current = requestAnimationFrame(tick);
//   };

//   useEffect(() => {
//     return () => {
//       if (rafId.current) cancelAnimationFrame(rafId.current);
//     };
//   }, []);

//   if (!floorPoints) return null;

//   const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isDragging || isTouchDevice) return;

//     const t = e.target as HTMLElement;
//     if (t.closest("foreignObject") || t.closest("button")) {
//       handleLeave();
//       return;
//     }

//     const rect = e.currentTarget.getBoundingClientRect();
//     target.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//       active: true,
//     };
//     if (!isHovered) setIsHovered(true);
//     startLoop();
//   };

//   const handleLeave = () => {
//     setIsHovered(false);
//     target.current.active = false;
//     startLoop();
//   };

//   // Rendered twice: once as the real, always-interactive base plan, and
//   // once (non-interactive) inside the lens as the magnified copy.
//   const renderPlanSVG = (interactive: boolean) => (
//     <svg
//       viewBox={floorPoints?.imagesvg || "0 0 1920 1080"}
//       className="w-full h-full block"
//       preserveAspectRatio="xMidYMid meet"
//     >
//       {floorPoints?.image && (
//         <image
//           href={floorPoints.image}
//           x="0"
//           y="0"
//           width={floorPoints.imagew || "100%"}
//           height={floorPoints.imageh || "100%"}
//           preserveAspectRatio="xMidYMid meet"
//           className="brightness-95 contrast-105 bg-transparent"
//         />
//       )}
//       {viewdata && units.length > 0 && (
//         <g className={interactive ? "" : "pointer-events-none"}>
//           <UnitPlanContentPage
//             setSelectedId={interactive ? setSelectedId : () => {}}
//             pointsData={units}
//             selectedId={selectedId}
//           />
//         </g>
//       )}
//     </svg>
//   );

//   return (
//     <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden select-none">
//       {/* 1. Prev Navigation Button 
//       {handlePrev && (
//         <button
//           onClick={handlePrev}
//           className="absolute left-[10%] md:left-[12%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
//           type="button"
//           title="Previous Floor"
//         >
//           {left && <img src={left} className="w-6 h-6 text-white" alt="Previous Floor" />}
//         </button>
//       )} */}

//       {/* 2. Scalable Floor Plan Wrapper (Pan / Global Zoom) */}
//       <div
//         key={`building-stage-${idnew}`}
//         className="relative w-full h-full flex items-center justify-center will-change-transform"
//       >
//         <div
//           className={`relative w-full h-full flex items-center justify-center ${
//             zoomLevel > 1 ? "cursor-grab" : "cursor-default"
//           } ${isDragging ? "cursor-grabbing" : ""}`}
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={handlePointerUp}
//           onPointerCancel={handlePointerUp}
//         >
//           {/* Main Positioned Layer */}
//           <div
//             className="relative flex animate-zoom-back-to-front items-center justify-center will-change-transform"
//             style={{
//               transform: `translate3d(${position?.x ?? 0}px, ${position?.y ?? 0}px, 0) scale(${zoomLevel ?? 1})`,
//               transformOrigin: "center center",
//               transition: isDragging ? "none" : "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
//             }}
//           >
//             {/* Building-Only Clipped Frame */}
//             <div
//               ref={frameRef}
//               onMouseMove={handleMove}
//               onMouseLeave={handleLeave}
//               className={`relative w-[650px] md:w-[750px] lg:w-[1050px] aspect-[4/3] flex items-center justify-center rounded-2xl overflow-hidden ${
//                 isTouchDevice ? "" : "cursor-crosshair"
//               }`}
//             >
//               {/* Base layer — always sharp, always fully interactive */}
//               {renderPlanSVG(true)}

//               {/* Hover magnifier lens — desktop only, purely visual */}
//               {!isTouchDevice && (
//                 <div
//                   ref={lensRef}
//                   aria-hidden="true"
//                   className="pointer-events-none absolute top-0 left-0 rounded-full overflow-hidden ring-2 ring-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
//                   style={{
//                     width: lensSize,
//                     height: lensSize,
//                     opacity: 0,
//                     willChange: "transform, opacity",
//                   }}
//                 >
//                   <div
//                     ref={lensInnerRef}
//                     style={{
//                       width: dims.w || "100%",
//                       height: dims.h || "100%",
//                       transformOrigin: "0 0",
//                       willChange: "transform",
//                     }}
//                   >
//                     {renderPlanSVG(false)}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 3. Next Navigation Button 
//       {handleNext && (
//         <button
//           onClick={handleNext}
//           className="absolute right-[12%] md:right-[16.5%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
//           type="button"
//           title="Next Floor"
//         >
//           {right && <img src={right} className="w-6 h-6 text-white" alt="Next Floor" />}
//         </button>
//       )} */}

//       {/* 4. Side Content Card */}
//       {activePoint && (
//         <div className="absolute right-0 top-0 bottom-0 z-40 flex items-center pointer-events-auto">
//           <UnitPlanSideContent
//             key={`side-content-${idnew}`}
//             activePoint={activePoint}
//             setShowVRModal={setShowVRModal}
//             viewdata={viewdata}
//             setViewdata={setViewdata}
//           />
//         </div>
//       )}
//     </main>
//   );
// }

import React, { useState, useRef, useEffect, useCallback } from "react";
import UnitPlanContentPage from "./UnitPlanContentPage";
import UnitPlanSideContent from "./UnitPlanSideContent";

interface FloorPlanViewerProps {
  floorPoints?: any;
  units?: any[];
  selectedId?: string | number;
  setSelectedId?: (id: any) => void;
  activePoint?: any;
  setShowVRModal?: (val: boolean) => void;
  viewdata?: boolean;
  setViewdata?: (val: boolean) => void;
  handlePrev?: () => void;
  handleNext?: () => void;
  idnew?: string | number;
  zoomLevel?: number | string;
  isDragging?: boolean;
  position?: { x: number; y: number };
  handlePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
  left?: string;
  right?: string;
  /** Magnification strength of the hover lens. Default 2.5 */
  lensZoom?: number;
  /** Diameter of the lens in px. Default 260 */
  lensSize?: number;
}

export default function FloorPlanViewer({
  floorPoints,
  units = [],
  selectedId = "",
  setSelectedId = () => {},
  activePoint,
  setShowVRModal = () => {},
  viewdata = true,
  setViewdata = () => {},
//   handlePrev,
//   handleNext,
  idnew = "default",
  zoomLevel = 1,
  isDragging = false,
  position = { x: 0, y: 0 },
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
//   left,
//   right,
  lensZoom = 2.5,
  lensSize = 260,
}: FloorPlanViewerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lensInnerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const dimsRef = useRef({ w: 0, h: 0 });

  const target = useRef({ x: 0, y: 0, active: false });
  const current = useRef({ x: 0, y: 0, opacity: 0 });
  const rafId = useRef<number | null>(null);

  const LERP = 0.18;

  const numericZoom = typeof zoomLevel === "string" ? parseFloat(zoomLevel) : (zoomLevel ?? 1);
  const isGlobalZoomed = numericZoom > 1.01 || Math.abs(position?.x || 0) > 2 || Math.abs(position?.y || 0) > 2 || Boolean(isDragging);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsTouchDevice(!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      dimsRef.current = { w: width, h: height };
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyLensTransform = () => {
    const { w, h } = dimsRef.current;
    if (!lensRef.current || !lensInnerRef.current || !w || !h) return;

    const half = lensSize / 2;
    const cx = current.current.x;
    const cy = current.current.y;

    const lensX = Math.min(Math.max(cx, half), w - half);
    const lensY = Math.min(Math.max(cy, half), h - half);

    lensRef.current.style.transform = `translate3d(${lensX - half}px, ${lensY - half}px, 0)`;
    lensRef.current.style.opacity = String(current.current.opacity);

    const innerX = -(lensX * lensZoom - half);
    const innerY = -(lensY * lensZoom - half);
    lensInnerRef.current.style.transform = `translate3d(${innerX}px, ${innerY}px, 0) scale(${lensZoom})`;
  };

  const tick = useCallback(() => {
    const dx = target.current.x - current.current.x;
    const dy = target.current.y - current.current.y;
    const targetOpacity = target.current.active ? 1 : 0;
    const dOpacity = targetOpacity - current.current.opacity;

    current.current.x += dx * LERP;
    current.current.y += dy * LERP;
    current.current.opacity += dOpacity * 0.15;

    applyLensTransform();

    const settled =
      Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 && Math.abs(dOpacity) < 0.01;

    rafId.current = settled ? null : requestAnimationFrame(tick);
  }, [lensZoom, lensSize]);

  const startLoop = () => {
    if (rafId.current == null) rafId.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!floorPoints) return null;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || isTouchDevice || isGlobalZoomed) return;

    const t = e.target as HTMLElement;
    if (t.closest("foreignObject") || t.closest("button") || t.closest("aside")) {
      handleLeave();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    target.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
    if (!isHovered) setIsHovered(true);
    startLoop();
  };

  const handleLeave = () => {
    setIsHovered(false);
    target.current.active = false;
    startLoop();
  };

  // Coords strictly hide when zoomed or panning
  const showCoords = Boolean(viewdata) && units.length > 0 && !isGlobalZoomed;

  return (
    <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
      {/* Pan / Global Zoom Stage */}
      <div
        key={`building-stage-${idnew}`}
        className="relative w-full h-full flex items-center justify-center will-change-transform z-10 select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={`relative w-full  h-full flex items-center justify-center ${
            isGlobalZoomed ? "cursor-grab" : "cursor-default"
          } ${isDragging ? "cursor-grabbing" : ""}`}
        >
          {/* Base Plan Container */}
          <div
            ref={frameRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className={`relative w-[650px] md:w-[750px] lg:w-[1050px] aspect-[4/3] flex items-center justify-center rounded-2xl overflow-hidden ${
              isTouchDevice || isGlobalZoomed ? "" : "cursor-crosshair"
            }`}
          >
            {/* SVG STAGE */}
            <svg
              viewBox={floorPoints?.imagesvg || "0 0 1920 1080"}
              className="w-full h-full block"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 1. IMAGE ONLY ZOOMS & PANS */}
              <g
                style={{
                  transform: `translate3d(${position?.x ?? 0}px, ${position?.y ?? 0}px, 0) scale(${numericZoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {floorPoints?.image && (
                  <image
                    href={floorPoints.image}
                    x="0"
                    y="0"
                    width={floorPoints.imagew || "100%"}
                    height={floorPoints.imageh || "100%"}
                    preserveAspectRatio="xMidYMid meet"
                    className="brightness-95 contrast-105 bg-transparent"
                  />
                )}
              </g>

              {/* 2. COORDS / HIGHLIGHT POINTS (Hides instantly when zoomed) */}
              {showCoords && (
                <g>
                  <UnitPlanContentPage
                    setSelectedId={setSelectedId}
                    pointsData={units}
                    selectedId={selectedId}
                  />
                </g>
              )}
            </svg>

            {/* Magnifier Lens for hover inspection (Image Only) */}
            {false && !isTouchDevice && !isGlobalZoomed && (
              <div
                ref={lensRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 rounded-full overflow-hidden ring-2 ring-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                style={{
                  width: lensSize,
                  height: lensSize,
                  opacity: 0,
                  willChange: "transform, opacity",
                }}
              >
                <div
                  ref={lensInnerRef}
                  style={{
                    width: dims.w || "100%",
                    height: dims.h || "100%",
                    transformOrigin: "0 0",
                    willChange: "transform",
                  }}
                >
                  <svg
                    viewBox={floorPoints?.imagesvg || "0 0 1920 1080"}
                    className="w-full h-full block"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {floorPoints?.image && (
                      <image
                        href={floorPoints.image}
                        x="0"
                        y="0"
                        width={floorPoints.imagew || "100%"}
                        height={floorPoints.imageh || "100%"}
                        preserveAspectRatio="xMidYMid meet"
                        className="brightness-95 contrast-105 bg-transparent"
                      />
                    )}
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Content Panel (Clicks guaranteed: isolated from drag/pointer propagation) */}
      {activePoint && (
        <aside
          className="absolute right-0 top-0 bottom-0 z-50 flex items-center select-auto pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <UnitPlanSideContent
            key={`side-content-${idnew}`}
            activePoint={activePoint}
            setShowVRModal={setShowVRModal}
            viewdata={viewdata}
            setViewdata={setViewdata}
          />
        </aside>
      )}
    </main>
  );
}