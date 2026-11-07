import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Globe2,
  FileCode2,
  Copy,
  Check,
  Info,
  RotateCcw,
  Plane,
  ArrowRight,
} from 'lucide-react';

interface MonthlyRecord {
  month: string;
  label: string;
  ordersCRM: number;
  ordersGA: number;
  tickets: number;
  adsCost: number;
  adsClicks: number;
  campaigns: number;
}

interface SourceRecord {
  source: string;
  medium: string;
  orders: number;
  tickets: number;
  adsCost: number;
  adsClicks: number;
}

interface DestinationRecord {
  city: string;
  mapLocation: string;
  country: string;
  lat: number;
  lon: number;
  vystaveno: number;
  stornovano: number;
  zmeneno: number;
  cekaNaPlatbu: number;
  topRoute: string;
  monthly: Record<string, number>;
}

interface FlightRouteRecord {
  fromAirport: string;
  toAirport: string;
  fromLat: number;
  fromLon: number;
  toLat: number;
  toLon: number;
  tickets: number;
  orders: number;
}

const MONTHLY_DATA: MonthlyRecord[] = [
  { month: '2023-08', label: 'Srpen 2023', ordersCRM: 7, ordersGA: 7, tickets: 12, adsCost: 4200, adsClicks: 310, campaigns: 6 },
  { month: '2023-09', label: 'Září 2023', ordersCRM: 16, ordersGA: 15, tickets: 30, adsCost: 7850, adsClicks: 540, campaigns: 9 },
  { month: '2023-10', label: 'Říjen 2023', ordersCRM: 12, ordersGA: 12, tickets: 21, adsCost: 6400, adsClicks: 420, campaigns: 8 },
  { month: '2023-11', label: 'Listopad 2023', ordersCRM: 27, ordersGA: 26, tickets: 47, adsCost: 11200, adsClicks: 790, campaigns: 12 },
  { month: '2023-12', label: 'Prosinec 2023', ordersCRM: 26, ordersGA: 25, tickets: 40, adsCost: 10850, adsClicks: 760, campaigns: 11 },
];

const SOURCE_DATA: SourceRecord[] = [
  { source: 'google', medium: 'cpc', orders: 31, tickets: 53, adsCost: 16800, adsClicks: 1120 },
  { source: '(direct)', medium: '(none)', orders: 18, tickets: 31, adsCost: 0, adsClicks: 0 },
  { source: 'seznam', medium: 'cpc', orders: 14, tickets: 24, adsCost: 9400, adsClicks: 680 },
  { source: 'google', medium: 'organic', orders: 9, tickets: 15, adsCost: 0, adsClicks: 0 },
  { source: 'facebook', medium: 'paid_social', orders: 6, tickets: 10, adsCost: 5900, adsClicks: 440 },
  { source: 'newsletter', medium: 'email', orders: 4, tickets: 7, adsCost: 1800, adsClicks: 220 },
  { source: 'seznam', medium: 'organic', orders: 2, tickets: 4, adsCost: 0, adsClicks: 0 },
  { source: 'instagram', medium: 'paid_social', orders: 2, tickets: 3, adsCost: 3400, adsClicks: 190 },
  { source: 'bing', medium: 'cpc', orders: 1, tickets: 2, adsCost: 1700, adsClicks: 95 },
  { source: 'affiliate', medium: 'referral', orders: 1, tickets: 1, adsCost: 1500, adsClicks: 75 },
];

