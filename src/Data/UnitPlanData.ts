import fan from '../assets/floorplan/icons/fan.png'
import health from '../assets/floorplan/icons/health.png'
import women from '../assets/floorplan/icons/women.png'
import office from '../assets/floorplan/icons/office.png'
import balcony from '../assets/floorplan/icons/balcony.png'
import mens from '../assets/floorplan/icons/mens.png'
import elevator from '../assets/floorplan/icons/elevator.png'

interface SubPoint {
    x: number;
    y: number;
    hIn?: { x: number; y: number };
    hOut?: { x: number; y: number };
    smooth?: boolean;
}

interface Point {
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

export const pointsData: Point[] = [
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
];