    //  gallery unwant {
    //     "image": "https://res.cloudinary.com/db0f2ofgf/image/upload/v1777268816/Copy_of_Coffee_shop_e7mqnw.jpg",
    //     "title": "Coffee Shop",
    //     "_id": "69f0a1b35b064f66de329212"
    //   },
    //   {
    //     "image": "https://res.cloudinary.com/db0f2ofgf/image/upload/v1777268629/Copy_of_sitting_area_ruwrdt.jpg",
    //     "title": "Breakout Zone",
    //     "_id": "69f0a1b35b064f66de32921a"
    //   },

import { type FloorData } from '../types/Floorplan'

export const FLOORS: FloorData[] = [
    {
        idnew: 101, id: 'terrace', name: 'Terrace', label: 'Terrace', area: 'N/A',yaxis:270,
        polygon: '1242,267 1242,358 2708,365 2708,274', centerY: 316,

    },
    { idnew: 2, id: '10th',yaxis:380, name: '10th Floor', label: '10th', area: '30,626 sqft', polygon: '1245,362 1245,471 2701,471 2704,362', centerY: 416 },
    { idnew: 3, id: '9th',yaxis:480, name: '9th Floor', label: '9th', area: '27,817 sqft', polygon: '1249,471 1249,583 2704,583 2704,474', centerY: 528 },
    { idnew: 4, id: '8th',yaxis:610, name: '8th Floor', label: '8th', area: '28,394 sqft', polygon: '1238,573,1235,703,2711,703,2708,580', centerY: 644 },
    { idnew: 5, id: '7th',yaxis:740, name: '7th Floor', label: '7th', area: '30,626 sqft', polygon: '1235,712 1231,842 2704,835 2704,716', centerY: 776 },
    { idnew: 6, id: '6th',yaxis:860, name: '6th Floor', label: '6th', area: '27,817 sqft', polygon: '1242,840 1242,959 2708,962 2708,843', centerY: 901 },
    { idnew: 7, id: '5th',yaxis:980, name: '5th Floor', label: '5th', area: '30,626 sqft', polygon: '1242,961 1242,1101 2708,1097 2708,964', centerY: 1030 },
    { idnew: 8, id: '4th',yaxis:1120, name: '4th Floor', label: '4th', area: '30,642 sqft', polygon: '1245,1093 1242,1219 2704,1219 2701,1100', centerY: 1158 },
    { idnew: 9, id: '3rd',yaxis:1235, name: '3rd Floor', label: '3rd', area: '30,626 sqft', polygon: '1242,1215 1242,1335 2708,1349 2704,1222', centerY: 1280 },
    { idnew: 10, id: '2nd',yaxis:1360, name: '2nd Floor', label: '2nd', area: '30,642 sqft', polygon: '1242,1338 1242,1468 2704,1461 2701,1342', centerY: 1402 },
    { idnew: 11, id: '1st',yaxis:1480, name: '1st Floor', label: '1st', area: '23,410 sqft', polygon: '1238,1464 1238,1587 2708,1580 2704,1464', centerY: 1524 },
    { idnew: 12, id: 'ground',yaxis:1620, name: 'Ground Floor', label: 'Ground', area: '20,200 sqft', polygon: '1238,1583 1238,1748 2715,1741 2715,1580', centerY: 1663 },
]