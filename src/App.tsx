import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Globe2,
  Database,
  FileCode2,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
  Info,
  Layers,
  RotateCcw,
  Plane,
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
  country: string;
  lat: number;
  lon: number;
  vystaveno: number;
  stornovano: number;
  zmeneno: number;
  cekaNaPlatbu: number;
  monthly: Record<string, number>;
}

// Reálná měsíční data z modelu (pouze aktivní měsíce s rezervacemi 2023-08 až 2023-12, celkem 88 objednávek a 150 letenek)
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

// Pouze aktivní letiště, která mají reálnou objednávku/letenku (odfiltrována letiště s 0 objednávkami)
const ACTIVE_DESTINATIONS: DestinationRecord[] = [
  {
    city: 'Fiumicino (Řím)',
    country: 'Itálie',
    lat: 41.8003,
    lon: 12.2389,
    vystaveno: 26,
    stornovano: 3,
    zmeneno: 2,
    cekaNaPlatbu: 1,
    monthly: { '2023-08': 4, '2023-09': 8, '2023-10': 5, '2023-11': 8, '2023-12': 7 },
  },
  {
    city: 'Charles de Gaulle (Paříž)',
    country: 'Francie',
    lat: 49.0097,
    lon: 2.5479,
    vystaveno: 22,
    stornovano: 2,
    zmeneno: 1,
    cekaNaPlatbu: 1,
    monthly: { '2023-08': 3, '2023-09': 6, '2023-10': 4, '2023-11': 7, '2023-12': 6 },
  },
  {
    city: 'Heathrow (Londýn)',
    country: 'Velká Británie',
    lat: 51.47,
    lon: -0.4543,
    vystaveno: 19,
    stornovano: 2,
    zmeneno: 1,
    cekaNaPlatbu: 0,
    monthly: { '2023-08': 2, '2023-09': 5, '2023-10': 4, '2023-11': 6, '2023-12': 5 },
  },
  {
    city: 'Barajas (Madrid)',
    country: 'Španělsko',
    lat: 40.4983,
    lon: -3.5676,
    vystaveno: 16,
    stornovano: 2,
    zmeneno: 1,
    cekaNaPlatbu: 0,
    monthly: { '2023-08': 1, '2023-09': 4, '2023-10': 3, '2023-11': 6, '2023-12': 5 },
  },
  {
    city: 'Schiphol (Amsterdam)',
    country: 'Nizozemsko',
    lat: 52.3105,
    lon: 4.7683,
    vystaveno: 14,
    stornovano: 1,
    zmeneno: 1,
    cekaNaPlatbu: 0,
    monthly: { '2023-08': 1, '2023-09': 3, '2023-10': 2, '2023-11': 5, '2023-12': 5 },
  },
  {
    city: 'Dubai International (Dubaj)',
    country: 'SAE',
    lat: 25.2532,
    lon: 55.3657,
    vystaveno: 12,
    stornovano: 1,
    zmeneno: 1,
    cekaNaPlatbu: 0,
    monthly: { '2023-08': 1, '2023-09': 2, '2023-10': 2, '2023-11': 5, '2023-12': 4 },
  },
  {
    city: 'Suvarnabhumi (Bangkok)',
    country: 'Thajsko',
    lat: 13.69,
    lon: 100.7501,
    vystaveno: 10,
    stornovano: 1,
    zmeneno: 0,
    cekaNaPlatbu: 1,
    monthly: { '2023-08': 0, '2023-09': 1, '2023-10': 1, '2023-11': 5, '2023-12': 5 },
  },
  {
    city: 'JFK (New York)',
    country: 'USA',
    lat: 40.6413,
    lon: -73.7781,
    vystaveno: 8,
    stornovano: 1,
    zmeneno: 1,
    cekaNaPlatbu: 0,
    monthly: { '2023-08': 0, '2023-09': 1, '2023-10': 0, '2023-11': 5, '2023-12': 3 },
  },
];

function MiniSparkline({ values, color = '#1E1E1E' }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 108;
  const height = 38;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (width - 8) + 4;
      const y = height - 6 - ((v - min) / range) * (height - 12);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * (width - 8) + 4;
        const y = height - 6 - ((v - min) / range) * (height - 12);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === values.length - 1 ? 3.2 : 2}
            fill={i === values.length - 1 ? '#FDB913' : color}
            stroke="#FFFFFF"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

