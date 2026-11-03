// Area statement per floor (sq ft). Key = floor id used in UnitPlanData.ts.
export interface FloorArea {
  carpet: number;
  toiAhu: number; // Toi & AHU's
  balcony: number;
  common: number;
  leasable: number;
  efficiency: number; // %
}

export const floorAreaData: Record<string, FloorArea> = {
  '12': { carpet: 20200, toiAhu: 1722, balcony: 0, common: 4460, leasable: 26541, efficiency: 76 }, // Ground
  '11': { carpet: 23410, toiAhu: 2363, balcony: 352, common: 4969, leasable: 30694, efficiency: 76 }, // 1st
  '10': { carpet: 30642, toiAhu: 2363, balcony: 352, common: 6487, leasable: 40146, efficiency: 76 }, // 2nd
  '9': { carpet: 30626, toiAhu: 2363, balcony: 352, common: 6487, leasable: 40076, efficiency: 76 }, // 3rd
  '8': { carpet: 30642, toiAhu: 2363, balcony: 352, common: 6487, leasable: 40146, efficiency: 76 }, // 4th
  '7': { carpet: 30626, toiAhu: 2363, balcony: 352, common: 6487, leasable: 40076, efficiency: 76 }, // 5th
  '6': { carpet: 27817, toiAhu: 2363, balcony: 352, common: 5933, leasable: 36465, efficiency: 76 }, // 6th
  '5': { carpet: 30626, toiAhu: 2363, balcony: 352, common: 6487, leasable: 40076, efficiency: 76 }, // 7th
  '4': { carpet: 28394, toiAhu: 2363, balcony: 2637, common: 6180, leasable: 40040, efficiency: 71 }, // 8th
  '3': { carpet: 27817, toiAhu: 2363, balcony: 352, common: 5932, leasable: 36464, efficiency: 76 }, // 9th
  '2': { carpet: 30626, toiAhu: 2363, balcony: 352, common: 6487, leasable: 40077, efficiency: 76 }, // 10th
};
