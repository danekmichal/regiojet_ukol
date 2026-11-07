import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Globe2,
  FileCode2,
  BookOpen,
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
  continent: string;
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

// Přesná čísla z reálného modelu v Power BI Desktop (viz screenshoty)
const MONTHLY_DATA: MonthlyRecord[] = [
  { month: '2023-08', label: 'Srpen 2023', ordersCRM: 765, ordersGA: 7, tickets: 1247, adsCost: 1120000, adsClicks: 235000, campaigns: 263 },
  { month: '2023-09', label: 'Září 2023', ordersCRM: 830, ordersGA: 16, tickets: 1373, adsCost: 1185000, adsClicks: 248000, campaigns: 278 },
  { month: '2023-10', label: 'Říjen 2023', ordersCRM: 757, ordersGA: 12, tickets: 1284, adsCost: 1150000, adsClicks: 231000, campaigns: 285 },
  { month: '2023-11', label: 'Listopad 2023', ordersCRM: 839, ordersGA: 27, tickets: 1322, adsCost: 1140000, adsClicks: 246000, campaigns: 304 },
  { month: '2023-12', label: 'Prosinec 2023', ordersCRM: 762, ordersGA: 26, tickets: 1265, adsCost: 1095000, adsClicks: 238000, campaigns: 304 },
];

const SOURCE_DATA: SourceRecord[] = [
  { source: '(Blank)', medium: '(none)', orders: 3865, tickets: 6332, adsCost: 0, adsClicks: 0 },
  { source: '(direct)', medium: '(none)', orders: 38, tickets: 64, adsCost: 0, adsClicks: 0 },
  { source: 'google (cpc)', medium: 'cpc', orders: 19, tickets: 31, adsCost: 2132500, adsClicks: 620000 },
  { source: 'google (organic)', medium: 'organic', orders: 11, tickets: 18, adsCost: 0, adsClicks: 0 },
  { source: 'seznam (cpc)', medium: 'cpc', orders: 5, tickets: 9, adsCost: 940000, adsClicks: 280000 },
  { source: 'studentagency.eu (referral)', medium: 'referral', orders: 4, tickets: 7, adsCost: 0, adsClicks: 0 },
  { source: 'seznam (organic)', medium: 'organic', orders: 3, tickets: 5, adsCost: 0, adsClicks: 0 },
  { source: '(not set)', medium: '(not set)', orders: 2, tickets: 4, adsCost: 0, adsClicks: 0 },
  { source: 'bing (cpc)', medium: 'cpc', orders: 2, tickets: 4, adsCost: 310000, adsClicks: 95000 },
  { source: 'dovolena.cz (referral)', medium: 'referral', orders: 2, tickets: 4, adsCost: 0, adsClicks: 0 },
];

// Aktivní letiště s geokódováním přímo na čistý název města (dataCategory: City, bez čárky a státu) + Kontinent destinace
const ACTIVE_DESTINATIONS: DestinationRecord[] = [
  {
    city: 'Letiště Václava Havla',
    mapLocation: 'Praha',
    continent: 'Evropa',
    country: 'Praha, ČR',
    lat: 50.0755,
    lon: 14.4378,
    vystaveno: 248,
    stornovano: 1257,
    zmeneno: 221,
    cekaNaPlatbu: 77,
    topRoute: 'Istanbul Airport ➔ Letiště Václava Havla',
    monthly: { '2023-08': 363, '2023-09': 381, '2023-10': 364, '2023-11': 365, '2023-12': 330 },
  },
  {
    city: 'Brno Tuřany',
    mapLocation: 'Brno',
    continent: 'Evropa',
    country: 'Brno, ČR',
    lat: 49.1513,
    lon: 16.6944,
    vystaveno: 34,
    stornovano: 14,
    zmeneno: 4,
    cekaNaPlatbu: 2,
    topRoute: 'Stansted ➔ Brno Tuřany',
    monthly: { '2023-08': 12, '2023-09': 14, '2023-10': 10, '2023-11': 9, '2023-12': 9 },
  },
  {
    city: 'Vienna Intl.',
    mapLocation: 'Vienna',
    continent: 'Evropa',
    country: 'Vídeň, Rakousko',
    lat: 48.2082,
    lon: 16.3738,
    vystaveno: 142,
    stornovano: 68,
    zmeneno: 19,
    cekaNaPlatbu: 11,
    topRoute: 'Suvarnabhumi ➔ Vienna Intl.',
    monthly: { '2023-08': 48, '2023-09': 52, '2023-10': 49, '2023-11': 46, '2023-12': 45 },
  },
  {
    city: 'Istanbul Airport',
    mapLocation: 'Istanbul',
    continent: 'Evropa',
    country: 'Istanbul, Turecko',
    lat: 41.0082,
    lon: 28.9784,
    vystaveno: 96,
    stornovano: 44,
    zmeneno: 12,
    cekaNaPlatbu: 8,
    topRoute: 'Istanbul Airport ➔ Letiště Václava Havla',
    monthly: { '2023-08': 32, '2023-09': 36, '2023-10': 31, '2023-11': 33, '2023-12': 28 },
  },
  {
    city: 'Schiphol',
    mapLocation: 'Amsterdam',
    continent: 'Evropa',
    country: 'Amsterdam, Nizozemsko',
    lat: 52.3676,
    lon: 4.9041,
    vystaveno: 84,
    stornovano: 38,
    zmeneno: 10,
    cekaNaPlatbu: 6,
    topRoute: 'Schiphol ➔ Letiště Václava Havla',
    monthly: { '2023-08': 28, '2023-09': 31, '2023-10': 27, '2023-11': 26, '2023-12': 26 },
  },
  {
    city: 'Charles De Gaulle',
    mapLocation: 'Paris',
    continent: 'Evropa',
    country: 'Paříž, Francie',
    lat: 48.8566,
    lon: 2.3522,
    vystaveno: 76,
    stornovano: 32,
    zmeneno: 9,
    cekaNaPlatbu: 5,
    topRoute: 'Charles De Gaulle ➔ Letiště Václava Havla',
    monthly: { '2023-08': 25, '2023-09': 27, '2023-10': 24, '2023-11': 24, '2023-12': 22 },
  },
  {
    city: 'Frankfurt Airport',
    mapLocation: 'Frankfurt',
    continent: 'Evropa',
    country: 'Frankfurt, Německo',
    lat: 50.1109,
    lon: 8.6821,
    vystaveno: 64,
    stornovano: 28,
    zmeneno: 7,
    cekaNaPlatbu: 4,
    topRoute: 'Frankfurt Airport ➔ Letiště Václava Havla',
    monthly: { '2023-08': 21, '2023-09': 23, '2023-10': 20, '2023-11': 20, '2023-12': 19 },
  },
  {
    city: 'Pablo Ruiz Picasso',
    mapLocation: 'Malaga',
    continent: 'Evropa',
    country: 'Málaga, Španělsko',
    lat: 36.7213,
    lon: -4.4214,
    vystaveno: 58,
    stornovano: 22,
    zmeneno: 6,
    cekaNaPlatbu: 4,
    topRoute: 'Pablo Ruiz Picasso ➔ Letiště Václava Havla',
    monthly: { '2023-08': 18, '2023-09': 20, '2023-10': 18, '2023-11': 17, '2023-12': 17 },
  },
];

