import fan from '../assets/floorplan/icons/fan.png'
import health from '../assets/floorplan/icons/health.png'
import women from '../assets/floorplan/icons/women.png'
import office from '../assets/floorplan/icons/office.png'
import balcony from '../assets/floorplan/icons/balcony.png'
import mens from '../assets/floorplan/icons/mens.png'
import elevator from '../assets/floorplan/icons/elevator.png'
import image1 from '../assets/floorplan/ISO/terrace.png'
import image2 from '../assets/floorplan/ISO/tenth.png'
import image3 from '../assets/floorplan/ISO/nineth.png';
import image4 from '../assets/floorplan/ISO/eighth.png';
import image5 from '../assets/floorplan/unit/7th floor 2.png';
import image6 from '../assets/floorplan/ISO/sixth.png';
import image7 from '../assets/floorplan/ISO/fifth.png';

import image8 from '../assets/floorplan/ISO/forth.png';
import image9 from '../assets/floorplan/ISO/third.png';
import image10 from '../assets/floorplan/ISO/second.png';
import image11 from '../assets/floorplan/ISO/firstfloor.png';
import image12 from '../assets/floorplan/ISO/ground.png'
export interface SubPoint {
  x: number;
  y: number;
  hIn?: { x: number; y: number };
  hOut?: { x: number; y: number };
  smooth?: boolean;
}

export interface Unit {
  id: number;
  name: string;
  subtitle?: string;
  iconType: 'fan' | 'shield' | 'user' | 'monitor' | 'box';
  x: number;
  y: number;
  icon: string;
  labelX: number;
  labelY: number;
  points: SubPoint[];
  detailImage: string;
}

