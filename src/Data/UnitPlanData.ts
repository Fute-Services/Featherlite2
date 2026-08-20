const fan = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/icons/fan/public";
const health = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/icons/health/public";
const women = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/icons/women/public";
const office = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/icons/office/public";
const balcony = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/icons/balcony/public";
const mens = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/icons/mens/public";
const elevator = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/icons/elevator/public";
const image1 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/terrace/public";
const image2 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/tenth/public";
const image3 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/nineth/public";
const image4 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/eighth/public";
const image5 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/unit/7th-floor-2/public";
const image6 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/sixth/public";
const image7 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/fifth/public";
const image8 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/forth/public";
const image9 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/third/public";
const image10 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/second/public";
const image11 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/firstfloor/public";
const image12 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/iso/ground/public";
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
    polygonpopup:string,
  imagesvg:string;
    imagew:number;
    imageh:number;
  units: Unit[];
}
export const pointsData: FloorPointsData[] = [
{
    id:101,
    name:"Terrace",
    image:image1,
    imagesvg:"0 0 2000 1125",
    polygonpopup:"791,193,748,373,1149,380,1132,196",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 101,
      
        name: '',
        subtitle: '',
        iconType: 'fan',
        icon: fan,
        x: 0,
        y: 0,
        labelX: 0,
        labelY: 0,

        points: [
            {
                x: 0,
                y: 0
            },
           
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779167779/entry_gate_rk0ekp.png',
    },
  
]
},