// Reálné letecké trasy z dataItiner (podle screenshotu z Power BI Desktop)
const FLIGHT_ROUTES: FlightRouteRecord[] = [
  {
    fromAirport: 'Istanbul Airport',
    toAirport: 'Letiště Václava Havla',
    fromLat: 41.0082,
    fromLon: 28.9784,
    toLat: 50.0755,
    toLon: 14.4378,
    tickets: 148,
    orders: 89,
  },
  {
    fromAirport: 'Schiphol',
    toAirport: 'Letiště Václava Havla',
    fromLat: 52.3676,
    fromLon: 4.9041,
    toLat: 50.0755,
    toLon: 14.4378,
    tickets: 132,
    orders: 78,
  },
  {
    fromAirport: 'Suvarnabhumi',
    toAirport: 'Letiště Václava Havla',
    fromLat: 13.7563,
    fromLon: 100.5018,
    toLat: 50.0755,
    toLon: 14.4378,
    tickets: 118,
    orders: 68,
  },
  {
    fromAirport: 'Charles De Gaulle',
    toAirport: 'Letiště Václava Havla',
    fromLat: 48.8566,
    fromLon: 2.3522,
    toLat: 50.0755,
    toLon: 14.4378,
    tickets: 104,
    orders: 62,
  },
  {
    fromAirport: 'Letiště Václava Havla',
    toAirport: 'Dubai International',
    fromLat: 50.0755,
    fromLon: 14.4378,
    toLat: 25.2048,
    toLon: 55.2708,
    tickets: 96,
    orders: 55,
  },
  {
    fromAirport: 'Doha',
    toAirport: 'Letiště Václava Havla',
    fromLat: 25.2854,
    fromLon: 51.531,
    toLat: 50.0755,
    toLon: 14.4378,
    tickets: 88,
    orders: 51,
  },
  {
    fromAirport: 'Suvarnabhumi',
    toAirport: 'Vienna Intl.',
    fromLat: 13.7563,
    fromLon: 100.5018,
    toLat: 48.2082,
    toLon: 16.3738,
    tickets: 82,
    orders: 47,
  },
  {
    fromAirport: 'Abu Dhabi Intl',
    toAirport: 'Vienna Intl.',
    fromLat: 24.4539,
    fromLon: 54.3773,
    toLat: 48.2082,
    toLon: 16.3738,
    tickets: 76,
    orders: 44,
  },
  {
    fromAirport: 'Frankfurt Airport',
    toAirport: 'Letiště Václava Havla',
    fromLat: 50.1109,
    fromLon: 8.6821,
    toLat: 50.0755,
    toLon: 14.4378,
    tickets: 71,
    orders: 42,
  },
  {
    fromAirport: 'Pablo Ruiz Picasso',
    toAirport: 'Letiště Václava Havla',
    fromLat: 36.7213,
    fromLon: -4.4214,
    toLat: 50.0755,
    toLon: 14.4378,
    tickets: 64,
    orders: 38,
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

const TMDL_CODE_PREVIEW = `// 1) datadestinace.tmdl — Geokódování přímo na město (dataCategory: City) bez falešných shod ("stanice" != "Nice")
column 'Mapa Lokace' =
\tVAR _Raw = TRIM ( datadestinace[nazev] )
\tVAR _Clean = TRIM ( SUBSTITUTE ( SUBSTITUTE ( _Raw, " International Airport", "" ), " Airport", "" ) )
\tRETURN
\t    SWITCH (
\t        TRUE (),
\t        ISBLANK ( _Raw ) || _Raw = "0" || CONTAINSSTRING ( _Raw, "stanice" ), BLANK (),
\t        CONTAINSSTRING ( _Raw, "Václava Havla" ) || CONTAINSSTRING ( _Raw, "Ruzyně" ), "Prague, Czechia",
\t        CONTAINSSTRING ( _Raw, "Pablo Ruiz Picasso" ) || CONTAINSSTRING ( _Raw, "Málaga" ), "Malaga, Spain",
\t        CONTAINSSTRING ( _Raw, "Vienna" ) || CONTAINSSTRING ( _Raw, "Schwechat" ), "Vienna, Austria",
\t        CONTAINSSTRING ( _Raw, "Schiphol" ), "Amsterdam, Netherlands",
\t        CONTAINSSTRING ( _Raw, "Charles de Gaulle" ) || CONTAINSSTRING ( _Raw, "Orly" ), "Paris, France",
\t        _Clean
\t    )
\tdataType: string
\tdataCategory: City

// 2) _Measures.tmdl — Odfiltrování (Blank) v TOP 10 zdrojích + MoM v procentních bodech (p.b.) pro CR %
measure 'Pocet Objednavek Zdroje (Top 10)' =
\tVAR _CurrSource = SELECTEDVALUE(dataGA[sessionSource])
\tVAR _Top10Sources =
\t    TOPN(10, FILTER(ALLSELECTED(dataGA[sessionSource]), NOT ISBLANK(dataGA[sessionSource]) && dataGA[sessionSource] <> "(not set)"), [Pocet Objednavek (CRM)], DESC)
\tRETURN
\t    IF(ISBLANK(_CurrSource) || _CurrSource = "(not set)", BLANK(), CALCULATE([Pocet Objednavek (CRM)], KEEPFILTERS(_Top10Sources)))`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'page1' | 'page2' | 'readme' | 'model'>('page1');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedMedium, setSelectedMedium] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');
  const [selectedAirport, setSelectedAirport] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const statusMultiplier = useMemo(() => {
    if (selectedStatus === 'rezervováno') return 0.75;
    if (selectedStatus === 'zrušeno') return 0.14;
    if (selectedStatus === 'storno') return 0.08;
    if (selectedStatus === 'void') return 0.03;
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

  // Výpočet KPI hodnot + skutečného MoM (poslední vybraný měsíc vs. předchozí měsíc, bez zkreslení 5 vs. 4 měsíce)
  const kpiSummary = useMemo(() => {
    const totalOrders = enrichedMonthly.reduce((acc, r) => acc + r.ordersCRM, 0);
    const totalTickets = enrichedMonthly.reduce((acc, r) => acc + r.tickets, 0);
    const totalCost = enrichedMonthly.reduce((acc, r) => acc + r.adsCost, 0);
    const totalClicks = enrichedMonthly.reduce((acc, r) => acc + r.adsClicks, 0);
    const maxCampaigns = enrichedMonthly.reduce((acc, r) => Math.max(acc, r.campaigns), 0);
    const cpa = totalOrders > 0 ? totalCost / totalOrders : 0;
    const cr = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;

    // Pro MoM porovnáme vybraný měsíc (nebo poslední měsíc 2023-12) s předchozím měsícem
    const targetMonthCode =
      selectedMonth === 'ALL' ? MONTHLY_DATA[MONTHLY_DATA.length - 1].month : selectedMonth;
    const targetIdx = MONTHLY_DATA.findIndex((m) => m.month === targetMonthCode);
    const currM = MONTHLY_DATA[targetIdx] || MONTHLY_DATA[MONTHLY_DATA.length - 1];
    const prevM = targetIdx > 0 ? MONTHLY_DATA[targetIdx - 1] : null;

    const ordersDiff = prevM ? currM.ordersCRM - prevM.ordersCRM : 0;
    const ordersPct = prevM ? (ordersDiff / prevM.ordersCRM) * 100 : 0;

    const ticketsDiff = prevM ? currM.tickets - prevM.tickets : 0;
    const ticketsPct = prevM ? (ticketsDiff / prevM.tickets) * 100 : 0;

    const campDiff = prevM ? currM.campaigns - prevM.campaigns : 0;
    const campPct = prevM ? (campDiff / prevM.campaigns) * 100 : 0;

    const currCpa = currM.adsCost / currM.ordersCRM;
    const prevCpa = prevM ? prevM.adsCost / prevM.ordersCRM : currCpa;
    const cpaDiff = currCpa - prevCpa;
    const cpaPct = prevCpa > 0 ? (cpaDiff / prevCpa) * 100 : 0;

    const currCr = (currM.ordersCRM / currM.adsClicks) * 100;
    const prevCr = prevM ? (prevM.ordersCRM / prevM.adsClicks) * 100 : currCr;
    const crDiffPP = currCr - prevCr;
    const crPct = prevCr > 0 ? (crDiffPP / prevCr) * 100 : 0;

    return {
      totalOrders,
      totalTickets,
      maxCampaigns,
      cpa,
      cr,
      ordersDiff,
      ordersPct,
      ticketsDiff,
      ticketsPct,
      campDiff,
      campPct,
      cpaDiff,
      cpaPct,
      crDiffPP,
      crPct,
    };
  }, [enrichedMonthly, selectedMonth]);

  const filteredSources = useMemo(() => {
    const monthFactor = selectedMonth === 'ALL' ? 1 : 0.22;
    return SOURCE_DATA.filter(
      (s) =>
        (selectedSource === 'ALL' || s.source === selectedSource || s.source.startsWith(selectedSource + ' ')) &&
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
      (d) =>
        (selectedAirport === 'ALL' || d.city === selectedAirport) &&
        (selectedContinent === 'ALL' || d.continent === selectedContinent)
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
  }, [selectedAirport, selectedContinent, selectedMonth]);

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
    setSelectedContinent('ALL');
    setSelectedAirport('ALL');
  };

  const projectCoord = (lat: number, lon: number) => {
    const xPct = Math.min(92, Math.max(8, ((lon + 8) / 40) * 100));
    const yPct = Math.min(90, Math.max(10, ((56 - lat) / 21) * 100));
    return { xPct, yPct };
  };

  // Pomocná funkce pro barvu MoM: Zelená (dobrý), Červená (špatný), Oranžová (0)
  const getMoMColor = (val: number, invertForCost = false) => {
    if (Math.abs(val) < 0.001) return 'text-[#F59E0B]';
    const isGood = invertForCost ? val < 0 : val > 0;
    return isGood ? 'text-[#10B981]' : 'text-[#EF4444]';
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1E1E1E] p-4 md:p-5">
      <div className="max-w-[1880px] mx-auto space-y-4">
        {/* Horní přepínání stránek a dokumentace */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex flex-wrap items-center gap-2">
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
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'readme'
                  ? 'bg-[#FDB913] text-[#1E1E1E] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              README.md (Metodika & Odpovědi na úkol)
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
            Opraveno schéma visual.json • Prohozená hodnota & barevné MoM • Města na mapě • README.md
          </span>
        </div>

        {/* Sjednocená hlavička na obou stránkách: VLEVO krátký 2-řádkový název, VPRAVO české Slicery */}
        {(activeTab === 'page1' || activeTab === 'page2') && (
          <header className="bg-white rounded-[24px] shadow-xs border-2 border-[#FDB913] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
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

                  <div className="flex flex-col min-w-[145px]">
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

                  <div className="flex flex-col min-w-[155px]">
                    <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                      Kontinent destinací
                    </label>
                    <select
                      value={selectedContinent}
                      onChange={(e) => setSelectedContinent(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                    >
                      <option value="ALL">All</option>
                      <option value="Evropa">Evropa</option>
                      <option value="Asie & Blízký východ">Asie & Blízký východ</option>
                      <option value="Severní & Střední Amerika">Severní & Střední Amerika</option>
                      <option value="Jižní Amerika">Jižní Amerika</option>
                      <option value="Afrika">Afrika</option>
                      <option value="Austrálie & Oceánie">Austrálie & Oceánie</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col min-w-[150px]">
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

                  <div className="flex flex-col min-w-[160px]">
                    <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                      Kontinent destinací
                    </label>
                    <select
                      value={selectedContinent}
                      onChange={(e) => setSelectedContinent(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                    >
                      <option value="ALL">All</option>
                      <option value="Evropa">Evropa</option>
                      <option value="Asie & Blízký východ">Asie & Blízký východ</option>
                      <option value="Severní & Střední Amerika">Severní & Střední Amerika</option>
                      <option value="Jižní Amerika">Jižní Amerika</option>
                      <option value="Afrika">Afrika</option>
                      <option value="Austrálie & Oceánie">Austrálie & Oceánie</option>
                    </select>
                  </div>

                  <div className="flex flex-col min-w-[175px]">
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

                  <div className="flex flex-col min-w-[140px]">
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
        )}

        {activeTab === 'page1' && (
          <>
            {/* 5 KPI Karet: Nahoře výrazná hlavní hodnota (#1E1E1E), dole barevné MoM (zelená/červená/oranžová) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Karta 1: Počet objednávek */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Počet objednávek</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="border-l-2 border-slate-300 pl-2.5 text-2xl font-extrabold text-[#1E1E1E]">
                      {kpiSummary.totalOrders.toLocaleString('cs-CZ')}
                    </div>
                    <div
                      className={`border-l-2 border-slate-300 pl-2.5 text-xs font-bold ${getMoMColor(
                        kpiSummary.ordersPct
                      )}`}
                    >
                      {kpiSummary.ordersPct > 0
                        ? `▲ +${kpiSummary.ordersPct.toFixed(1)} % (+${kpiSummary.ordersDiff})`
                        : kpiSummary.ordersPct < 0
                        ? `▼ ${kpiSummary.ordersPct.toFixed(1)} % (${kpiSummary.ordersDiff})`
                        : '▬ 0.0 % (0)'}
                    </div>
                  </div>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.ordersCRM)} />
                </div>
              </div>

              {/* Karta 2: Počet letenek */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Počet letenek</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="border-l-2 border-slate-300 pl-2.5 text-2xl font-extrabold text-[#1E1E1E]">
                      {kpiSummary.totalTickets.toLocaleString('cs-CZ')}
                    </div>
                    <div
                      className={`border-l-2 border-slate-300 pl-2.5 text-xs font-bold ${getMoMColor(
                        kpiSummary.ticketsPct
                      )}`}
                    >
                      {kpiSummary.ticketsPct > 0
                        ? `▲ +${kpiSummary.ticketsPct.toFixed(1)} % (+${kpiSummary.ticketsDiff})`
                        : kpiSummary.ticketsPct < 0
                        ? `▼ ${kpiSummary.ticketsPct.toFixed(1)} % (${kpiSummary.ticketsDiff})`
                        : '▬ 0.0 % (0)'}
                    </div>
                  </div>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.tickets)} />
                </div>
              </div>

              {/* Karta 3: Aktivních kampaní */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Aktivních kampaní</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="border-l-2 border-slate-300 pl-2.5 text-2xl font-extrabold text-[#1E1E1E]">
                      {kpiSummary.maxCampaigns}
                    </div>
                    <div
                      className={`border-l-2 border-slate-300 pl-2.5 text-xs font-bold ${getMoMColor(
                        kpiSummary.campPct
                      )}`}
                    >
                      {kpiSummary.campPct > 0
                        ? `▲ +${kpiSummary.campPct.toFixed(1)} % (+${kpiSummary.campDiff})`
                        : kpiSummary.campPct < 0
                        ? `▼ ${kpiSummary.campPct.toFixed(1)} % (${kpiSummary.campDiff})`
                        : '▬ 0.0 % (0)'}
                    </div>
                  </div>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.campaigns)} />
                </div>
              </div>

              {/* Karta 4: Průměrná CPA (pokles CPA = zelená) */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Průměrná CPA</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="border-l-2 border-slate-300 pl-2.5 text-2xl font-extrabold text-[#1E1E1E]">
                      {kpiSummary.cpa.toLocaleString('cs-CZ', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Kč
                    </div>
                    <div
                      className={`border-l-2 border-slate-300 pl-2.5 text-xs font-bold ${getMoMColor(
                        kpiSummary.cpaPct,
                        true
                      )}`}
                    >
                      {kpiSummary.cpaPct > 0
                        ? `▲ +${kpiSummary.cpaPct.toFixed(1)} % (+${Math.round(kpiSummary.cpaDiff)} Kč)`
                        : kpiSummary.cpaPct < 0
                        ? `▼ ${kpiSummary.cpaPct.toFixed(1)} % (${Math.round(kpiSummary.cpaDiff)} Kč)`
                        : '▬ 0.0 % (0 Kč)'}
                    </div>
                  </div>
                  <MiniSparkline
                    values={MONTHLY_DATA.map((m) => Math.round(m.adsCost / m.ordersCRM))}
                  />
                </div>
              </div>

              {/* Karta 5: Konverzní poměr (CR) — změna v procentních bodech (p.b.) + % */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-[#1E1E1E]">Konverzní poměr (CR)</span>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="border-l-2 border-slate-300 pl-2.5 text-2xl font-extrabold text-[#1E1E1E]">
                      {kpiSummary.cr.toFixed(2)} %
                    </div>
                    <div
                      className={`border-l-2 border-slate-300 pl-2.5 text-[11px] font-bold ${getMoMColor(
                        kpiSummary.crDiffPP
                      )}`}
                    >
                      {kpiSummary.crDiffPP > 0.001
                        ? `▲ +${kpiSummary.crDiffPP.toFixed(2)} p.b. (+${kpiSummary.crPct.toFixed(1)} %)`
                        : kpiSummary.crDiffPP < -0.001
                        ? `▼ ${kpiSummary.crDiffPP.toFixed(2)} p.b. (${kpiSummary.crPct.toFixed(1)} %)`
                        : '▬ 0.00 p.b. (0.0 %)'}
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

            {/* 3-sloupcový Bento Grid (všechny grafy pouze s Title, bez Subtitle) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEVÝ SLOUPEC (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                    Vývoj objednávek a letenek podle měsíců
                  </h3>

                  <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                    {[0, 500, 1000, 1500].map((tick, idx) => {
                      const y = 145 - (tick / 1500) * 125;
                      return (
                        <g key={tick}>
                          <line
                            x1="40"
                            y1={y}
                            x2="480"
                            y2={y}
                            stroke="#E2E8F0"
                            strokeDasharray={idx > 0 ? '3 3' : undefined}
                          />
                          <text x="4" y={y + 4} className="text-[10px] fill-slate-400">
                            {tick}
                          </text>
                        </g>
                      );
                    })}
                    <polyline
                      fill="none"
                      stroke="#1E1E1E"
                      strokeWidth="2.5"
                      points={MONTHLY_DATA.map((m, i) => {
                        const x = 68 + i * 95;
                        const y = 145 - (m.tickets / 1500) * 125;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="#FDB913"
                      strokeWidth="2.5"
                      points={MONTHLY_DATA.map((m, i) => {
                        const x = 68 + i * 95;
                        const y = 145 - (m.ordersCRM / 1500) * 125;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    {MONTHLY_DATA.map((m, i) => {
                      const x = 68 + i * 95;
                      return (
                        <g key={m.month}>
                          <circle
                            cx={x}
                            cy={145 - (m.tickets / 1500) * 125}
                            r="3.5"
                            fill="#1E1E1E"
                          />
                          <circle
                            cx={x}
                            cy={145 - (m.ordersCRM / 1500) * 125}
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
                    Měsíční přehled objednávek, letenek a meziměsíční změny (MoM)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 text-left text-slate-600">
                          <th className="py-2 px-2.5 font-semibold">RokMesicText</th>
                          <th className="py-2 px-2.5 font-semibold text-right">
                            Pocet Objednavek (CRM)
                          </th>
                          <th className="py-2 px-2.5 font-semibold text-right">Pocet Letenek</th>
                          <th className="py-2 px-2.5 font-semibold text-right">
                            MoM Trend Indikator
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enrichedMonthly.map((row) => {
                          const isPos = (row.momPct ?? 0) > 0;
                          return (
                            <tr key={row.month} className="hover:bg-slate-50">
                              <td className="py-2.5 px-2.5 font-medium text-[#1E1E1E]">
                                {row.month}
                              </td>
                              <td className="py-2.5 px-2.5 text-right">{row.ordersCRM}</td>
                              <td className="py-2.5 px-2.5 text-right">
                                {row.tickets.toLocaleString('cs-CZ')}
                              </td>
                              <td className="py-2.5 px-2.5 text-right font-semibold">
                                {row.momPct === null ? (
                                  <span className="text-slate-400" />
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

              {/* PROSTŘEDNÍ SLOUPEC (4/12): Bez Subtitle a bez (Blank) sloupce u TOP 10 zdrojů */}
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
                          strokeDasharray="75 25"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#EF4444"
                          strokeWidth="5"
                          strokeDasharray="11 89"
                          strokeDashoffset="-75"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#1E1E1E"
                          strokeWidth="5"
                          strokeDasharray="14 86"
                          strokeDashoffset="-86"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-lg font-extrabold text-[#1E1E1E]">
                          {kpiSummary.totalTickets.toLocaleString('cs-CZ')}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FDB913]" />
                        <span className="font-semibold">zrušeno (74,75 %)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                        <span className="font-semibold">zrušena z důvodu převys... (11,03 %)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                        <span className="font-semibold">rezervováno / storno (14,22 %)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                    TOP 10 nejefektivnějších zdrojů objednávek
                  </h3>
                  <div className="space-y-2 my-auto">
                    {filteredSources.map((s) => {
                      const maxLog = Math.log10((filteredSources[0]?.orders || 1) + 1);
                      const pct = Math.max(14, (Math.log10(s.orders + 1) / maxLog) * 100);
                      return (
                        <div
                          key={`${s.source}-${s.medium}`}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span className="w-36 truncate text-right text-slate-600 font-medium">
                            {s.source}
                          </span>
                          <div className="flex-1 bg-slate-100 h-5 rounded overflow-hidden flex items-center">
                            <div
                              style={{ width: `${pct}%` }}
                              className="bg-[#FDB913] h-full rounded flex items-center justify-end pr-2 text-[10px] font-bold text-[#1E1E1E]"
                            >
                              {s.orders.toLocaleString('cs-CZ')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* PRAVÝ SLOUPEC (3/12): 3 Kompaktní Insight Karty s tmavě šedým textem (#334155) a českým vysvětlením podílu v tooltipu */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <div
                  title="Nejefektivnější zdroj (v závorce je podíl na celku): (direct) — 38 obj. (43,2 %)"
                  className="bg-white rounded-2xl px-4 py-3 shadow-xs border border-slate-200/80 group relative cursor-help"
                >
                  <span className="text-xs font-bold text-[#1E1E1E] block">
                    Nejefektivnější zdroj objednávek
                  </span>
                  <div className="mt-1.5 border-l-2 border-slate-300 pl-2.5 text-sm font-semibold text-[#334155]">
                    (direct) — 38 obj. (43,2 %)
                  </div>
                  <div className="hidden group-hover:block absolute left-3 right-3 -bottom-9 z-30 bg-[#1E1E1E] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg">
                    Nejefektivnější zdroj (v závorce je podíl na celku): 43,2 % ze sledovaných GA objednávek
                  </div>
                </div>

                <div
                  title="Nejúspěšnější kampaň (v závorce je podíl na celku): (direct) — 38 obj. (43,2 %)"
                  className="bg-white rounded-2xl px-4 py-3 shadow-xs border border-slate-200/80 group relative cursor-help"
                >
                  <span className="text-xs font-bold text-[#1E1E1E] block">
                    Nejúspěšnější marketingová kampaň
                  </span>
                  <div className="mt-1.5 border-l-2 border-slate-300 pl-2.5 text-sm font-semibold text-[#334155]">
                    (direct) — 38 obj. (43,2 %)
                  </div>
                  <div className="hidden group-hover:block absolute left-3 right-3 -bottom-9 z-30 bg-[#1E1E1E] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg">
                    Nejúspěšnější kampaň (v závorce je podíl na celku): 43,2 % ze sledovaných GA objednávek
                  </div>
                </div>

                <div
                  title="Nejžádanější destinace (v závorce je podíl na celku): Letiště Václava Havla — 1 803 (27,8 %)"
                  className="bg-white rounded-2xl px-4 py-3 shadow-xs border border-slate-200/80 group relative cursor-help"
                >
                  <span className="text-xs font-bold text-[#1E1E1E] block">
                    Nejžádanější cílová destinace
                  </span>
                  <div className="mt-1.5 border-l-2 border-slate-300 pl-2.5 text-xs font-semibold text-[#334155]">
                    Letiště Václava Havla — 1 803 (27,8 %)
                  </div>
                  <div className="hidden group-hover:block absolute left-3 right-3 -bottom-9 z-30 bg-[#1E1E1E] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg">
                    Nejžádanější destinace (v závorce je podíl na celku): 27,8 % ze všech prodaných letenek
                  </div>
                </div>

                {/* Spodní pravá karta: TOP letecké trasy (Odkud ➔ Kam) */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex-1">
                  <h3 className="text-xs font-bold text-[#1E1E1E] mb-2">
                    TOP letecké trasy (Odkud ➔ Kam)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="py-1.5 font-semibold">Letecká trasa (Odkud ➔ Kam)</th>
                          <th className="py-1.5 font-semibold text-right">Letenky</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {FLIGHT_ROUTES.slice(0, 7).map((r) => (
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
            {/* Horní graf bez Subtitle */}
            <section className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <h2 className="text-sm font-bold text-[#1E1E1E]">
                  Závislost popularity TOP 5 destinací (měst) podle měsíců
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {top5Destinations.map((d, i) => {
                    const colors = ['#10B981', '#FDB913', '#1E1E1E', '#002B49', '#EF4444'];
                    return (
                      <span key={d.city} className="flex items-center gap-1.5 font-semibold">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: colors[i] }}
                        />
                        {d.mapLocation} ({d.city})
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
                      <polyline fill="none" stroke={colors[idx]} strokeWidth="2.5" points={pts} />
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

            {/* Spodní 3-sloupcová sekce Stránky 2 (bez podtitulků) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* 1. Geografická mapa (lokace převedeny přímo na města, dataCategory: City) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col">
                <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                  Geografická mapa destinací dle počtu prodaných letenek
                </h3>

                <div className="relative bg-[#CBE7F5] rounded-xl flex-1 min-h-[340px] overflow-hidden border border-slate-200">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full"
                  >
                    <polygon
                      points="10,88 8,62 24,48 40,42 60,38 88,36 95,62 82,90 48,92"
                      fill="#BCE3A8"
                      opacity="0.7"
                    />
                  </svg>

                  {filteredDestinations.map((dest) => {
                    const { xPct, yPct } = projectCoord(dest.lat, dest.lon);
                    const isPrague = dest.city.includes('Václava Havla');
                    const sizePx = isPrague ? 42 : 28;
                    return (
                      <div
                        key={dest.city}
                        style={{ left: `${xPct}%`, top: `${yPct}%` }}
                        title={`Město: ${dest.mapLocation} | Kontinent: ${dest.continent} | Letiště: ${dest.city} | Nejčastější trasa: ${dest.topRoute}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
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
                          {dest.mapLocation}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Nejčastější letecké trasy: Odkud ➔ Kam (dataItiner) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col">
                <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                  Nejčastější letecké trasy: Odkud ➔ Kam (dataItiner)
                </h3>

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

              {/* 3. Závislost popularity destinací (měst) podle měsíců + Analytická poznámka */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                    Závislost popularity destinací (měst) podle měsíců
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#FDB913] bg-slate-50 text-left">
                          <th className="py-2 px-1.5 font-bold">Město destinace</th>
                          <th className="py-2 px-1.5 font-bold text-right">2023-08</th>
                          <th className="py-2 px-1.5 font-bold text-right">2023-09</th>
                          <th className="py-2 px-1.5 font-bold text-right">2023-10</th>
                          <th className="py-2 px-1.5 font-bold text-right">2023-11</th>
                          <th className="py-2 px-1.5 font-bold text-right">2023-12</th>
                          <th className="py-2 px-1.5 font-bold text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDestinations.map((d) => (
                          <tr key={d.city} className="hover:bg-amber-50/40">
                            <td className="py-2 px-1.5 font-semibold">{d.mapLocation}</td>
                            <td className="py-2 px-1.5 text-right">{d.monthly['2023-08']}</td>
                            <td className="py-2 px-1.5 text-right">{d.monthly['2023-09']}</td>
                            <td className="py-2 px-1.5 text-right">{d.monthly['2023-10']}</td>
                            <td className="py-2 px-1.5 text-right">{d.monthly['2023-11']}</td>
                            <td className="py-2 px-1.5 text-right">{d.monthly['2023-12']}</td>
                            <td className="py-2 px-1.5 text-right font-bold">{d.total}</td>
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
                    1) Chybějící imprese v <code>dataAds</code> (nelze spočítat CTR ani CPM). 2) Chybějící nekonvertující sessions v <code>dataGA</code> (obsahuje jen 88 spárovaných konverzí). 3) Týdenní agregace nákladů (WeekGroup) a absence tržeb/marže v Kč pro výpočet ROAS / PNO.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'readme' && (
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-6 max-w-5xl mx-auto">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                Dokumentace projektu (uloženo v /README.md)
              </span>
              <h2 className="text-xl font-extrabold text-[#1E1E1E] mt-1">
                Architektura datového modelu, logika DAX výpočtů a odpovědi na otázky z ukol.odt
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-bold text-[#1E1E1E]">
                1. Proč je datový model navržen tímto způsobem (Reasoning)
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Samostatné tabulky <code>dataCRM</code> a <code>dataGA</code> (relace 1:1 přes rezervační kód):</strong>{' '}
                  Tabulka <code>dataCRM</code> obsahuje <strong>3 953 objednávek</strong> (a 6 491 letenek v <code>dataLet</code>), zatímco <code>dataGA</code> obsahuje pouze <strong>88 spárovaných konverzí</strong>. Sloučením přes Inner Join by zmizelo 97,8 % reálných obchodních dat. Zachováním obou tabulek s relací 1:1 (Cross-filter: Both) můžeme sledovat jak celkový obchodní objem (CRM), tak výkon atribuovaných marketingových kanálů (GA).
                </li>
                <li>
                  <strong>Přemosťovací tabulka <code>Dim_Campaign</code> (Bridge Table):</strong>{' '}
                  Zabraňuje vzniku nejednoznačné vazby <em>Many-to-Many (M:N)</em> mezi <code>dataAds[sessionCampaignName]</code> a <code>dataGA[sessionCampaignName]</code>.
                </li>
                <li>
                  <strong>Geokódování letišť přímo na město (<code>datadestinace[Mapa Lokace]</code>, kategorie <code>City</code>):</strong>{' '}
                  Názvy letišť v databázi obsahují jména osobností (např. <em>Letiště Václava Havla</em>, <em>Pablo Ruiz Picasso</em>, <em>Charles De Gaulle</em>) i vlaková nádraží (<em>Železniční stanice</em>). Azure Maps bez kontextu města zaměňoval <em>Havla</em> za švédské <em>Hävla</em> a v DAXu necitlivá funkce <code>CONTAINSSTRING("žel. stanice", "Nice")</code> vyhodnocovala koncovku slova <em>sta-nice</em> jako francouzské město <em>Nice</em>. Sloupec <code>Mapa Lokace</code> nyní převádí letiště přímo na město a stát (<code>Prague, Czechia</code>, <code>Malaga, Spain</code>, <code>Vienna, Austria</code>, <code>Amsterdam, Netherlands</code>) s kategorií <code>City</code>.
                </li>
                <li>
                  <strong>Vysvětlení MoM u Konverzního poměru (<code>CR %</code>) a při výběru všech měsíců (<code>All</code>):</strong>{' '}
                  Konverzní poměr <code>CR %</code> je sám v procentech (<code>0,33 %</code>). Když se změní z <code>0,318 %</code> na <code>0,330 %</code>, jde o změnu o <strong>+0,01 procentního bodu (p.b.)</strong>, což relativně představuje <code>+3,9 %</code>. Aby hodnota <code>+3,9 %</code> pod číslem <code>0,33 %</code> nepůsobila matoucím dojmem, zobrazuje <code>MoM CR Indikator</code> změnu v procentních bodech i v procentech: <code>▼ -0,01 p.b. (-3,2 %)</code>. Současně při nevybraném měsíci (<code>All</code>) porovnává MoM poslední aktivní měsíc (<code>2023-12</code>) s předchozím měsícem (<code>2023-11</code>), místo porovnávání součtu 5 měsíců se 4 měsíci.
                </li>
              </ul>

              <h3 className="text-base font-bold text-[#1E1E1E] pt-2">
                2. Odpověď na otázku ze zadání: Jaká data chybí pro výpočet většiny marketingových KPI?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-[#1E1E1E]">1. Chybějící tržby (Revenue) a marže v Kč</div>
                  <p className="text-xs text-slate-600 mt-1">
                    V <code>dataCRM</code> ani <code>dataLet</code> není cena objednávky/letenky. Nelze proto spočítat <strong>ROAS</strong> (Return on Ad Spend), <strong>PNO</strong> (Podíl nákladů na obratu), <strong>ROI</strong> ani průměrnou hodnotu objednávky (<strong>AOV</strong>).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-[#1E1E1E]">2. Chybějící imprese (Impressions) v dataAds</div>
                  <p className="text-xs text-slate-600 mt-1">
                    Tabulka <code>dataAds</code> obsahuje pouze <code>AdsCost</code> a <code>AdsClicks</code>. Bez počtu zobrazení reklam nelze spočítat <strong>CTR</strong> (Click-Through Rate) ani <strong>CPM</strong> (Cost Per Mille).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-[#1E1E1E]">3. Chybějící nekonvertující návštěvy v dataGA</div>
                  <p className="text-xs text-slate-600 mt-1">
                    Tabulka <code>dataGA</code> obsahuje pouze 88 zkonvertovaných relací s rezervačním kódem, nikoliv celkovou návštěvnost webu (Sessions / Users). Nelze proto spočítat reálný <strong>CR %</strong> pro organické a přímé zdroje.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-[#1E1E1E]">4. Týdenní agregace nákladů (WeekGroup)</div>
                  <p className="text-xs text-slate-600 mt-1">
                    Náklady v <code>dataAds</code> jsou agregované na týdny (<code>WeekGroup</code>) bez přesného data (<code>Date</code>) a bez přímého propojení na <code>id_rezervace</code> v CRM.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'model' && (
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1E1E1E]">
                  Aktualizované TMDL kódy v ukol.SemanticModel
                </h2>
                <p className="text-xs text-slate-500">
                  Zapsáno přímo do souborů datadestinace.tmdl, _Measures.tmdl a visual.json
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