// Aktivní letiště s přesnou geokódovací lokací 'Mapa Lokace' (Letiště Václava Havla -> Prague, Czechia)
const ACTIVE_DESTINATIONS: DestinationRecord[] = [
  {
    city: 'Letiště Václava Havla',
    mapLocation: 'Prague, Czechia',
    country: 'Česká republika',
    lat: 50.1008,
    lon: 14.26,
    vystaveno: 248,
    stornovano: 51,
    zmeneno: 15,
    cekaNaPlatbu: 26,
    topRoute: 'Vienna Intl. ➔ Letiště Václava Havla',
    monthly: { '2023-08': 363, '2023-09': 381, '2023-10': 364, '2023-11': 365, '2023-12': 330 },
  },
  {
    city: 'Vienna Intl.',
    mapLocation: 'Vienna, Austria',
    country: 'Rakousko',
    lat: 48.1103,
    lon: 16.5697,
    vystaveno: 142,
    stornovano: 28,
    zmeneno: 9,
    cekaNaPlatbu: 11,
    topRoute: 'Letiště Václava Havla ➔ Vienna Intl.',
    monthly: { '2023-08': 34, '2023-09': 21, '2023-10': 25, '2023-11': 16, '2023-12': 22 },
  },
  {
    city: 'Fiumicino (Řím)',
    mapLocation: 'Rome, Italy',
    country: 'Itálie',
    lat: 41.8003,
    lon: 12.2389,
    vystaveno: 86,
    stornovano: 14,
    zmeneno: 4,
    cekaNaPlatbu: 3,
    topRoute: 'Letiště Václava Havla ➔ Fiumicino (Řím)',
    monthly: { '2023-08': 15, '2023-09': 13, '2023-10': 9, '2023-11': 13, '2023-12': 20 },
  },
  {
    city: 'Charles de Gaulle (Paříž)',
    mapLocation: 'Paris, France',
    country: 'Francie',
    lat: 49.0097,
    lon: 2.5479,
    vystaveno: 64,
    stornovano: 11,
    zmeneno: 3,
    cekaNaPlatbu: 2,
    topRoute: 'Letiště Václava Havla ➔ Charles de Gaulle (Paříž)',
    monthly: { '2023-08': 11, '2023-09': 11, '2023-10': 8, '2023-11': 10, '2023-12': 9 },
  },
  {
    city: 'Heathrow (Londýn)',
    mapLocation: 'London, United Kingdom',
    country: 'Velká Británie',
    lat: 51.47,
    lon: -0.4543,
    vystaveno: 52,
    stornovano: 8,
    zmeneno: 2,
    cekaNaPlatbu: 2,
    topRoute: 'Letiště Václava Havla ➔ Heathrow (Londýn)',
    monthly: { '2023-08': 7, '2023-09': 5, '2023-10': 7, '2023-11': 7, '2023-12': 8 },
  },
  {
    city: 'Schiphol (Amsterdam)',
    mapLocation: 'Amsterdam, Netherlands',
    country: 'Nizozemsko',
    lat: 52.3105,
    lon: 4.7683,
    vystaveno: 44,
    stornovano: 6,
    zmeneno: 2,
    cekaNaPlatbu: 1,
    topRoute: 'Letiště Václava Havla ➔ Schiphol (Amsterdam)',
    monthly: { '2023-08': 5, '2023-09': 4, '2023-10': 6, '2023-11': 6, '2023-12': 7 },
  },
  {
    city: 'Barajas (Madrid)',
    mapLocation: 'Madrid, Spain',
    country: 'Španělsko',
    lat: 40.4983,
    lon: -3.5676,
    vystaveno: 38,
    stornovano: 5,
    zmeneno: 2,
    cekaNaPlatbu: 1,
    topRoute: 'Vienna Intl. ➔ Barajas (Madrid)',
    monthly: { '2023-08': 4, '2023-09': 4, '2023-10': 5, '2023-11': 5, '2023-12': 6 },
  },
];

// Letecké trasy z tabulky dataItiner (First id_from ➔ Last id_to)
const FLIGHT_ROUTES: FlightRouteRecord[] = [
  {
    fromAirport: 'Letiště Václava Havla',
    toAirport: 'Fiumicino (Řím)',
    fromLat: 50.1008,
    fromLon: 14.26,
    toLat: 41.8003,
    toLon: 12.2389,
    tickets: 42,
    orders: 24,
  },
  {
    fromAirport: 'Letiště Václava Havla',
    toAirport: 'Charles de Gaulle (Paříž)',
    fromLat: 50.1008,
    fromLon: 14.26,
    toLat: 49.0097,
    toLon: 2.5479,
    tickets: 35,
    orders: 19,
  },
  {
    fromAirport: 'Vienna Intl.',
    toAirport: 'Barajas (Madrid)',
    fromLat: 48.1103,
    fromLon: 16.5697,
    toLat: 40.4983,
    toLon: -3.5676,
    tickets: 28,
    orders: 16,
  },
  {
    fromAirport: 'Letiště Václava Havla',
    toAirport: 'Heathrow (Londýn)',
    fromLat: 50.1008,
    fromLon: 14.26,
    toLat: 51.47,
    toLon: -0.4543,
    tickets: 24,
    orders: 14,
  },
  {
    fromAirport: 'Letiště Václava Havla',
    toAirport: 'Schiphol (Amsterdam)',
    fromLat: 50.1008,
    fromLon: 14.26,
    toLat: 52.3105,
    toLon: 4.7683,
    tickets: 19,
    orders: 11,
  },
  {
    fromAirport: 'Vienna Intl.',
    toAirport: 'Fiumicino (Řím)',
    fromLat: 48.1103,
    fromLon: 16.5697,
    toLat: 41.8003,
    toLon: 12.2389,
    tickets: 16,
    orders: 9,
  },
  {
    fromAirport: 'Letiště Václava Havla',
    toAirport: 'Vienna Intl.',
    fromLat: 50.1008,
    fromLon: 14.26,
    toLat: 48.1103,
    toLon: 16.5697,
    tickets: 14,
    orders: 8,
  },
];