export interface FloorPointsData {
  id: number | string; // Matches route id
  name: string;
  image: string;
  imagesvg:string;
    imagew:number;
    imageh:number;
  units: Unit[];
}
export const pointsData: FloorPointsData[] = [
{
    id:1,
    name:"Terrace",
    image:image1,
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1180,
        labelY: 125,
        points: [
            {
          x: 1157,
          y: 503
        },
        {
          x: 1160,
          y: 208
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1890,
        labelY: 820,
        points: [
            {
                x: 1303,
                y: 586
            },
            {
                x: 1431,
                y: 586
            },
            {
                x: 1431,
                y: 811
            },
            {
                x: 1788,
                y: 815
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},


{
    id:2,
    name:"10th Floor",
    image:image2,
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1180,
        labelY: 125,
        points: [
            {
          x: 1157,
          y: 503
        },
        {
          x: 1160,
          y: 208
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1890,
        labelY: 820,
        points: [
            {
                x: 1303,
                y: 586
            },
            {
                x: 1431,
                y: 586
            },
            {
                x: 1431,
                y: 811
            },
            {
                x: 1788,
                y: 815
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},

{
    id:3,
    name:"9th Floor",
    image:image3,
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1180,
        labelY: 125,
        points: [
            {
          x: 1157,
          y: 503
        },
        {
          x: 1160,
          y: 208
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1890,
        labelY: 820,
        points: [
            {
                x: 1303,
                y: 586
            },
            {
                x: 1431,
                y: 586
            },
            {
                x: 1431,
                y: 811
            },
            {
                x: 1788,
                y: 815
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},



{
    id:4,
    name:"8th Floor",
    image:image4,
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1180,
        labelY: 125,
        points: [
            {
          x: 1157,
          y: 503
        },
        {
          x: 1160,
          y: 208
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1890,
        labelY: 820,
        points: [
            {
                x: 1303,
                y: 586
            },
            {
                x: 1431,
                y: 586
            },
            {
                x: 1431,
                y: 811
            },
            {
                x: 1788,
                y: 815
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},





{
    id:5,
    name:"7th Floor",
    image:image5,
    imagesvg:"0 0 2546 1432",
    imagew:2546,
    imageh:1432,

    units:[
  {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1860,
        labelY: 638,
        points: [
         {
          x: 1222,
          y: 499
        },
        {
          x: 1427,
          y: 499
        },
        {
          x: 1430,
          y: 614
        },
        {
          x: 1741,
          y: 614
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1892,
        labelY: 840,
        points: [
           {
          x: 1305,
          y: 601
        },
         {
          x: 1305,
          y: 862
        },
        {
          x: 1794,
          y: 869
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},



{
    id:6,
    name:"6th Floor",
    image:image6,
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1180,
        labelY: 125,
        points: [
            {
          x: 1157,
          y: 503
        },
        {
          x: 1160,
          y: 208
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1890,
        labelY: 820,
        points: [
            {
                x: 1303,
                y: 586
            },
            {
                x: 1431,
                y: 586
            },
            {
                x: 1431,
                y: 811
            },
            {
                x: 1788,
                y: 815
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},


{
    id:7,
    name:"5th Floor",
    image:image7,
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1180,
        labelY: 125,
        points: [
            {
          x: 1157,
          y: 503
        },
        {
          x: 1160,
          y: 208
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1890,
        labelY: 820,
        points: [
            {
                x: 1303,
                y: 586
            },
            {
                x: 1431,
                y: 586
            },
            {
                x: 1431,
                y: 811
            },
            {
                x: 1788,
                y: 815
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},


{
    id:8,
    name:"4th Floor",
    image:image8,
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
      {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 570,
        labelY: 290,

        points: [
            {
                x: 1003,
                y: 322
            },
            {
                x: 896,
                y: 322
            },
            {
                x: 900,
                y: 280
            },
            {
                x: 740,
                y: 281
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 550,
        labelY: 560,
        points: [
            {
                x: 1083,
                y: 323
            },
            {
                x: 1071,
                y: 544
            },
            {
                x: 699,
                y: 545
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
            {
                x: 1246,
                y: 315
            },
            {
                x: 1234,
                y: 805
            },
            {
                x: 618,
                y: 809
            }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1180,
        labelY: 125,
        points: [
            {
          x: 1157,
          y: 503
        },
        {
          x: 1160,
          y: 208
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
            {
                x: 1488,
                y: 276
            },
            {
                x: 1656,
                y: 276
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1850,
        labelY: 500,
        points: [
            {
                x: 1352,
                y: 325
            },
            {
                x: 1356,
                y: 480
            },
            {
                x: 1757,
                y: 476
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 1890,
        labelY: 820,
        points: [
            {
                x: 1303,
                y: 586
            },
            {
                x: 1431,
                y: 586
            },
            {
                x: 1431,
                y: 811
            },
            {
                x: 1788,
                y: 815
            }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},


{
    id:9,
    name:"3rd Floor",
    image:image9,
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
      {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 1520,
        labelY: 590,

        points: [
            {
          "x": 794,
          "y": 380
        },
        {
          "x": 780,
          "y": 566
        },
        {
          "x": 1417,
          "y": 569
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },

     {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 1500,
        labelY: 590,

        points: [
           {
          "x": 1177,
          "y": 375
        },
        {
          "x": 1194,
          "y": 568
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 400,
        labelY: 360,
        points: [
           {
          "x": 858,
          "y": 383
        },
        {
          "x": 538,
          "y": 385
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
      {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 450,
        labelY: 460,
        points: [
          {
          "x": 1119,
          "y": 382
        },
        {
          "x": 1118,
          "y": 285
        },
        {
          "x": 823,
          "y": 283
        },
        {
          "x": 821,
          "y": 381
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 380,
        labelY: 550,
        points: [
            {
          "x": 958,
          "y": 375
        },
        {
          "x": 958,
          "y": 553
        },
        {
          "x": 519,
          "y": 551
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
     {
        id: 3,
    
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 380,
        labelY: 550,
        points: [
            {
          "x": 1014,
          "y": 370
        },
        {
          "x": 1016,
          "y": 551
        },
        {
          "x": 960,
          "y": 553
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
   
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1500,
        labelY: 290,
        points: [
             {
          "x": 794,
          "y": 346
        },
        {
          "x": 795,
          "y": 293
        },
        {
          "x": 1385,
          "y": 288
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
        {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1500,
        labelY: 290,
        points: [
           {
          "x": 1172,
          "y": 341
        },
        {
          "x": 1171,
          "y": 290,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1500,
        labelY: 420,
        points: [
            {
          "x": 907,
          "y": 374
        },
        {
          "x": 906,
          "y": 433
        },
        {
          "x": 1383,
          "y": 428
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },

     {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1500,
        labelY: 420,
        points: [
            {
          "x": 1060,
          "y": 375
        },
        {
          "x": 1061,
          "y": 432,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 335,
        labelY: 780,
        points: [
          {
          "x": 980,
          "y": 619
        },
        {
          "x": 977,
          "y": 785
        },
        {
          "x": 429,
          "y": 790
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},

{
    id:10,
    name:"2nd Floor",
    image:image10,
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
      {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 400,
        labelY: 440,

        points: [
            {
          "x": 793,
          "y": 414
        },
        {
          "x": 785,
          "y": 488
        },
        {
          "x": 540,
          "y": 486
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
     {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 400,
        labelY: 440,

        points: [
           {
          "x": 1176,
          "y": 414
        },
        {
          "x": 1185,
          "y": 488
        },
        {
          "x": 789,
          "y": 488
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 1500,
        labelY: 460,
        points: [
            {
          "x": 857,
          "y": 414
        },
        {
          "x": 855,
          "y": 473
        },
        {
          "x": 1397,
          "y": 467
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },

     {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 1500,
        labelY: 460,
        points: [
             {
          "x": 1111,
          "y": 408
        },
        {
          "x": 1113,
          "y": 473,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 340,
        labelY: 780,
        points: [
            {
          "x": 960,
          "y": 407
        },
        {
          "x": 953,
          "y": 791
        },
        {
          "x": 479,
          "y": 786
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
     {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 230,
        labelY: 820,
        points: [
           {
          "x": 1009,
          "y": 410
        },
        {
          "x": 1009,
          "y": 444
        },
        {
          "x": 960,
          "y": 444
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
   
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1500,
        labelY: 290,
        points: [
           {
          "x": 1174,
          "y": 383
        },
        {
          "x": 1172,
          "y": 309,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
     {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1500,
        labelY: 290,
        points: [
         {
          "x": 798,
          "y": 384
        },
        {
          "x": 802,
          "y": 309
        },
        {
          "x": 1406,
          "y": 305
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1520,
        labelY: 600,
        points: [
           {
          "x": 904,
          "y": 408
        },
        {
          "x": 899,
          "y": 598
        },
        {
          "x": 1387,
          "y": 593
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
      {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1520,
        labelY: 600,
        points: [
         {
          "x": 1058,
          "y": 408
        },
        {
          "x": 1066,
          "y": 596
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 370,
        labelY: 640,
        points: [
            {
          "x": 977,
          "y": 657
        },
        {
          "x": 505,
          "y": 657
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},

{
    id:11,
    name:"1st Floor",
    image:image11,
    imagesvg:"0 0 1600 900",
    imagew:1600,
    imageh:900,
    units:[
      {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 450,
        labelX: 320,
        labelY: 260,

        points: [
           {
          "x": 639,
          "y": 359
        },
        {
          "x": 643,
          "y": 279
        },
        {
          "x": 442,
          "y": 279
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },

      {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 320,
        labelY: 260,

        points: [
          {
          "x": 933,
          "y": 359
        },
        {
          "x": 930,
          "y": 281
        },
        {
          "x": 646,
          "y": 279
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 1250,
        labelY: 380,
        points: [
             {
          "x": 692,
          "y": 351
        },
        {
          "x": 688,
          "y": 420
        },
        {
          "x": 1138,
          "y": 416
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
     {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 1250,
        labelY: 380,
        points: [
           {
          "x": 886,
          "y": 348
        },
        {
          "x": 886,
          "y": 420
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 270,
        labelY: 390,
        points: [
           {
          "x": 769,
          "y": 348
        },
        {
          "x": 766,
          "y": 449
        },
        {
          "x": 380,
          "y": 446
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },

      {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 530,
        labelY: 820,
        points: [
          {
          "x": 807,
          "y": 349
        },
        {
          "x": 805,
          "y": 449
        },
        {
          "x": 766,
          "y": 449
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
  
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1200,
        labelY: 250,
        points: [
            {
          "x": 643,
          "y": 324
        },
        {
          "x": 645,
          "y": 256
        },
        {
          "x": 1077,
          "y": 256
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
     {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1800,
        labelY: 290,
        points: [
           {
          "x": 922,
          "y": 332
        },
        {
          "x": 922,
          "y": 256
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1250,
        labelY: 520,
        points: [
        {
          "x": 726,
          "y": 355
        },
        {
          "x": 719,
          "y": 515
        },
        {
          "x": 1192,
          "y": 510
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },

     {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1280,
        labelY: 520,
        points: [
        {
          "x": 850,
          "y": 355
        },
        {
          "x": 854,
          "y": 516,
          "hIn": {
            "x": 0,
            "y": 2
          },
          "hOut": {
            "x": 0,
            "y": -2
          },}
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 270,
        labelY: 535,
        points: [
            {
          "x": 780,
          "y": 552
        },
        {
          "x": 407,
          "y": 551
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},

{
    id:12,
    name:"Ground Floor",
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    image:image12,
    units:[
      {
        id: 1,
      
        name: 'AHU Room',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 370,
        labelY: 490,

        points: [
             {
          "x": 802,
          "y": 495
        },
        {
          "x": 509,
          "y": 492
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
    {
        id: 2,
        name: 'Fire Tower',
        subtitle: 'Fire escape stairs and safety zone',
        icon: health,
        iconType: 'shield',
        x: 850,
        y: 600,
        labelX: 1500,
        labelY: 460,
        points: [
          {
          "x": 1109,
          "y": 476
        },
        {
          "x": 1378,
          "y": 474
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/dropoff_hphas8.png',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 1550,
        labelY: 620,
        points: [
            {
          "x": 960,
          "y": 470
        },
        {
          "x": 954,
          "y": 635
        },
        {
          "x": 1442,
          "y": 635
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 3,
        name: "Women's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: women,
        iconType: 'user',
        x: 950,
        y: 700,
        labelX: 1550,
        labelY: 620,
        points: [
           {
          "x": 1008,
          "y": 468
        },
        {
          "x": 1008,
          "y": 638
        }
        ],
        detailImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    // {
    //     id: 4,
    //     name: 'Office Space',
    //     subtitle: 'Massive customizable office space.',
    //     icon: office,
    //     iconType: 'monitor',
    //     x: 1250,
    //     y: 400,
    //     labelX: 1180,
    //     labelY: 125,
    //     points: [
    //         {
    //       x: 1157,
    //       y: 503
    //     },
    //     {
    //       x: 1160,
    //       y: 208
    //     }
    //     ],
    //     detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    // },
    {
        id: 5,
        name: 'ODU Balcony',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 400,
        labelY: 350,
        points: [
         {
          "x": 809,
          "y": 457
        },
        {
          "x": 814,
          "y": 398
        },
        {
          "x": 547,
          "y": 396
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183497/reception_znsboa_1_oaowtz.jpg',
    },
    {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1500,
        labelY: 300,
        points: [
           {
          "x": 908,
          "y": 465
        },
        {
          "x": 910,
          "y": 334
        },
        {
          "x": 1374,
          "y": 336
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
      {
        id: 6,
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1500,
        labelY: 300,
        points: [
          {
          "x": 1060,
          "y": 470
        },
        {
          "x": 1061,
          "y": 334
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779183182/cafenew_1_ejb6xp.jpg',
    },
    {
        id: 7,
        name: 'Lift Lobby',
        subtitle: '6 passenger\'s and 2 service lift for smooth flow',
        icon: elevator,
        iconType: 'user',
        x: 1450,
        y: 750,
        labelX: 350,
        labelY: 690,
        points: [
             {
          "x": 975,
          "y": 712
        },
        {
          "x": 482,
          "y": 709
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776409574/leftlobby_hhdbqu.jpg',
    },
]
},






] 