{
    id:2,
    name:"10th Floor",
    image:image2,
      polygonpopup:"851,276,835,407,1084,403,1080,272",
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room (2,363 sqft)',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 1500,
        labelY: 120,

        points: [
                  {
          "x": 1184,
          "y": 135
        },
        {
          "x": 1379,
          "y": 135
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
        labelX: 420,
        labelY: 280,
        points: [
          {
          "x": 847,
          "y": 137
        },
        {
          "x": 828,
          "y": 299
        },
        {
          "x": 541,
          "y": 302
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
        labelX: 420,
        labelY: 280,
        points: [
      {
          "x": 1128,
          "y": 140
        },
        {
          "x": 1129,
          "y": 201,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 836,
          "y": 199
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
        labelY: 480,
        points: [
           {
          "x": 953,
          "y": 136
        },
        {
          "x": 947,
          "y": 487
        },
        {
          "x": 484,
          "y": 487
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
        labelY: 480,
        points: [
            {
          "x": 1006,
          "y": 138
        },
        {
          "x": 1006,
          "y": 170,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 952,
          "y": 170
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
        labelX: 1500,
        labelY: 305,
        points: [
         {
          "x": 1071,
          "y": 291
        },
        {
          "x": 1411,
          "y": 295,
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
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony (352 sqft)',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 470,
        labelY: 100,
        points: [
            {
          "x": 788,
          "y": 105
        },
        {
          "x": 788,
          "y": 71,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 597,
          "y": 71
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
        labelX: 1550,
        labelY: 520,
        points: [
             {
          "x": 900,
          "y": 140
        },
        {
          "x": 883,
          "y": 529
        },
        {
          "x": 1445,
          "y": 531
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
        labelX: 1550,
        labelY: 500,
        points: [
        {
          "x": 1071,
          "y": 134
        },
        {
          "x": 1070,
          "y": 182,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 899,
          "y": 182
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
        labelX: 330,
        labelY: 650,
        points: [
            {
          "x": 969,
          "y": 361
        },
        {
          "x": 966,
          "y": 657,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 431,
          "y": 663
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
      polygonpopup:"851,324,837,440,1077,440,1071,324",
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room (2,363 sqft)',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
           labelX: 450,
        labelY: 180,
        points: [
            {
          "x": 775,
          "y": 171
        },
        {
          "x": 574,
          "y": 172
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
        labelY: 280,
        points: [
         
    
        {
          "x": 1188,
          "y": 177
        },
        {
          "x": 1190,
          "y": 213,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 677,
          "y": 213
        },
        {
          "x": 682,
          "y": 169
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
        labelX: 1535,
        labelY: 480,
        points: [
          {
          "x": 829,
          "y": 182
        },
        {
          "x": 800,
          "y": 534
        },
        {
          "x": 1470,
          "y": 534
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
        labelY: 560,
        points: [
           {
          "x": 1135,
          "y": 175
        },
        {
          "x": 1141,
          "y": 533
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
        labelY: 520,
        points: [
           {
          "x": 959,
          "y": 168
        },
        {
          "x": 947,
          "y": 505
        },
        {
          "x": 435,
          "y": 511
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
        labelY: 520,
        points: [
         {
          "x": 1003,
          "y": 169
        },
        {
          "x": 1002,
          "y": 341
        },
        {
          "x": 953,
          "y": 341
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
        labelX: 1600,
        labelY: 735,
        points: [
           {
          "x": 1048,
          "y": 311
        },
        {
          "x": 1048,
          "y": 748
        },
        {
          "x": 1529,
          "y": 746
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },


    {
        id: 5,
        name: 'ODU Balcony (352 sqft)',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1510,
        labelY: 150,
        points: [
             {
          "x": 788,
          "y": 146
        },
        {
          "x": 790,
          "y": 112,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 1235,
          "y": 113
        },
        {
          "x": 1235,
          "y": 142
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
          "x": 1186,
          "y": 142
        },
        {
          "x": 1432,
          "y": 144
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
        labelX: 1515,
        labelY: 300,
        points: [
             {
          "x": 892,
          "y": 170
        },
        {
          "x": 886,
          "y": 283
        },
        {
          "x": 1439,
          "y": 284
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
        labelX: 1550,
        labelY: 600,
        points: [
           {
          "x": 1065,
          "y": 170
        },
        {
          "x": 1067,
          "y": 282,
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
        labelX: 370,
        labelY: 720,
        points: [
              {
          "x": 975,
          "y": 391
        },
        {
          "x": 968,
          "y": 728
        },
        {
          "x": 345,
          "y": 732
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
      polygonpopup:"856,359,838,490,1077,486,1071,361",
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room (2,363 sqft)',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 450,
        labelY: 210,

        points: [
            {
          "x": 779,
          "y": 210
        },
        {
          "x": 588,
          "y": 210
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
        labelX: 370,
        labelY: 290,

        points: [
           {
          "x": 1181,
          "y": 209
        },
        {
          "x": 1182,
          "y": 237,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 764,
          "y": 236
        },
        {
          "x": 765,
          "y": 209
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
        labelX: 425,
        labelY: 360,
        points: [
          {
          "x": 1131,
          "y": 215
        },
        {
          "x": 1139,
          "y": 363
        },
        {
          "x": 564,
          "y": 365
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
        labelY: 360,
        points: [
          {
          "x": 829,
          "y": 216
        },
        {
          "x": 817,
          "y": 366,
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
        labelX: 1550,
        labelY: 370,
        points: [
              {
          "x": 962,
          "y": 207
        },
        {
          "x": 960,
          "y": 378
        },
        {
          "x": 1481,
          "y": 375
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
        labelX: 1530,
        labelY: 820,
        points: [
            {
          "x": 1009,
          "y": 205
        },
        {
          "x": 1012,
          "y": 378
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
        labelX: 1580,
        labelY: 625,
        points: [
            {
          "x": 1062,
          "y": 322
        },
        {
          "x": 1070,
          "y": 599
        },
        {
          "x": 1485,
          "y": 597
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
    {
        id: 5,
        name: 'ODU Balcony (2,637 sqft)',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1490,
        labelY: 180,
        points: [
            {
          "x": 787,
          "y": 185
        },
        {
          "x": 788,
          "y": 153,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 1221,
          "y": 156
        },
        {
          "x": 1222,
          "y": 192
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
        labelY: 150,
        points: [
       {
          "x": 1178,
          "y": 192
        },
        {
          "x": 1369,
          "y": 191
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
        labelX: 370,
        labelY: 650,
        points: [
             {
          "x": 898,
          "y": 207
        },
        {
          "x": 879,
          "y": 647
        },
        {
          "x": 508,
          "y": 648
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
        labelX: 1550,
        labelY: 500,
        points: [
              {
          "x": 1067,
          "y": 209
        },
        {
          "x": 1069,
          "y": 269
        },
        {
          "x": 896,
          "y": 269
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
        labelX: 1600,
        labelY: 780,
        points: [
             {
          "x": 980,
          "y": 431
        },
        {
          "x": 977,
          "y": 760
        },
        {
          "x": 1491,
          "y": 763
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
      polygonpopup:"1079,522,1072,668,1366,664,1364,520",
    imagesvg:"0 0 2546 1432",
    imagew:2546,
    imageh:1432,

    units:[
  {
        id: 1,
      
       name: 'AHU Room (2,363 sqft)',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 600,
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
        name: 'ODU Balcony (352 sqft)',
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
      polygonpopup:"847,445,837,560,1071,553,1068,445",
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
        name: 'AHU Room (2,363 sqft)',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 430,
        labelY: 290,

        points: [
            {
          "x": 785,
          "y": 279
        },
        {
          "x": 568,
          "y": 280
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
        labelX: 570,
        labelY: 290,

        points: [
          {
          "x": 1179,
          "y": 278
        },
        {
          "x": 1183,
          "y": 323
        },
        {
          "x": 711,
          "y": 325
        },
        {
          "x": 712,
          "y": 282
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
        labelX: 360,
        labelY: 490,
        points: [
             {
          "x": 835,
          "y": 287
        },
        {
          "x": 821,
          "y": 527
        },
        {
          "x": 494,
          "y": 528
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
        labelX: 550,
        labelY: 560,
        points: [
           {
          "x": 1132,
          "y": 285
        },
        {
          "x": 1140,
          "y": 424
        },
        {
          "x": 825,
          "y": 427
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
        labelX: 1470,
        labelY: 400,
        points: [
            {
          "x": 960,
          "y": 277
        },
        {
          "x": 959,
          "y": 388
        },
        {
          "x": 1342,
          "y": 386
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
        labelX: 1540,
        labelY: 720,
        points: [
                 {
          "x": 1005,
          "y": 278
        },
        {
          "x": 1006,
          "y": 388,
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
        labelX: 1580,
        labelY: 765,
        points: [
           {
          "x": 1148,
          "y": 529
        },
        {
          "x": 1148,
          "y": 792
        },
        {
          "x": 1586,
          "y": 797
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
  
    {
        id: 5,
        name: 'ODU Balcony (352 sqft)',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1490,
        labelY: 230,
        points: [
             {
          "x": 790,
          "y": 248
        },
        {
          "x": 792,
          "y": 205
        },
        {
          "x": 1362,
          "y": 202
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
          "x": 1181,
          "y": 250
        },
        {
          "x": 1182,
          "y": 204,
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
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1540,
        labelY: 550,
        points: [
              {
          "x": 900,
          "y": 273
        },
        {
          "x": 896,
          "y": 460
        },
        {
          "x": 1120,
          "y": 460
        },
        {
          "x": 1123,
          "y": 555
        },
        {
          "x": 1411,
          "y": 553
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
        labelX: 1550,
        labelY: 500,
        points: [
           {
          "x": 1068,
          "y": 276
        },
        {
          "x": 1074,
          "y": 461,
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
        labelX: 320,
        labelY: 720,
        points: [
           {
          "x": 976,
          "y": 523
        },
        {
          "x": 977,
          "y": 713
        },
        {
          "x": 443,
          "y": 725
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
      polygonpopup:"833,479,828,597,1061,594,1057,479",
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
  {
        id: 1,
      
         name: 'AHU Room (2,363 sqft)',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 435,
        labelY: 350,

        points: [
            {
          "x": 788,
          "y": 311
        },
        {
          "x": 785,
          "y": 365
        },
        {
          "x": 551,
          "y": 364
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
        labelX: 370,
        labelY: 290,

        points: [
           {
          "x": 1180,
          "y": 313
        },
        {
          "x": 1181,
          "y": 364
        },
        {
          "x": 786,
          "y": 364
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
        labelX: 430,
        labelY: 500,
        points: [
           {
          "x": 847,
          "y": 317
        },
        {
          "x": 833,
          "y": 480
        },
        {
          "x": 565,
          "y": 481
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
        labelX: 420,
        labelY: 500,
        points: [
           {
          "x": 1112,
          "y": 316
        },
        {
          "x": 1117,
          "y": 478
        },
        {
          "x": 832,
          "y": 479
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
        labelY: 670,
        points: [
          {
          "x": 959,
          "y": 315
        },
        {
          "x": 955,
          "y": 493
        },
        {
          "x": 1081,
          "y": 493
        },
        {
          "x": 1084,
          "y": 666
        },
        {
          "x": 1436,
          "y": 668
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
        labelX: 1530,
        labelY: 820,
        points: [
              {
          "x": 1005,
          "y": 315
        },
        {
          "x": 1005,
          "y": 494,
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
        labelX: 1570,
        labelY: 820,
        points: [
           {
          "x": 1140,
          "y": 483
        },
        {
          "x": 1145,
          "y": 782
        },
        {
          "x": 1559,
          "y": 787
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
   
    {
        id: 5,
        name: 'ODU Balcony (352 sqft)',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1510,
        labelY: 250,
        points: [
            {
          "x": 789,
          "y": 285
        },
        {
          "x": 792,
          "y": 232
        },
        {
          "x": 1384,
          "y": 229
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
          "x": 1172,
          "y": 283
        },
        {
          "x": 1172,
          "y": 231,
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
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 1540,
        labelY: 450,
        points: [
            {
          "x": 898,
          "y": 315
        },
        {
          "x": 897,
          "y": 372
        },
        {
          "x": 1128,
          "y": 372
        },
        {
          "x": 1132,
          "y": 445
        },
        {
          "x": 1413,
          "y": 443
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
        labelX: 1540,
        labelY: 450,
        points: [
           {
          "x": 1063,
          "y": 311
        },
        {
          "x": 1064,
          "y": 373,
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
        labelX: 360,
        labelY: 720,
        points: [
          {
          "x": 979,
          "y": 553
        },
        {
          "x": 839,
          "y": 553
        },
        {
          "x": 829,
          "y": 712
        },
        {
          "x": 482,
          "y": 716
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
    polygonpopup:"849,520,838,636,1082,633,1071,518",
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
      {
        id: 1,
      
        name: 'AHU Room (2,363 sqft)',
        subtitle: 'Mechanical ventilation and air-handling zone',
        iconType: 'fan',
        icon: fan,
        x: 900,
        y: 480,
        labelX: 380,
        labelY: 390,

        points: [
          {
          "x": 791,
          "y": 347
        },
        {
          "x": 783,
          "y": 427
        },
        {
          "x": 517,
          "y": 427
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
        labelX: 370,
        labelY: 290,

        points: [
           {
          "x": 1175,
          "y": 349
        },
        {
          "x": 1179,
          "y": 427
        },
        {
          "x": 786,
          "y": 427
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
        labelY: 395,
        points: [
              {
          "x": 852,
          "y": 348
        },
        {
          "x": 844,
          "y": 441
        },
        {
          "x": 1380,
          "y": 436
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
        labelX: 1550,
        labelY: 660,
        points: [
             {
          "x": 1108,
          "y": 338
        },
        {
          "x": 1110,
          "y": 441
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
        labelX: 1515,
        labelY: 540,
        points: [
        {
          "x": 958,
          "y": 343
        },
        {
          "x": 958,
          "y": 521
        },
        {
          "x": 1386,
          "y": 520
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
        labelX: 1520,
        labelY: 950,
        points: [
           {
          "x": 1011,
          "y": 342
        },
        {
          "x": 1018,
          "y": 521,
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
        labelX: 1550,
        labelY: 800,
        points: [
           {
          "x": 1170,
          "y": 470
        },
        {
          "x": 1177,
          "y": 785
        },
        {
          "x": 1596,
          "y": 790
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
   
    {
        id: 5,
        name: 'ODU Balcony (352 sqft)',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1460,
        labelY: 250,
        points: [
              {
          "x": 796,
          "y": 321
        },
        {
          "x": 799,
          "y": 273
        },
        {
          "x": 1345,
          "y": 273
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
        labelX: 1460,
        labelY: 250,
        points: [
             {
          "x": 1170,
          "y": 314
        },
        {
          "x": 1170,
          "y": 274,
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
        name: "Men's Washroom",
        subtitle: 'Dedicated washroom facilities',
        icon: mens,
        iconType: 'user',
        x: 1500,
        y: 650,
        labelX: 360,
        labelY: 750,
        points: [
             {
          "x": 904,
          "y": 347
        },
        {
          "x": 883,
          "y": 745
        },
        {
          "x": 495,
          "y": 753
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
        labelX: 350,
        labelY: 600,
        points: [
          {
          "x": 1067,
          "y": 346
        },
        {
          "x": 1067,
          "y": 378,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 901,
          "y": 377
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
        labelY: 550,
        points: [
          {
          "x": 975,
          "y": 578
        },
        {
          "x": 500,
          "y": 578
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
    polygonpopup:"844,560,837,677,1080,677,1079,557",
    imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
      {
        id: 1,
      
         name: 'AHU Room (2,363 sqft)',
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
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1550,
        labelY: 800,
        points: [
           {
          "x": 1135,
          "y": 526
        },
        {
          "x": 1143,
          "y": 821
        },
        {
          "x": 1542,
          "y": 821
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
   
    {
        id: 5,
        name: 'ODU Balcony (352 sqft)',
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
    polygonpopup:"846,594,838,712,1077,712,1070,597",
     imagesvg:"0 0 2000 1125",
    imagew:2000,
    imageh:1125,
    units:[
      {
        id: 1,
      
        name: 'AHU Room (2,363 sqft)',
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
        id: 4,
        name: 'Office Space',
        subtitle: 'Massive customizable office space.',
        icon: office,
        iconType: 'monitor',
        x: 1250,
        y: 400,
        labelX: 1550,
        labelY: 850,
        points: [
           {
          "x": 1128,
          "y": 595
        },
        {
          "x": 1140,
          "y": 882
        },
        {
          "x": 1618,
          "y": 880
        }
        ],
        detailImage: 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1776410532/retail_qzuvno.jpg',
    },
   
    {
        id: 5,
        name: 'ODU Balcony (352 sqrt)',
        subtitle: 'Outdoor unit placement area',
        icon: balcony,
        iconType: 'box',
        x: 1550,
        y: 500,
        labelX: 1500,
        labelY: 290,
        points: [
           {
          "x": 1168,
          "y": 381
        },
        {
          "x": 1168,
          "y": 312,
          "hIn": {
            "x": 0,
            "y": 0
          },
          "hOut": {
            "x": 0,
            "y": 0
          },
          "smooth": true
        },
        {
          "x": 1425,
          "y": 311
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
    polygonpopup:"688,509,678,604,880,601,876,506",
    imagesvg:"0 0 1600 900",
    imagew:1600,
    imageh:900,
    units:[
      {
        id: 1,
      
        name: 'AHU Room (2,363 sqft)',
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
        name: 'ODU Balcony (352 sqrt)',
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
    polygonpopup:"860,668,853,790,1132,790,1124,668",
    units:[
      {
        id: 1,
      
         name: 'AHU Room (1,722 sqft)',
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
        name: 'ODU Balcony (0 sqft)',
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
