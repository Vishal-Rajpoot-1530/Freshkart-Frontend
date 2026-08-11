export type PartnerStatus = "verified" | "pending" | "suspended";

export type Seller = {
  id: string;
  store: string;
  owner: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  gstin: string;
  fssai: string;
  onboarded: string;
  status: PartnerStatus;
  rating: number;
  ordersFulfilled: number;
  skus: number;
  salesMonth: number;
  cancellationRate: number;
  documents: { name: string; verified: boolean }[];
};

export type Rider = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zone: string;
  city: string;
  vehicle: string;
  plate: string;
  licence: string;
  joined: string;
  status: PartnerStatus;
  rating: number;
  trips: number;
  earningsMonth: number;
  onTimeRate: number;
  documents: { name: string; verified: boolean }[];
};

export const sellers: Seller[] = [
  {
    id: "SLR-1001", store: "Green Basket Mart", owner: "Rakesh Nair", phone: "+91 98450 11223",
    email: "rakesh@greenbasket.in", city: "Bengaluru", area: "HSR Layout", gstin: "29ABCDE1234F1Z5",
    fssai: "11223344556677", onboarded: "Mar 2024", status: "verified", rating: 4.7,
    ordersFulfilled: 18420, skus: 842, salesMonth: 1_284_000, cancellationRate: 1.2,
    documents: [{ name: "GST certificate", verified: true }, { name: "FSSAI licence", verified: true }, { name: "PAN card", verified: true }, { name: "Bank proof", verified: true }],
  },
  {
    id: "SLR-1002", store: "Daily Fresh Hub", owner: "Priya Menon", phone: "+91 98860 44551",
    email: "priya@dailyfresh.co", city: "Bengaluru", area: "Koramangala", gstin: "29PQRSX9876K1Z2",
    fssai: "22334455667788", onboarded: "Jul 2024", status: "pending", rating: 4.3,
    ordersFulfilled: 940, skus: 316, salesMonth: 214_500, cancellationRate: 3.8,
    documents: [{ name: "GST certificate", verified: true }, { name: "FSSAI licence", verified: false }, { name: "PAN card", verified: true }, { name: "Bank proof", verified: false }],
  },
  {
    id: "SLR-1003", store: "Namma Kirana", owner: "Suresh Gowda", phone: "+91 90080 77341",
    email: "suresh@nammakirana.in", city: "Bengaluru", area: "Jayanagar", gstin: "29LMNOP4567Q1Z9",
    fssai: "33445566778899", onboarded: "Jan 2024", status: "verified", rating: 4.5,
    ordersFulfilled: 12310, skus: 621, salesMonth: 806_200, cancellationRate: 2.1,
    documents: [{ name: "GST certificate", verified: true }, { name: "FSSAI licence", verified: true }, { name: "PAN card", verified: true }, { name: "Bank proof", verified: true }],
  },
  {
    id: "SLR-1004", store: "Urban Pantry", owner: "Farhan Qureshi", phone: "+91 97400 66512",
    email: "farhan@urbanpantry.shop", city: "Bengaluru", area: "Indiranagar", gstin: "29TUVWX1122Y1Z4",
    fssai: "44556677889900", onboarded: "Sep 2024", status: "suspended", rating: 3.6,
    ordersFulfilled: 4210, skus: 402, salesMonth: 96_800, cancellationRate: 9.4,
    documents: [{ name: "GST certificate", verified: true }, { name: "FSSAI licence", verified: true }, { name: "PAN card", verified: false }, { name: "Bank proof", verified: true }],
  },
  {
    id: "SLR-1005", store: "Farm2Door Organics", owner: "Anita Rao", phone: "+91 99720 30014",
    email: "anita@farm2door.in", city: "Bengaluru", area: "BTM Layout", gstin: "29EFGHI7788J1Z1",
    fssai: "55667788990011", onboarded: "Nov 2025", status: "pending", rating: 4.1,
    ordersFulfilled: 128, skus: 154, salesMonth: 38_400, cancellationRate: 4.6,
    documents: [{ name: "GST certificate", verified: false }, { name: "FSSAI licence", verified: false }, { name: "PAN card", verified: true }, { name: "Bank proof", verified: false }],
  },
];