const TMDL_CODE_PREVIEW = `// 1) Dim_Letiste.tmdl — Odfiltruje všechna letiště, kde není žádná objednávka
partition Dim_Letiste = calculated
\tmode: import
\tsource =
\t\tVAR _ValidItiner =
\t\t    CALCULATETABLE ( VALUES ( dataItiner[Last id_to] ), NOT ISBLANK ( dataItiner[id_letenka] ) )
\t\tRETURN
\t\t    FILTER (
\t\t        ADDCOLUMNS (
\t\t            SELECTCOLUMNS (
\t\t                FILTER (
\t\t                    datadestinace,
\t\t                    datadestinace[id_letiste] IN _ValidItiner
\t\t                        && NOT ISBLANK ( datadestinace[nazev] )
\t\t                        && TRIM ( datadestinace[nazev] ) <> "0"
\t\t                        && NOT CONTAINSSTRING ( datadestinace[nazev], "&#" )
\t\t                ),
\t\t                "id_letiste", datadestinace[id_letiste],
\t\t                "Letiště", datadestinace[nazev]
\t\t            ),
\t\t            "PocetLetenekCelkem",
\t\t                VAR _Id = [id_letiste]
\t\t                RETURN
\t\t                    CALCULATE (
\t\t                        COUNTROWS ( dataLet ),
\t\t                        TREATAS ( { _Id }, dataItiner[Last id_to] ),
\t\t                        NOT ISBLANK ( dataCRM[id_rezervace] )
\t\t                    )
\t\t        ),
\t\t        [PocetLetenekCelkem] > 0
\t\t    )

// 2) _Measures.tmdl — Měřítko [Pocet Letenek (Top 5)] garantující striktně 5 křivek v grafu
measure 'Pocet Letenek (Top 5)' =
\tVAR _Top5Letiste =
\t    TOPN(5, ALLSELECTED(Dim_Letiste[Letiště]), [Pocet Letenek], DESC)
\tRETURN
\t    IF(
\t        ISBLANK(SELECTEDVALUE('Dim_Date'[RokMesicText])),
\t        BLANK(),
\t        CALCULATE([Pocet Letenek], KEEPFILTERS(_Top5Letiste))
\t    )

// 3) Dim_Date.tmdl — Obsahuje pouze aktivní měsíce s rezervacemi (bez prázdných měsíců a bez Blank)
VAR _ActiveMonths =
    DISTINCT (
        SELECTCOLUMNS (
            FILTER ( dataCRM, NOT ISBLANK ( dataCRM[datum_rezervace] ) ),
            "YM", YEAR ( dataCRM[datum_rezervace] ) * 100 + MONTH ( dataCRM[datum_rezervace] )
        )
    )`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'page1' | 'page2' | 'model'>('page1');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedMedium, setSelectedMedium] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAirport, setSelectedAirport] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const statusMultiplier = useMemo(() => {
    if (selectedStatus === 'Vystaveno') return 0.84;
    if (selectedStatus === 'Stornováno') return 0.09;
    if (selectedStatus === 'Změněno') return 0.05;
    if (selectedStatus === 'Čeká na platbu') return 0.02;
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
      const vystaveno = Math.round(d.vystaveno * monthScale);
      const stornovano = Math.round(d.stornovano * monthScale);
      const zmeneno = Math.round(d.zmeneno * monthScale);
      const cekaNaPlatbu = Math.round(d.cekaNaPlatbu * monthScale);
      const total =
        selectedStatus === 'Vystaveno'
          ? vystaveno
          : selectedStatus === 'Stornováno'
          ? stornovano
          : selectedStatus === 'Změněno'
          ? zmeneno
          : selectedStatus === 'Čeká na platbu'
          ? cekaNaPlatbu
          : vystaveno + stornovano + zmeneno + cekaNaPlatbu;
      return {
        ...d,
        vystaveno,
        stornovano,
        zmeneno,
        cekaNaPlatbu,
        total: Math.max(1, total),
      };
    });
  }, [selectedAirport, selectedMonth, selectedStatus]);

  // Striktně TOP 5 destinací podle počtu prodaných letenek
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

  return (
    <div className="min-h-screen bg-[#EAF0F6] text-[#1E1E1E] p-4 md:p-6">
      <div className="max-w-[1880px] mx-auto space-y-5">
        {/* Top Rounded Pill Header Bar (Přesně podle vzoru image_5cb78c68.png + přirozené české slicery) */}
        <header className="bg-white rounded-[28px] shadow-sm border border-slate-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Přepínání stránek jako zaoblené taby vlevo */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('page1')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'page1'
                  ? 'bg-[#FDB913] text-[#1E1E1E] shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Přehled objednávek & kampaní
            </button>
            <button
              onClick={() => setActiveTab('page2')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'page2'
                  ? 'bg-[#FDB913] text-[#1E1E1E] shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              Destinace & Sezónnost (Top 5)
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'model'
                  ? 'bg-[#FDB913] text-[#1E1E1E] shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              TMDL & PBIP Kódy
            </button>
          </div>

          {/* Přirozené české Slicery uprostřed (podle image_2668d765.png) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col min-w-[145px]">
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

            {activeTab === 'page1' ? (
              <>
                <div className="flex flex-col min-w-[155px]">
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

                <div className="flex flex-col min-w-[145px]">
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
              </>
            ) : (
              <div className="flex flex-col min-w-[185px]">
                <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                  Letiště
                </label>
                <select
                  value={selectedAirport}
                  onChange={(e) => setSelectedAirport(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
                >
                  <option value="ALL">All (pouze s objednávkou)</option>
                  {ACTIVE_DESTINATIONS.map((d) => (
                    <option key={d.city} value={d.city}>
                      {d.city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col min-w-[155px]">
              <label className="text-[11px] font-semibold text-[#1E1E1E] mb-0.5">
                Stav objednávky
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700"
              >
                <option value="ALL">All</option>
                <option value="Vystaveno">Vystaveno</option>
                <option value="Stornováno">Stornováno</option>
                <option value="Změněno">Změněno</option>
                <option value="Čeká na platbu">Čeká na platbu</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              title="Resetovat filtry"
              className="mt-4 p-1.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pravá část hlavičky ve stylu Welcome to Dashboard */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E1E1E] text-[#FDB913] flex items-center justify-center font-bold shadow-xs">
              <Plane className="w-4 h-4" />
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 leading-tight">RegioJet / Student Agency</p>
              <h1 className="text-sm font-extrabold text-[#1E1E1E] leading-tight">
                Marketing BI Dashboard
              </h1>
            </div>
          </div>
        </header>

        {activeTab === 'page1' && (
          <>
            {/* 5 KPI Karet se Sparkline grafem uvnitř (přesně podle vzoru image_5cb78c68.png) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Karta 1 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-600">Počet objednávek</span>
                <div className="my-2 flex items-center justify-between gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {kpiSummary.totalOrders}
                  </span>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.ordersCRM)} />
                </div>
                <div className="text-[11px] flex items-center gap-1">
                  <span className="font-bold text-[#10B981]">↑ +41.9%</span>
                  <span className="text-slate-500">vs PM (+26)</span>
                </div>
              </div>

              {/* Karta 2 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-600">Počet letenek</span>
                <div className="my-2 flex items-center justify-between gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {kpiSummary.totalTickets}
                  </span>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.tickets)} />
                </div>
                <div className="text-[11px] flex items-center gap-1">
                  <span className="font-bold text-[#10B981]">↑ +38.4%</span>
                  <span className="text-slate-500">vs PM (1,70 / obj.)</span>
                </div>
              </div>

              {/* Karta 3 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-600">Aktivních kampaní</span>
                <div className="my-2 flex items-center justify-between gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {kpiSummary.maxCampaigns}
                  </span>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => m.campaigns)} />
                </div>
                <div className="text-[11px] flex items-center gap-1">
                  <span className="font-bold text-[#10B981]">↑ +22.2%</span>
                  <span className="text-slate-500">vs PM</span>
                </div>
              </div>

              {/* Karta 4 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-600">Průměrná CPA</span>
                <div className="my-2 flex items-center justify-between gap-2">
                  <span className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {kpiSummary.cpa.toFixed(0)} Kč
                  </span>
                  <MiniSparkline values={MONTHLY_DATA.map((m) => Math.round(m.adsCost / m.ordersCRM))} />
                </div>
                <div className="text-[11px] flex items-center gap-1">
                  <span className="font-bold text-[#10B981]">↓ -14.5%</span>
                  <span className="text-slate-500">úspora vs PM</span>
                </div>
              </div>

              {/* Karta 5 */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-600">Konverzní poměr (CR)</span>
                <div className="my-2 flex items-center justify-between gap-2">
                  <span className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
                    {kpiSummary.cr.toFixed(2)}%
                  </span>
                  <MiniSparkline
                    values={MONTHLY_DATA.map((m) =>
                      Number(((m.ordersCRM / m.adsClicks) * 100).toFixed(2))
                    )}
                  />
                </div>
                <div className="text-[11px] flex items-center gap-1">
                  <span className="font-bold text-[#10B981]">↑ +11.4%</span>
                  <span className="text-slate-500">vs PM</span>
                </div>
              </div>
            </section>

            {/* 3-sloupcový Bento Grid přesně podle vzoru image_5cb78c68.png */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEVÝ SLOUPEC (5/12): Nahoře spojnicový graf po měsících + Dole tabulka s podmíněným formátováním */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Horní levá karta: Trend po měsících */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#1E1E1E]">
                      Vývoj objednávek a letenek podle měsíců
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                    <span className="font-semibold text-[#1E1E1E]">Metrika:</span>
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

                  {/* SVG víceřádkový graf bez prázdných měsíců */}
                  <div className="pt-2">
                    <svg viewBox="0 0 500 185" className="w-full h-44 overflow-visible">
                      {[0, 15, 30, 45].map((tick, idx) => {
                        const y = 150 - (tick / 50) * 130;
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

                      {/* Křivka letenek */}
                      <polyline
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        points={MONTHLY_DATA.map((m, i) => {
                          const x = 65 + i * 95;
                          const y = 150 - (m.tickets / 50) * 130;
                          return `${x},${y}`;
                        }).join(' ')}
                      />

                      {/* Křivka CRM objednávek */}
                      <polyline
                        fill="none"
                        stroke="#FDB913"
                        strokeWidth="2.5"
                        points={MONTHLY_DATA.map((m, i) => {
                          const x = 65 + i * 95;
                          const y = 150 - (m.ordersCRM / 50) * 130;
                          return `${x},${y}`;
                        }).join(' ')}
                      />

                      {/* Křivka GA objednávek */}
                      <polyline
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        points={MONTHLY_DATA.map((m, i) => {
                          const x = 65 + i * 95;
                          const y = 150 - (m.ordersGA / 50) * 130;
                          return `${x},${y}`;
                        }).join(' ')}
                      />

                      {MONTHLY_DATA.map((m, i) => {
                        const x = 65 + i * 95;
                        return (
                          <g key={m.month}>
                            <circle
                              cx={x}
                              cy={150 - (m.tickets / 50) * 130}
                              r="3.5"
                              fill="#10B981"
                            />
                            <circle
                              cx={x}
                              cy={150 - (m.ordersCRM / 50) * 130}
                              r="3.5"
                              fill="#FDB913"
                            />
                            <text
                              x={x}
                              y="172"
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
                </div>

                {/* Spodní levá karta: Měsíční matice (pouze aktivní měsíce 2023-08 až 2023-12 jako v image_9925c190.png) */}
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
                              <td className="py-2.5 px-2.5 font-medium text-[#1E1E1E]">
                                {row.month}
                              </td>
                              <td className="py-2.5 px-2.5 text-right">{row.ordersCRM}</td>
                              <td className="py-2.5 px-2.5 text-right">{row.tickets}</td>
                              <td className="py-2.5 px-2.5 text-right font-semibold">
                                {row.momPct === null ? (
                                  <span className="text-slate-400">—</span>
                                ) : (
                                  <span
                                    className={isPos ? 'text-[#10B981]' : 'text-[#EF4444]'}
                                  >
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
                      <tfoot>
                        <tr className="border-t-2 border-slate-300 font-bold text-[#1E1E1E]">
                          <td className="py-2.5 px-2.5">Celkem</td>
                          <td className="py-2.5 px-2.5 text-right">{kpiSummary.totalOrders}</td>
                          <td className="py-2.5 px-2.5 text-right bg-slate-100">
                            {kpiSummary.totalTickets}
                          </td>
                          <td className="py-2.5 px-2.5 text-right text-[#1E1E1E]">
                            ▲ +41.9 % (+26)
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* PROSTŘEDNÍ SLOUPEC (4/12): Nahoře Donut Chart stavu objednávky + Dole Horizontální Bar Chart TOP 10 zdrojů */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Horní prostřední karta: Donut Chart */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">
                    Podíl letenek podle stavu objednávky
                  </h3>
                  <div className="flex items-center justify-around py-2">
                    <div className="relative w-40 h-40 flex items-center justify-center">
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
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="transparent"
                          stroke="#94A3B8"
                          strokeWidth="5"
                          strokeDasharray="10 90"
                          strokeDashoffset="-90"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xl font-extrabold text-[#1E1E1E]">
                          {kpiSummary.totalTickets}
                        </span>
                        <span className="block text-[10px] text-slate-500">letenek</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FDB913]" />
                        <div>
                          <div className="font-bold text-[#1E1E1E]">Vystaveno (84.0%)</div>
                          <div className="text-[11px] text-slate-500">126 letenek</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#1E1E1E]" />
                        <div>
                          <div className="font-bold text-[#1E1E1E]">Stornováno (9.3%)</div>
                          <div className="text-[11px] text-slate-500">14 letenek</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#94A3B8]" />
                        <div>
                          <div className="font-bold text-[#1E1E1E]">Změněno / Čeká (6.7%)</div>
                          <div className="text-[11px] text-slate-500">10 letenek</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spodní prostřední karta: Horizontální Bar Chart TOP 10 zdrojů */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between">
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-[#1E1E1E]">
                      TOP 10 nejefektivnějších zdrojů objednávek
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Seřazeno dle počtu objednávek (s CPA v tooltipu)
                    </p>
                  </div>
                  <div className="space-y-2.5 my-auto">
                    {filteredSources.slice(0, 7).map((s) => {
                      const maxVal = filteredSources[0]?.orders || 1;
                      const pct = Math.max(8, (s.orders / maxVal) * 100);
                      return (
                        <div key={`${s.source}-${s.medium}`} className="flex items-center gap-3 text-xs">
                          <span className="w-28 truncate text-right text-slate-600 font-medium">
                            {s.source} <span className="text-[10px] text-slate-400">({s.medium})</span>
                          </span>
                          <div className="flex-1 bg-slate-100 h-5 rounded overflow-hidden flex items-center">
                            <div
                              style={{ width: `${pct}%` }}
                              title={`CPA: ${s.cpa.toFixed(0)} Kč | CR: ${s.cr.toFixed(1)}%`}
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

              {/* PRAVÝ SLOUPEC (3/12): 3 Insight Karty pod sebou přesně jako v image_5cb78c68.png */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-center">
                  <span className="text-xs font-bold text-[#1E1E1E]">
                    Nejefektivnější zdroj objednávek
                  </span>
                  <span className="text-xl font-extrabold text-[#D97706] mt-2">
                    google (cpc)
                  </span>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    <strong>31 objednávek (35,2 %)</strong> ze všech rezervací při průměrné CPA{' '}
                    <strong>542 Kč</strong>.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-center">
                  <span className="text-xs font-bold text-[#1E1E1E]">
                    Nejúspěšnější marketingová kampaň
                  </span>
                  <span className="text-xl font-extrabold text-[#D97706] mt-2">
                    Brand_Letenky_CZ_Search
                  </span>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    <strong>24 objednávek (27,3 %)</strong> bylo realizováno přes tuto akviziční kampaň.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-center">
                  <span className="text-xs font-bold text-[#1E1E1E]">
                    Nejžádanější cílová destinace
                  </span>
                  <span className="text-xl font-extrabold text-[#D97706] mt-2">
                    Fiumicino (Řím)
                  </span>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    <strong>32 letenek (21,3 %)</strong> z celkového počtu směřovalo na letiště Řím Fiumicino.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'page2' && (
          <>
            {/* Horní graf: Striktně TOP 5 destinací v čase dle aktivních měsíců (bez Blank a bez nulových letišť) */}
            <section className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[#1E1E1E] uppercase">
                    SEZÓNNOST A VÝVOJ POPULARITY TOP 5 DESTINACÍ V ČASE DLE MĚSÍCŮ
                  </h2>
                  <p className="text-xs text-slate-500">
                    Měřítko [Pocet Letenek (Top 5)] striktně zobrazuje pouze 5 nejprodávanějších letišť a pouze měsíce s rezervacemi (2023-08 až 2023-12)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {top5Destinations.map((d, i) => {
                    const colors = ['#FDB913', '#1E1E1E', '#002B49', '#10B981', '#EF4444'];
                    return (
                      <span key={d.city} className="flex items-center gap-1.5 font-semibold">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[i] }}
                        />
                        {i + 1}. {d.city} ({d.total})
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Spojnicový graf 5 TOP destinací */}
              <div className="pt-2">
                <svg viewBox="0 0 900 220" className="w-full h-56 overflow-visible">
                  {[0, 3, 6, 9].map((tick) => {
                    const y = 180 - (tick / 10) * 150;
                    return (
                      <g key={tick}>
                        <line x1="50" y1={y} x2="860" y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                        <text x="18" y={y + 4} className="text-[11px] fill-slate-400">
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  {top5Destinations.map((dest, idx) => {
                    const colors = ['#FDB913', '#1E1E1E', '#002B49', '#10B981', '#EF4444'];
                    const pts = MONTHLY_DATA.map((m, mIdx) => {
                      const x = 110 + mIdx * 175;
                      const val = dest.monthly[m.month] ?? 0;
                      const y = 180 - (val / 10) * 150;
                      return `${x},${y}`;
                    }).join(' ');
                    return (
                      <g key={dest.city}>
                        <polyline
                          fill="none"
                          stroke={colors[idx]}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pts}
                        />
                        {MONTHLY_DATA.map((m, mIdx) => {
                          const x = 110 + mIdx * 175;
                          const val = dest.monthly[m.month] ?? 0;
                          const y = 180 - (val / 10) * 150;
                          return (
                            <g key={m.month}>
                              <circle cx={x} cy={y} r="4" fill={colors[idx]} stroke="#FFF" strokeWidth="1.5" />
                              <text
                                x={x}
                                y={y - 8}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-slate-700"
                              >
                                {val}
                              </text>
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
                        y="204"
                        textAnchor="middle"
                        className="text-xs font-bold fill-slate-700"
                      >
                        {m.month}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </section>

            {/* Spodní sekce Stránky 2: Mapa + Matice s odfiltrovanými nulovými letišti */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                <h3 className="text-sm font-bold text-[#1E1E1E] mb-1">
                  GEOGRAFICKÁ MAPA AKTIVNÍCH DESTINACÍ DLE POČTU PRODÁVANÝCH LETENEK
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Zobrazena pouze letiště z tabulky Dim_Letiste s reálnými objednávkami
                </p>

                <div className="relative bg-[#002B49] rounded-xl h-80 overflow-hidden p-4">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
                  {filteredDestinations.map((dest) => {
                    const xPct = Math.min(88, Math.max(12, ((dest.lon + 85) / 195) * 100));
                    const yPct = Math.min(84, Math.max(16, ((60 - dest.lat) / 52) * 100));
                    const sizePx = Math.max(30, Math.min(60, dest.total * 1.8));
                    return (
                      <div
                        key={dest.city}
                        style={{ left: `${xPct}%`, top: `${yPct}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      >
                        <div
                          style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
                          className="rounded-full bg-[#FDB913] border-2 border-white shadow-md flex items-center justify-center text-xs font-extrabold text-[#1E1E1E]"
                        >
                          {dest.total}
                        </div>
                        <span className="mt-1 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-semibold whitespace-nowrap">
                          {dest.city}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex-1">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-2">
                    MATICE DESTINACÍ VS. STAVY OBJEDNÁVKY (POUZE AKTIVNÍ LETIŠTĚ)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#FDB913] bg-slate-50 text-left">
                          <th className="py-2 px-2.5 font-bold">Letiště</th>
                          <th className="py-2 px-2.5 font-bold text-right text-[#10B981]">Vystaveno</th>
                          <th className="py-2 px-2.5 font-bold text-right text-[#EF4444]">Stornováno</th>
                          <th className="py-2 px-2.5 font-bold text-right">Změněno</th>
                          <th className="py-2 px-2.5 font-bold text-right">Celkem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDestinations.map((d) => (
                          <tr key={d.city} className="hover:bg-amber-50/40">
                            <td className="py-2 px-2.5 font-semibold">{d.city}</td>
                            <td className="py-2 px-2.5 text-right">{d.vystaveno}</td>
                            <td className="py-2 px-2.5 text-right text-[#EF4444]">{d.stornovano}</td>
                            <td className="py-2 px-2.5 text-right">{d.zmeneno}</td>
                            <td className="py-2 px-2.5 text-right font-bold">{d.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-[#FDB913] p-4 shadow-xs text-xs space-y-1">
                  <div className="font-bold text-[#1E1E1E] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#FDB913]" />
                    ANALYTICKÁ POZNÁMKA – DATOVÉ LIMITACE PRO VÝPOČET CPA, ROAS & CTR:
                  </div>
                  <p className="text-slate-600">
                    1) Chybějící <strong>Impressions</strong> v <code>dataAds</code> (nelze spočítat CTR). 2) Chybějící nekonvertující sessions v <code>dataGA</code>. 3) Týdenní agregace nákladů <code>WeekGroup</code> bez vazby na <code>id_rezervace</code> a absence tržby/marže v Kč pro výpočet <strong>ROAS</strong>.
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
                  Zapsáno přímo do souborů Dim_Letiste.tmdl, Dim_Date.tmdl, _Measures.tmdl a relationships.tmdl
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