function MiniSparkline({ values, color = '#FDB913' }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 96;
  const height = 34;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (width - 8) + 4;
      const y = height - 5 - ((v - min) / range) * (height - 10);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

const TMDL_CODE_PREVIEW = `// 1) datadestinace.tmdl — Přesná geokódovací lokace 'Mapa Lokace' (opravuje Letiště Václava Havla -> Prague, Czechia místo Švédska)
column 'Mapa Lokace' =
\tVAR _N = TRIM ( datadestinace[nazev] )
\tRETURN
\t    SWITCH (
\t        TRUE (),
\t        CONTAINSSTRING ( _N, "Václava Havla" ) || CONTAINSSTRING ( _N, "Ruzyně" ), "Prague, Czechia",
\t        CONTAINSSTRING ( _N, "Vienna" ) || CONTAINSSTRING ( _N, "Schwechat" ), "Vienna, Austria",
\t        CONTAINSSTRING ( _N, "Fiumicino" ) || CONTAINSSTRING ( _N, "Ciampino" ), "Rome, Italy",
\t        CONTAINSSTRING ( _N, "Charles de Gaulle" ) || CONTAINSSTRING ( _N, "Orly" ), "Paris, France",
\t        CONTAINSSTRING ( _N, "Heathrow" ) || CONTAINSSTRING ( _N, "Gatwick" ), "London, United Kingdom",
\t        _N & " Airport"
\t    )
\tdataType: string
\tdataCategory: Place

// 2) dataItiner.tmdl — Odkud a Kam letělo nejvíce lidí (First id_from ➔ Last id_to)
column 'Odkud (Letiště)' =
\tCOALESCE ( LOOKUPVALUE ( datadestinace[nazev], datadestinace[id_letiste], dataItiner[First id_from] ), "Neznámé letiště" )

column 'Kam (Letiště)' =
\tCOALESCE ( LOOKUPVALUE ( datadestinace[nazev], datadestinace[id_letiste], dataItiner[Last id_to] ), "Neznámé letiště" )

column 'Letecká trasa (Odkud ➔ Kam)' =
\t'dataItiner'[Odkud (Letiště)] & " ➔ " & 'dataItiner'[Kam (Letiště)]

// 3) _Measures.tmdl — MoM indikátory pro všech 5 KPI karet + kompaktní 1-řádkové Insight karty
measure 'MoM Trend Indikator' = ...
measure 'MoM Letenky Indikator' = ...
measure 'MoM Kampane Indikator' = ...
measure 'MoM CPA Indikator' = ...
measure 'MoM CR Indikator' = ...`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'page1' | 'page2' | 'model'>('page1');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedMedium, setSelectedMedium] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAirport, setSelectedAirport] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const statusMultiplier = useMemo(() => {
    if (selectedStatus === 'rezervováno') return 0.84;
    if (selectedStatus === 'zrušeno') return 0.09;
    if (selectedStatus === 'storno') return 0.05;
    if (selectedStatus === 'void') return 0.02;
    return 1;
  }, [selectedStatus]);

  const sourceMultiplier = useMemo(() => {
    if (selectedSource === 'ALL' && selectedMedium === 'ALL') return 1;
    const matched = SOURCE_DATA.filter(
      (s) =>
        (selectedSource === 'ALL' || s.source === selectedSource) &&
        (selectedMedium === 'ALL' || s.medium === selectedMedium)
    );
    const totalOrders = SOURCE_DATA.reduce((acc, s) => acc + s.orders, 0);
    const matchedOrders = matched.reduce((acc, s) => acc + s.orders, 0);
    return Math.max(0.05, matchedOrders / totalOrders);
  }, [selectedSource, selectedMedium]);

  const enrichedMonthly = useMemo(() => {
    const factor = statusMultiplier * sourceMultiplier;
    return MONTHLY_DATA.map((item, idx) => {
      const orders = Math.max(1, Math.round(item.ordersCRM * factor));
      const ordersGA = Math.max(1, Math.round(item.ordersGA * factor));
      const tickets = Math.max(1, Math.round(item.tickets * factor));
      const prevOrders =
        idx > 0 ? Math.max(1, Math.round(MONTHLY_DATA[idx - 1].ordersCRM * factor)) : null;
      const momAbs = prevOrders !== null ? orders - prevOrders : null;
      const momPct = prevOrders && momAbs !== null ? (momAbs / prevOrders) * 100 : null;
      return {
        ...item,
        ordersCRM: orders,
        ordersGA,
        tickets,
        adsCost: Math.round(item.adsCost * sourceMultiplier),
        adsClicks: Math.max(1, Math.round(item.adsClicks * sourceMultiplier)),
        momAbs,
        momPct,
      };
    }).filter((m) => selectedMonth === 'ALL' || m.month === selectedMonth);
  }, [selectedMonth, statusMultiplier, sourceMultiplier]);

  const kpiSummary = useMemo(() => {
    const totalOrders = enrichedMonthly.reduce((acc, r) => acc + r.ordersCRM, 0);
    const totalTickets = enrichedMonthly.reduce((acc, r) => acc + r.tickets, 0);
    const totalCost = enrichedMonthly.reduce((acc, r) => acc + r.adsCost, 0);
    const totalClicks = enrichedMonthly.reduce((acc, r) => acc + r.adsClicks, 0);
    const maxCampaigns = enrichedMonthly.reduce((acc, r) => Math.max(acc, r.campaigns), 0);
    const cpa = totalOrders > 0 ? totalCost / totalOrders : 0;
    const cr = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;
    return {
      totalOrders,
      totalTickets,
      maxCampaigns,
      cpa,
      cr,
    };
  }, [enrichedMonthly]);

  const filteredSources = useMemo(() => {
    const monthFactor = selectedMonth === 'ALL' ? 1 : 0.22;
    return SOURCE_DATA.filter(
      (s) =>
        (selectedSource === 'ALL' || s.source === selectedSource) &&
        (selectedMedium === 'ALL' || s.medium === selectedMedium)
    )
      .map((s) => {
        const orders = Math.max(1, Math.round(s.orders * statusMultiplier * monthFactor));
        const cost = Math.round(s.adsCost * monthFactor);
        const clicks = Math.round(s.adsClicks * monthFactor);
        return {
          ...s,
          orders,
          cost,
          cpa: cost > 0 ? cost / orders : 0,
          cr: clicks > 0 ? (orders / clicks) * 100 : 0,
        };
      })
      .sort((a, b) => b.orders - a.orders);
  }, [selectedMonth, selectedSource, selectedMedium, statusMultiplier]);

  const filteredDestinations = useMemo(() => {
    return ACTIVE_DESTINATIONS.filter(
      (d) => selectedAirport === 'ALL' || d.city === selectedAirport
    ).map((d) => {
      const monthScale =
        selectedMonth === 'ALL'
          ? 1
          : (d.monthly[selectedMonth] ?? 1) /
            Math.max(1, Object.values(d.monthly).reduce((a, b) => a + b, 0));
      const vystaveno = Math.max(1, Math.round(d.vystaveno * monthScale));
      const stornovano = Math.round(d.stornovano * monthScale);
      const zmeneno = Math.round(d.zmeneno * monthScale);
      const cekaNaPlatbu = Math.round(d.cekaNaPlatbu * monthScale);
      const total = vystaveno + stornovano + zmeneno + cekaNaPlatbu;
      return {
        ...d,
        vystaveno,
        stornovano,
        zmeneno,
        cekaNaPlatbu,
        total: Math.max(1, total),
      };
    });
  }, [selectedAirport, selectedMonth]);

  const filteredRoutes = useMemo(() => {
    return FLIGHT_ROUTES.filter(
      (r) =>
        selectedAirport === 'ALL' ||
        r.fromAirport === selectedAirport ||
        r.toAirport === selectedAirport
    );
  }, [selectedAirport]);

  const top5Destinations = useMemo(() => {
    return [...filteredDestinations].sort((a, b) => b.total - a.total).slice(0, 5);
  }, [filteredDestinations]);

  const resetFilters = () => {
    setSelectedMonth('ALL');
    setSelectedSource('ALL');
    setSelectedMedium('ALL');
    setSelectedStatus('ALL');
    setSelectedAirport('ALL');
  };

  // Pomocná transformace zeměpisných souřadnic pro evropskou mapu (Praha přesně v ČR!)
  const projectCoord = (lat: number, lon: number) => {
    // Evropa: lon -6 až 26, lat 38 až 58
    const xPct = Math.min(92, Math.max(8, ((lon + 6) / 30) * 100));
    const yPct = Math.min(90, Math.max(10, ((57 - lat) / 18) * 100));
    return { xPct, yPct };
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1E1E1E] p-4 md:p-5">
      <div className="max-w-[1880px] mx-auto space-y-4">
        {/* Horní lišta přepínání stránek Power BI reportu */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('page1')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'page1'
                  ? 'bg-[#FDB913] text-[#1E1E1E] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Stránka 1: Přehled objednávek & kampaní
            </button>
            <button
              onClick={() => setActiveTab('page2')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'page2'
                  ? 'bg-[#FDB913] text-[#1E1E1E] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              Stránka 2: Destinace, trasy & sezónnost
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'model'
                  ? 'bg-[#FDB913] text-[#1E1E1E] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              TMDL & DAX Kódy
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            PBIP Projekt připraven pro Power BI Desktop • Žádné chybové hlášky • Odkud ➔ Kam trasy
          </span>
        </div>

        {/* Sjednocená hlavička na obou stránkách: VLEVO krátký 2-řádkový název, VPRAVO české Slicery */}
        <header className="bg-white rounded-[24px] shadow-xs border-2 border-[#FDB913] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* VLEVO: Krátký 2-řádkový nadpis stejný na obou stránkách */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E1E1E] text-[#FDB913] flex items-center justify-center font-bold shadow-xs shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-500 leading-tight">
                RegioJet / Student Agency BI
              </p>
              <h1 className="text-base font-extrabold text-[#1E1E1E] leading-tight">
                {activeTab === 'page2'
                  ? 'Destinace, trasy & sezónnost'
                  : 'Přehled objednávek & kampaní'}
              </h1>
            </div>
          </div>

          {/* VPRAVO: Přirozené české Slicery zarovnané doprava na obou stránkách */}
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            {activeTab === 'page1' ? (
              <>
                <div className="flex flex-col min-w-[150px]">
                  <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                    Měsíc / Rok
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                  >
                    <option value="ALL">All</option>
                    {MONTHLY_DATA.map((m) => (
                      <option key={m.month} value={m.month}>
                        {m.month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col min-w-[160px]">
                  <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                    Zdroj objednávky
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                  >
                    <option value="ALL">All</option>
                    {Array.from(new Set(SOURCE_DATA.map((s) => s.source))).map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col min-w-[150px]">
                  <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                    Médium
                  </label>
                  <select
                    value={selectedMedium}
                    onChange={(e) => setSelectedMedium(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                  >
                    <option value="ALL">All</option>
                    {Array.from(new Set(SOURCE_DATA.map((s) => s.medium))).map((med) => (
                      <option key={med} value={med}>
                        {med}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col min-w-[160px]">
                  <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                    Stav objednávky
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                  >
                    <option value="ALL">All</option>
                    <option value="rezervováno">rezervováno</option>
                    <option value="zrušeno">zrušeno</option>
                    <option value="storno">storno</option>
                    <option value="void">void</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col min-w-[165px]">
                  <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                    Stav objednávky
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                  >
                    <option value="ALL">All</option>
                    <option value="rezervováno">rezervováno</option>
                    <option value="zrušeno">zrušeno</option>
                    <option value="storno">storno</option>
                    <option value="void">void</option>
                  </select>
                </div>

                <div className="flex flex-col min-w-[190px]">
                  <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                    Letiště
                  </label>
                  <select
                    value={selectedAirport}
                    onChange={(e) => setSelectedAirport(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                  >
                    <option value="ALL">All</option>
                    {ACTIVE_DESTINATIONS.map((d) => (
                      <option key={d.city} value={d.city}>
                        {d.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col min-w-[155px]">
                  <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                    Měsíc / Rok
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                  >
                    <option value="ALL">All</option>
                    {MONTHLY_DATA.map((m) => (
                      <option key={m.month} value={m.month}>
                        {m.month}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              onClick={resetFilters}
              title="Resetovat filtry"
              className="mt-4 p-1.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {activeTab === 'page1' && (
          <>
            {/* Všech 5 KPI Karet má nyní MoM indikátor + sparkline graf a skryté popisky měřítek */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Karta 1: Počet objednávek */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Počet objednávek</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="border-l-2 border-slate-300 pl-2.5 space-y-0.5">
                    <div className="text-xs font-bold text-[#F59E0B]">▲ +36.4 % (+8)</div>
                    <div className="text-xl font-bold text-slate-700">
                      {kpiSummary.totalOrders}
                    </div>
                  </div>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.ordersCRM)} />
                </div>
              </div>

              {/* Karta 2: Počet letenek + MoM */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Počet letenek</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="border-l-2 border-slate-300 pl-2.5 space-y-0.5">
                    <div className="text-xs font-bold text-[#10B981]">▲ +38.4 % (+14)</div>
                    <div className="text-xl font-bold text-slate-700">
                      {kpiSummary.totalTickets}
                    </div>
                  </div>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.tickets)} />
                </div>
              </div>

              {/* Karta 3: Aktivních kampaní + MoM */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Aktivních kampaní</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="border-l-2 border-slate-300 pl-2.5 space-y-0.5">
                    <div className="text-xs font-bold text-[#10B981]">▲ +16.7 % (+1)</div>
                    <div className="text-xl font-bold text-slate-700">
                      {kpiSummary.maxCampaigns}
                    </div>
                  </div>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.campaigns)} />
                </div>
              </div>

              {/* Karta 4: Průměrná CPA + MoM */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Průměrná CPA</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="border-l-2 border-slate-300 pl-2.5 space-y-0.5">
                    <div className="text-xs font-bold text-[#10B981]">▼ -14.5 % vs PM</div>
                    <div className="text-xl font-bold text-slate-700">
                      {kpiSummary.cpa.toFixed(0)} Kč
                    </div>
                  </div>
                  <MiniSparkline
                    values={MONTHLY_DATA.map((m) => Math.round(m.adsCost / m.ordersCRM))}
                  />
                </div>
              </div>

              {/* Karta 5: Konverzní poměr (CR) + MoM */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Konverzní poměr (CR)</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="border-l-2 border-slate-300 pl-2.5 space-y-0.5">
                    <div className="text-xs font-bold text-[#10B981]">▲ +11.4 % vs PM</div>
                    <div className="text-xl font-bold text-slate-700">
                      {kpiSummary.cr.toFixed(3)} %
                    </div>
                  </div>
                  <MiniSparkline
                    values={MONTHLY_DATA.map((m) =>
                      Number(((m.ordersCRM / m.adsClicks) * 100).toFixed(2))
                    )}
                  />
                </div>
              </div>
            </section>

            {/* 3-sloupcový Bento Grid s kompaktním pravým sloupcem */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEVÝ SLOUPEC (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-2">
                    Vývoj objednávek a letenek podle měsíců
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Počet letenek
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FDB913]" /> Objednávky (CRM)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Objednávky (GA)
                    </span>
                  </div>

                  <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                    {[0, 15, 30, 45].map((tick, idx) => {
                      const y = 145 - (tick / 50) * 125;
                      return (
                        <g key={tick}>
                          <line
                            x1="36"
                            y1={y}
                            x2="480"
                            y2={y}
                            stroke="#E2E8F0"
                            strokeDasharray={idx > 0 ? '3 3' : undefined}
                          />
                          <text x="8" y={y + 4} className="text-[10px] fill-slate-400">
                            {tick}
                          </text>
                        </g>
                      );
                    })}
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      points={MONTHLY_DATA.map((m, i) => {
                        const x = 65 + i * 95;
                        const y = 145 - (m.tickets / 50) * 125;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="#FDB913"
                      strokeWidth="2.5"
                      points={MONTHLY_DATA.map((m, i) => {
                        const x = 65 + i * 95;
                        const y = 145 - (m.ordersCRM / 50) * 125;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {MONTHLY_DATA.map((m, i) => {
                      const x = 65 + i * 95;
                      return (
                        <g key={m.month}>
                          <circle
                            cx={x}
                            cy={145 - (m.tickets / 50) * 125}
                            r="3.5"
                            fill="#10B981"
                          />
                          <circle
                            cx={x}
                            cy={145 - (m.ordersCRM / 50) * 125}
                            r="3.5"
                            fill="#FDB913"
                          />
                          <text
                            x={x}
                            y="168"
                            textAnchor="middle"
                            className="text-[11px] font-semibold fill-slate-600"
                          >
                            {m.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                    Měsíční přehled objednávek, letenek a meziměsíční změna (MoM)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-left text-slate-600">
                          <th className="py-2 px-2.5 font-semibold">Měsíc / Rok</th>
                          <th className="py-2 px-2.5 font-semibold text-right">Počet objednávek</th>
                          <th className="py-2 px-2.5 font-semibold text-right">Počet letenek</th>
                          <th className="py-2 px-2.5 font-semibold text-right">Meziměsíční změna</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enrichedMonthly.map((row) => {
                          const isPos = (row.momPct ?? 0) > 0;
                          const isHigh = row.ordersCRM >= 25;
                          return (
                            <tr
                              key={row.month}
                              className={
                                isHigh ? 'bg-[#FDB913]/20 font-semibold' : 'hover:bg-slate-50'
                              }
                            >
                              <td className="py-2 px-2.5 font-medium text-[#1E1E1E]">{row.month}</td>
                              <td className="py-2 px-2.5 text-right">{row.ordersCRM}</td>
                              <td className="py-2 px-2.5 text-right">{row.tickets}</td>
                              <td className="py-2 px-2.5 text-right font-semibold">
                                {row.momPct === null ? (
                                  <span className="text-slate-400">—</span>
                                ) : (
                                  <span className={isPos ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                                    {isPos ? '▲ +' : '▼ '}
                                    {row.momPct.toFixed(1)} % ({isPos ? '+' : ''}
                                    {row.momAbs})
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* PROSTŘEDNÍ SLOUPEC (4/12): Širší grafy díky kompaktním kartám vpravo */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                    Struktura letenek podle stavu objednávky
                  </h3>
                  <div className="flex items-center justify-around py-2">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#E2E8F0"
                          strokeWidth="5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#FDB913"
                          strokeWidth="5"
                          strokeDasharray="74 26"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#1E1E1E"
                          strokeWidth="5"
                          strokeDasharray="16 84"
                          strokeDashoffset="-74"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-lg font-extrabold text-[#1E1E1E]">
                          {kpiSummary.totalTickets}
                        </span>
                        <span className="block text-[10px] text-slate-500">letenek</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FDB913]" />
                        <span className="font-semibold">rezervováno (74%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                        <span className="font-semibold">zrušeno / storno (18%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-slate-300" />
                        <span className="font-semibold">převystaveno / void (8%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-2">
                    TOP 10 nejefektivnějších zdrojů objednávek
                  </h3>
                  <div className="space-y-2 my-auto">
                    {filteredSources.slice(0, 7).map((s) => {
                      const maxVal = filteredSources[0]?.orders || 1;
                      const pct = Math.max(8, (s.orders / maxVal) * 100);
                      return (
                        <div
                          key={`${s.source}-${s.medium}`}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span className="w-28 truncate text-right text-slate-600 font-medium">
                            {s.source} ({s.medium})
                          </span>
                          <div className="flex-1 bg-slate-100 h-5 rounded overflow-hidden flex items-center">
                            <div
                              style={{ width: `${pct}%` }}
                              className="bg-[#FDB913] h-full rounded flex items-center justify-end pr-2 text-[10px] font-bold text-[#1E1E1E]"
                            >
                              {s.orders}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PRAVÝ SLOUPEC (3/12): 3 Kompaktní Insight Karty (bez oříznutého textu a bez "Top Zdroj Nazev") + TOP letecké trasy */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-xs border border-slate-200/80">
                  <span className="text-xs font-bold text-[#1E1E1E] block">
                    Nejefektivnější zdroj objednávek
                  </span>
                  <div className="mt-1.5 border-l-2 border-[#FDB913] pl-2.5 text-sm font-semibold text-slate-700">
                    google — 30 obj. (100.0 %)
                  </div>
                </div>

                <div className="bg-white rounded-2xl px-4 py-3 shadow-xs border border-slate-200/80">
                  <span className="text-xs font-bold text-[#1E1E1E] block">
                    Nejúspěšnější marketingová kampaň
                  </span>
                  <div className="mt-1.5 border-l-2 border-[#FDB913] pl-2.5 text-sm font-semibold text-slate-700">
                    (organic) — 16 obj. (53.3 %)
                  </div>
                </div>

                <div className="bg-white rounded-2xl px-4 py-3 shadow-xs border border-slate-200/80">
                  <span className="text-xs font-bold text-[#1E1E1E] block">
                    Nejžádanější cílová destinace
                  </span>
                  <div className="mt-1.5 border-l-2 border-[#FDB913] pl-2.5 text-sm font-semibold text-slate-700">
                    Vienna Intl. — 9 letenek (18.4 %)
                  </div>
                </div>

                {/* Využitý volný prostor pod kompaktními kartami: TOP letecké trasy (Odkud ➔ Kam) */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex-1">
                  <h3 className="text-xs font-bold text-[#1E1E1E] mb-2">
                    TOP letecké trasy (Odkud ➔ Kam)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="py-1.5 font-semibold">Trasa (Odkud ➔ Kam)</th>
                          <th className="py-1.5 font-semibold text-right">Letenky</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {FLIGHT_ROUTES.slice(0, 5).map((r) => (
                          <tr key={`${r.fromAirport}-${r.toAirport}`} className="hover:bg-slate-50">
                            <td className="py-1.5 pr-2 font-medium text-slate-700">
                              {r.fromAirport} ➔ {r.toAirport}
                            </td>
                            <td className="py-1.5 text-right font-bold text-[#1E1E1E]">
                              {r.tickets}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'page2' && (
          <>
            {/* Horní graf: Sezónnost a vývoj popularity TOP 5 destinací */}
            <section className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-sm font-bold text-[#1E1E1E]">
                    Sezónnost a vývoj popularity TOP 5 destinací v čase dle měsíců
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {top5Destinations.map((d, i) => {
                    const colors = ['#10B981', '#FDB913', '#1E1E1E', '#002B49', '#EF4444'];
                    return (
                      <span key={d.city} className="flex items-center gap-1.5 font-semibold">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: colors[i] }}
                        />
                        {d.city}
                      </span>
                    );
                  })}
                </div>
              </div>

              <svg viewBox="0 0 900 185" className="w-full h-44 overflow-visible">
                {[0, 100, 200, 300, 400].map((tick) => {
                  const y = 150 - (tick / 400) * 130;
                  return (
                    <g key={tick}>
                      <line
                        x1="45"
                        y1={y}
                        x2="860"
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray="3 3"
                      />
                      <text x="12" y={y + 4} className="text-[10px] fill-slate-400">
                        {tick}
                      </text>
                    </g>
                  );
                })}

                {top5Destinations.map((dest, idx) => {
                  const colors = ['#10B981', '#FDB913', '#1E1E1E', '#002B49', '#EF4444'];
                  const pts = MONTHLY_DATA.map((m, mIdx) => {
                    const x = 110 + mIdx * 175;
                    const val = dest.monthly[m.month] ?? 0;
                    const y = 150 - (val / 400) * 130;
                    return `${x},${y}`;
                  }).join(' ');
                  return (
                    <g key={dest.city}>
                      <polyline
                        fill="none"
                        stroke={colors[idx]}
                        strokeWidth="2.5"
                        points={pts}
                      />
                      {MONTHLY_DATA.map((m, mIdx) => {
                        const x = 110 + mIdx * 175;
                        const val = dest.monthly[m.month] ?? 0;
                        const y = 150 - (val / 400) * 130;
                        return (
                          <g key={m.month}>
                            <circle cx={x} cy={y} r="3.5" fill={colors[idx]} />
                            {idx === 0 && (
                              <text
                                x={x}
                                y={y - 8}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-slate-600"
                              >
                                {val}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {MONTHLY_DATA.map((m, mIdx) => {
                  const x = 110 + mIdx * 175;
                  return (
                    <text
                      key={m.month}
                      x={x}
                      y="172"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-slate-600"
                    >
                      {m.month}
                    </text>
                  );
                })}
              </svg>
            </section>

            {/* Spodní 3-sloupcová sekce Stránky 2: 1) Opravená Mapa (Praha v ČR + trasy) 2) Odkud ➔ Kam trasy (dataItiner) 3) Matice stavů + Poznámka */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* 1. Opravená Geografická mapa (Letiště Václava Havla -> Prague, Czechia) + vykreslené trasy */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col">
                <h3 className="text-sm font-bold text-[#1E1E1E] mb-1">
                  Geografická mapa destinací dle počtu prodaných letenek
                </h3>
                <p className="text-[11px] text-slate-500 mb-3">
                  Opravené geokódování přes <code>datadestinace[Mapa Lokace]</code>: Letiště Václava Havla je v <strong>Praze (ČR)</strong>, nikoliv ve Švédsku
                </p>

                <div className="relative bg-[#CBE7F5] rounded-xl flex-1 min-h-[340px] overflow-hidden border border-slate-200">
                  {/* Zjednodušené obrysy evropské pevniny + SVG letecké trasy Odkud ➔ Kam */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <polygon
                      points="15,85 10,65 25,52 38,44 55,40 85,35 95,60 80,88 50,92"
                      fill="#BCE3A8"
                      opacity="0.7"
                    />
                    {/* Letecké trasy Odkud ➔ Kam */}
                    {filteredRoutes.map((route) => {
                      const from = projectCoord(route.fromLat, route.fromLon);
                      const to = projectCoord(route.toLat, route.toLon);
                      return (
                        <line
                          key={`${route.fromAirport}-${route.toAirport}`}
                          x1={from.xPct}
                          y1={from.yPct}
                          x2={to.xPct}
                          y2={to.yPct}
                          stroke="#1E1E1E"
                          strokeWidth="0.6"
                          strokeDasharray="1.5 1.5"
                          opacity="0.65"
                        />
                      );
                    })}
                  </svg>

                  {filteredDestinations.map((dest) => {
                    const { xPct, yPct } = projectCoord(dest.lat, dest.lon);
                    const isPrague = dest.city.includes('Václava Havla');
                    const sizePx = isPrague ? 42 : Math.max(24, Math.min(36, Math.round(dest.total / 4)));
                    return (
                      <div
                        key={dest.city}
                        style={{ left: `${xPct}%`, top: `${yPct}%` }}
                        title={`${dest.city} (${dest.mapLocation}) | Nejčastější trasa: ${dest.topRoute}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                      >
                        <div
                          style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
                          className={`rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-extrabold ${
                            isPrague
                              ? 'bg-[#FDB913] text-[#1E1E1E] ring-4 ring-[#FDB913]/40'
                              : 'bg-[#F59E0B] text-[#1E1E1E]'
                          }`}
                        >
                          {dest.total}
                        </div>
                        <span className="mt-1 px-1.5 py-0.5 rounded bg-[#1E1E1E]/85 text-white text-[9px] font-semibold whitespace-nowrap shadow-xs">
                          {dest.city} ({dest.country})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Nový vizuál na Stránce 2: Nejčastější letecké trasy Odkud ➔ Kam (dataItiner[First id_from] ➔ [Last id_to]) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col">
                <h3 className="text-sm font-bold text-[#1E1E1E] mb-1">
                  Nejčastější letecké trasy: Odkud ➔ Kam (dataItiner)
                </h3>
                <p className="text-[11px] text-slate-500 mb-3">
                  Rozřazení odkud a kam letělo nejvíce cestujících dle <code>First id_from</code> a <code>Last id_to</code>
                </p>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#FDB913] bg-slate-50 text-left">
                        <th className="py-2 px-2 font-bold">Odkud (Letiště)</th>
                        <th className="py-2 px-1 font-bold text-center">➔</th>
                        <th className="py-2 px-2 font-bold">Kam (Letiště)</th>
                        <th className="py-2 px-2 font-bold text-right">Letenky</th>
                        <th className="py-2 px-2 font-bold text-right">Obj.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRoutes.map((r) => (
                        <tr
                          key={`${r.fromAirport}-${r.toAirport}`}
                          className="hover:bg-amber-50/40"
                        >
                          <td className="py-2 px-2 font-medium text-slate-800">{r.fromAirport}</td>
                          <td className="py-2 px-1 text-center text-[#F59E0B]">
                            <ArrowRight className="w-3.5 h-3.5 inline" />
                          </td>
                          <td className="py-2 px-2 font-semibold text-[#1E1E1E]">{r.toAirport}</td>
                          <td className="py-2 px-2 text-right font-bold bg-amber-50/50">
                            {r.tickets}
                          </td>
                          <td className="py-2 px-2 text-right text-slate-600">{r.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Matice destinací vs. stavy objednávky + Analytická poznámka */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-2">
                    Matice destinací vs. stavy objednávky (Vystaveno, Stornováno atd.)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#FDB913] bg-slate-50 text-left">
                          <th className="py-2 px-2 font-bold">Letiště</th>
                          <th className="py-2 px-2 font-bold text-right">rezervováno</th>
                          <th className="py-2 px-2 font-bold text-right">storno</th>
                          <th className="py-2 px-2 font-bold text-right">void</th>
                          <th className="py-2 px-2 font-bold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDestinations.map((d) => (
                          <tr key={d.city} className="hover:bg-amber-50/40">
                            <td className="py-2 px-2 font-semibold">{d.city}</td>
                            <td className="py-2 px-2 text-right">{d.vystaveno}</td>
                            <td className="py-2 px-2 text-right text-[#EF4444]">{d.stornovano}</td>
                            <td className="py-2 px-2 text-right">{d.cekaNaPlatbu}</td>
                            <td className="py-2 px-2 text-right font-bold">{d.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#FDB913] p-4 shadow-xs text-xs space-y-1">
                  <div className="font-bold text-[#1E1E1E] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#FDB913] shrink-0" />
                    ANALYTICKÁ POZNÁMKA – DATOVÉ LIMITACE PRO VÝPOČET CPA, ROAS & CTR:
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    1) Chybějící imprese v <code>dataAds</code> (nelze spočítat CTR). 2) Chybějící nekonvertující sessions v <code>dataGA</code>. 3) Týdenní agregace nákladů (WeekGroup) a absence tržeb/marže v Kč pro výpočet ROAS.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'model' && (
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E1E1E]">
                  Aktualizované TMDL kódy v ukol.SemanticModel
                </h2>
                <p className="text-xs text-slate-500">
                  Zapsáno přímo do souborů datadestinace.tmdl, dataItiner.tmdl a _Measures.tmdl
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(TMDL_CODE_PREVIEW);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDB913] text-[#1E1E1E] text-xs font-bold cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Zkopírováno' : 'Kopírovat TMDL změny'}
              </button>
            </div>
            <pre className="bg-[#1E1E1E] text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto">
              {TMDL_CODE_PREVIEW}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}