export const riders: Rider[] = [
  {
    id: "RDR-2001", name: "Imran Sheikh", phone: "+91 98801 23145", email: "imran.s@freshkart.rider",
    zone: "HSR Layout", city: "Bengaluru", vehicle: "Scooter", plate: "KA 05 HJ 4412", licence: "KA0520190004412",
    joined: "Feb 2024", status: "verified", rating: 4.9, trips: 3120, earningsMonth: 38_400, onTimeRate: 97.4,
    documents: [{ name: "Driving licence", verified: true }, { name: "Aadhaar", verified: true }, { name: "Vehicle RC", verified: true }, { name: "Insurance", verified: true }],
  },
  {
    id: "RDR-2002", name: "Kavya Reddy", phone: "+91 90360 88120", email: "kavya.r@freshkart.rider",
    zone: "Koramangala", city: "Bengaluru", vehicle: "EV Scooter", plate: "KA 03 EV 9087", licence: "KA0320200009087",
    joined: "May 2024", status: "verified", rating: 4.8, trips: 2410, earningsMonth: 33_100, onTimeRate: 96.1,
    documents: [{ name: "Driving licence", verified: true }, { name: "Aadhaar", verified: true }, { name: "Vehicle RC", verified: true }, { name: "Insurance", verified: true }],
  },
  {
    id: "RDR-2003", name: "Prakash Murthy", phone: "+91 97310 55408", email: "prakash.m@freshkart.rider",
    zone: "BTM Layout", city: "Bengaluru", vehicle: "Bike", plate: "KA 51 GM 2210", licence: "KA5120180002210",
    joined: "Aug 2023", status: "pending", rating: 4.7, trips: 1880, earningsMonth: 27_600, onTimeRate: 93.8,
    documents: [{ name: "Driving licence", verified: true }, { name: "Aadhaar", verified: true }, { name: "Vehicle RC", verified: false }, { name: "Insurance", verified: false }],
  },
  {
    id: "RDR-2004", name: "Nisha Thomas", phone: "+91 99450 71260", email: "nisha.t@freshkart.rider",
    zone: "Indiranagar", city: "Bengaluru", vehicle: "EV Scooter", plate: "KA 01 EV 3345", licence: "KA0120210003345",
    joined: "Oct 2024", status: "verified", rating: 5.0, trips: 1140, earningsMonth: 24_900, onTimeRate: 98.9,
    documents: [{ name: "Driving licence", verified: true }, { name: "Aadhaar", verified: true }, { name: "Vehicle RC", verified: true }, { name: "Insurance", verified: true }],
  },
  {
    id: "RDR-2005", name: "Deepak Yadav", phone: "+91 96320 40017", email: "deepak.y@freshkart.rider",
    zone: "Jayanagar", city: "Bengaluru", vehicle: "Bike", plate: "KA 41 CD 7781", licence: "KA4120170007781",
    joined: "Jun 2025", status: "suspended", rating: 3.9, trips: 620, earningsMonth: 8_200, onTimeRate: 84.2,
    documents: [{ name: "Driving licence", verified: true }, { name: "Aadhaar", verified: false }, { name: "Vehicle RC", verified: true }, { name: "Insurance", verified: false }],
  },
  {
    id: "RDR-2006", name: "Sana Fatima", phone: "+91 90190 62233", email: "sana.f@freshkart.rider",
    zone: "HSR Layout", city: "Bengaluru", vehicle: "Scooter", plate: "KA 05 JK 1109", licence: "KA0520220001109",
    joined: "Jan 2026", status: "pending", rating: 4.4, trips: 96, earningsMonth: 6_400, onTimeRate: 91.5,
    documents: [{ name: "Driving licence", verified: true }, { name: "Aadhaar", verified: true }, { name: "Vehicle RC", verified: false }, { name: "Insurance", verified: true }],
  },
];

export const statusTone: Record<PartnerStatus, "primary" | "offer" | "discount"> = {
  verified: "primary",
  pending: "offer",
  suspended: "discount",
};

export const statusLabel: Record<PartnerStatus, string> = {
  verified: "Verified",
  pending: "Pending verification",
  suspended: "Discontinued",
};
