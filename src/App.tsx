import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Globe2,
  Database,
  FileCode2,
  Filter,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
  Info,
  Layers,
  RotateCcw,
} from 'lucide-react';

interface MonthlyRecord {
  month: string;
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

const MONTHLY_DATA: MonthlyRecord[] = [
  { month: '2024-01', ordersCRM: 1420, ordersGA: 1385, tickets: 2310, adsCost: 298200, adsClicks: 38400, campaigns: 18 },
  { month: '2024-02', ordersCRM: 1580, ordersGA: 1542, tickets: 2590, adsCost: 312840, adsClicks: 41200, campaigns: 19 },
  { month: '2024-03', ordersCRM: 1890, ordersGA: 1840, tickets: 3120, adsCost: 359100, adsClicks: 46800, campaigns: 22 },
  { month: '2024-04', ordersCRM: 2140, ordersGA: 2095, tickets: 3580, adsCost: 395900, adsClicks: 51500, campaigns: 24 },
  { month: '2024-05', ordersCRM: 2680, ordersGA: 2610, tickets: 4510, adsCost: 469000, adsClicks: 62300, campaigns: 27 },
  { month: '2024-06', ordersCRM: 3190, ordersGA: 3115, tickets: 5490, adsCost: 526350, adsClicks: 71800, campaigns: 31 },
  { month: '2024-07', ordersCRM: 3640, ordersGA: 3560, tickets: 6370, adsCost: 575120, adsClicks: 79400, campaigns: 33 },
  { month: '2024-08', ordersCRM: 3410, ordersGA: 3330, tickets: 5930, adsCost: 545600, adsClicks: 75200, campaigns: 30 },
  { month: '2024-09', ordersCRM: 2520, ordersGA: 2465, tickets: 4180, adsCost: 441000, adsClicks: 58900, campaigns: 25 },
  { month: '2024-10', ordersCRM: 2080, ordersGA: 2025, tickets: 3390, adsCost: 384800, adsClicks: 49600, campaigns: 22 },
  { month: '2024-11', ordersCRM: 1760, ordersGA: 1710, tickets: 2850, adsCost: 343200, adsClicks: 44100, campaigns: 20 },
  { month: '2024-12', ordersCRM: 2290, ordersGA: 2230, tickets: 3890, adsCost: 423650, adsClicks: 54800, campaigns: 26 },
];

const SOURCE_DATA: SourceRecord[] = [
  { source: 'google', medium: 'cpc', orders: 9840, tickets: 16720, adsCost: 1948320, adsClicks: 248000 },
  { source: 'seznam', medium: 'cpc', orders: 4620, tickets: 7850, adsCost: 970200, adsClicks: 132000 },
  { source: '(direct)', medium: '(none)', orders: 4180, tickets: 7020, adsCost: 0, adsClicks: 0 },
  { source: 'google', medium: 'organic', orders: 3540, tickets: 5980, adsCost: 0, adsClicks: 0 },
  { source: 'facebook', medium: 'paid_social', orders: 2190, tickets: 3740, adsCost: 591300, adsClicks: 89500 },
  { source: 'newsletter_rj', medium: 'email', orders: 1680, tickets: 2890, adsCost: 84000, adsClicks: 42000 },
  { source: 'seznam', medium: 'organic', orders: 960, tickets: 1610, adsCost: 0, adsClicks: 0 },
  { source: 'instagram', medium: 'paid_social', orders: 740, tickets: 1260, adsCost: 229400, adsClicks: 36800 },
  { source: 'affiliate_cj', medium: 'affiliate', orders: 520, tickets: 890, adsCost: 145600, adsClicks: 19400 },
  { source: 'bing', medium: 'cpc', orders: 330, tickets: 540, adsCost: 75900, adsClicks: 11200 },
];

const DESTINATION_DATA: DestinationRecord[] = [
  {
    city: 'Londýn (LHR/STN)',
    country: 'Velká Británie',
    lat: 51.5074,
    lon: -0.1278,
    vystaveno: 8420,
    stornovano: 640,
    zmeneno: 410,
    cekaNaPlatbu: 180,
    monthly: {
      '2024-01': 520, '2024-02': 580, '2024-03': 710, '2024-04': 820,
      '2024-05': 940, '2024-06': 1120, '2024-07': 1240, '2024-08': 1180,
      '2024-09': 860, '2024-10': 690, '2024-11': 480, '2024-12': 510,
    },
  },
  {
    city: 'Paříž (CDG/ORY)',
    country: 'Francie',
    lat: 48.8566,
    lon: 2.3522,
    vystaveno: 6890,
    stornovano: 510,
    zmeneno: 320,
    cekaNaPlatbu: 140,
    monthly: {
      '2024-01': 390, '2024-02': 440, '2024-03': 580, '2024-04': 690,
      '2024-05': 830, '2024-06': 960, '2024-07': 1050, '2024-08': 990,
      '2024-09': 720, '2024-10': 510, '2024-11': 340, '2024-12': 360,
    },
  },
  {
    city: 'Řím (FCO)',
    country: 'Itálie',
    lat: 41.9028,
    lon: 12.4964,
    vystaveno: 6120,
    stornovano: 430,
    zmeneno: 290,
    cekaNaPlatbu: 120,
    monthly: {
      '2024-01': 310, '2024-02': 360, '2024-03': 490, '2024-04': 640,
      '2024-05': 780, '2024-06': 910, '2024-07': 980, '2024-08': 920,
      '2024-09': 670, '2024-10': 460, '2024-11': 220, '2024-12': 220,
    },
  },
  {
    city: 'Barcelona (BCN)',
    country: 'Španělsko',
    lat: 41.3874,
    lon: 2.1686,
    vystaveno: 5740,
    stornovano: 390,
    zmeneno: 260,
    cekaNaPlatbu: 110,
    monthly: {
      '2024-01': 260, '2024-02': 310, '2024-03': 430, '2024-04': 570,
      '2024-05': 740, '2024-06': 920, '2024-07': 1080, '2024-08': 1010,
      '2024-09': 610, '2024-10': 310, '2024-11': 130, '2024-12': 130,
    },
  },
  {
    city: 'Amsterdam (AMS)',
    country: 'Nizozemsko',
    lat: 52.3676,
    lon: 4.9041,
    vystaveno: 4480,
    stornovano: 310,
    zmeneno: 195,
    cekaNaPlatbu: 95,
    monthly: {
      '2024-01': 240, '2024-02': 270, '2024-03': 380, '2024-04': 510,
      '2024-05': 590, '2024-06': 640, '2024-07': 690, '2024-08': 650,
      '2024-09': 470, '2024-10': 320, '2024-11': 160, '2024-12': 160,
    },
  },
  {
    city: 'Dubaj (DXB)',
    country: 'SAE',
    lat: 25.2048,
    lon: 55.2708,
    vystaveno: 3890,
    stornovano: 280,
    zmeneno: 210,
    cekaNaPlatbu: 90,
    monthly: {
      '2024-01': 510, '2024-02': 490, '2024-03': 440, '2024-04': 360,
      '2024-05': 240, '2024-06': 190, '2024-07': 180, '2024-08': 210,
      '2024-09': 340, '2024-10': 460, '2024-11': 520, '2024-12': 530,
    },
  },
  {
    city: 'New York (JFK)',
    country: 'USA',
    lat: 40.7128,
    lon: -74.006,
    vystaveno: 3420,
    stornovano: 260,
    zmeneno: 185,
    cekaNaPlatbu: 85,
    monthly: {
      '2024-01': 210, '2024-02': 230, '2024-03': 290, '2024-04': 340,
      '2024-05': 410, '2024-06': 460, '2024-07': 510, '2024-08': 480,
      '2024-09': 360, '2024-10': 280, '2024-11': 190, '2024-12': 190,
    },
  },
];

const TMDL_MEASURES_CODE = `table _Measures
\tlineageTag: 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6e

\tmeasure 'Pocet Objednavek (CRM)' = DISTINCTCOUNT(dataCRM[id_rezervace])
\t\tformatString: #,0
\t\tdisplayFolder: 01. Objednávky & Letenky

\tmeasure 'Pocet Objednavek (GA)' =
\t\t\tCALCULATE(
\t\t\t    DISTINCTCOUNT(dataGA[customEvent:rezervacni_kod]),
\t\t\t    dataGA[customEvent:rezervacni_kod] <> BLANK(),
\t\t\t    dataGA[customEvent:rezervacni_kod] <> "(not set)"
\t\t\t)
\t\tformatString: #,0
\t\tdisplayFolder: 01. Objednávky & Letenky

\tmeasure 'Pocet Letenek' = COUNTROWS(dataLet)
\t\tformatString: #,0
\t\tdisplayFolder: 01. Objednávky & Letenky

\tmeasure 'Pocet Kampani' = DISTINCTCOUNTNOBLANK(dataAds[sessionCampaignName])
\t\tformatString: #,0
\t\tdisplayFolder: 02. Marketing & Ads

\tmeasure 'Naklady Ads' = SUM(dataAds[AdsCost])
\t\tformatString: #,0 "Kč"
\t\tdisplayFolder: 02. Marketing & Ads

\tmeasure 'Kliky Ads' = SUM(dataAds[AdsClicks])
\t\tformatString: #,0
\t\tdisplayFolder: 02. Marketing & Ads

\tmeasure CPA = DIVIDE([Naklady Ads], [Pocet Objednavek (CRM)], BLANK())
\t\tformatString: #,0.00 "Kč"
\t\tdisplayFolder: 02. Marketing & Ads

\tmeasure 'CR %' = DIVIDE([Pocet Objednavek (CRM)], [Kliky Ads], BLANK())
\t\tformatString: 0.00 %
\t\tdisplayFolder: 02. Marketing & Ads

\tmeasure 'Objednavky PM' = CALCULATE([Pocet Objednavek (CRM)], DATEADD('Dim_Date'[Date], -1, MONTH))
\t\tformatString: #,0
\t\tdisplayFolder: 03. Time Intelligence (MoM)

\tmeasure 'Objednavky MoM Abs' =
\t\t\tVAR _Current = [Pocet Objednavek (CRM)]
\t\t\tVAR _Prev = [Objednavky PM]
\t\t\tRETURN
\t\t\t    IF(NOT ISBLANK(_Current) && NOT ISBLANK(_Prev), _Current - _Prev, BLANK())
\t\tformatString: +#,0;-#,0;0
\t\tdisplayFolder: 03. Time Intelligence (MoM)

\tmeasure 'Objednavky MoM %' = DIVIDE([Objednavky MoM Abs], [Objednavky PM], BLANK())
\t\tformatString: +0.0 %;-0.0 %;0.0 %
\t\tdisplayFolder: 03. Time Intelligence (MoM)

\tmeasure 'MoM Trend Indikator' =
\t\t\tVAR _DeltaPct = [Objednavky MoM %]
\t\t\tVAR _DeltaAbs = [Objednavky MoM Abs]
\t\t\tRETURN
\t\t\t    SWITCH(
\t\t\t        TRUE(),
\t\t\t        ISBLANK(_DeltaPct), "— (bez historie)",
\t\t\t        _DeltaPct > 0, "▲ +" & FORMAT(_DeltaPct, "0.0 %") & " (+" & FORMAT(_DeltaAbs, "#,0") & ")",
\t\t\t        _DeltaPct < 0, "▼ " & FORMAT(_DeltaPct, "0.0 %") & " (" & FORMAT(_DeltaAbs, "#,0") & ")",
\t\t\t        "▬ 0.0 % (0)"
\t\t\t    )
\t\tdisplayFolder: 03. Time Intelligence (MoM)`;

const TMDL_RELATIONSHIPS_CODE = `relationship 63f3ac17-ab83-b88e-16dc-73d61e609dfc
\tcrossFilteringBehavior: bothDirections
\tfromCardinality: one
\tfromColumn: dataCRM.locator
\ttoColumn: dataGA.customEvent:rezervacni_kod

relationship 3bb9e703-770a-ff0c-0d4e-56c9801497fd
\tfromColumn: dataCRM.datum_rezervace
\ttoColumn: Dim_Date.Date

relationship 05e9ea41-61af-507e-5830-969086029415
\tfromColumn: dataAds.WeekGroup
\ttoColumn: Dim_Date.Date

relationship a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d
\tfromColumn: dataAds.sessionCampaignName
\ttoColumn: Dim_Campaign.sessionCampaignName

relationship b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e
\tcrossFilteringBehavior: bothDirections
\tfromColumn: dataGA.sessionCampaignName
\ttoColumn: Dim_Campaign.sessionCampaignName`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'page1' | 'page2' | 'model' | 'code'>('page1');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedMedium, setSelectedMedium] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const statusMultiplier = useMemo(() => {
    if (selectedStatus === 'Vystaveno') return 0.87;
    if (selectedStatus === 'Stornováno') return 0.065;
    if (selectedStatus === 'Změněno') return 0.045;
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
    return Math.max(0.03, matchedOrders / totalOrders);
  }, [selectedSource, selectedMedium]);

  const enrichedMonthly = useMemo(() => {
    const factor = statusMultiplier * sourceMultiplier;
    return MONTHLY_DATA.map((item, idx) => {
      const orders = Math.round(item.ordersCRM * factor);
      const tickets = Math.round(item.tickets * factor);
      const prevOrders = idx > 0 ? Math.round(MONTHLY_DATA[idx - 1].ordersCRM * factor) : null;
      const momAbs = prevOrders !== null ? orders - prevOrders : null;
      const momPct = prevOrders && momAbs !== null ? (momAbs / prevOrders) * 100 : null;
      return {
        ...item,
        ordersCRM: orders,
        tickets,
        adsCost: Math.round(item.adsCost * sourceMultiplier),
        adsClicks: Math.round(item.adsClicks * sourceMultiplier),
        momAbs,
        momPct,
      };
    }).filter((m) => selectedMonth === 'ALL' || m.month === selectedMonth);
  }, [selectedMonth, statusMultiplier, sourceMultiplier]);

  const kpiSummary = useMemo(() => {
    const totalOrders = enrichedMonthly.reduce((acc, r) => acc + r.ordersCRM, 0);
    const totalCost = enrichedMonthly.reduce((acc, r) => acc + r.adsCost, 0);
    const totalClicks = enrichedMonthly.reduce((acc, r) => acc + r.adsClicks, 0);
    const maxCampaigns = enrichedMonthly.reduce((acc, r) => Math.max(acc, r.campaigns), 0);
    const cpa = totalOrders > 0 ? totalCost / totalOrders : 0;
    const cr = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;
    const lastRow = enrichedMonthly[enrichedMonthly.length - 1];
    return {
      totalOrders,
      maxCampaigns,
      cpa,
      cr,
      latestMoMPct: lastRow?.momPct ?? 12.4,
      latestMoMAbs: lastRow?.momAbs ?? 530,
    };
  }, [enrichedMonthly]);

  const filteredSources = useMemo(() => {
    const monthFactor = selectedMonth === 'ALL' ? 1 : 1 / 12;
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
    return DESTINATION_DATA.filter(
      (d) => selectedCountry === 'ALL' || d.country === selectedCountry
    ).map((d) => {
      const monthScale =
        selectedMonth === 'ALL'
          ? 1
          : (d.monthly[selectedMonth] || 300) /
            Object.values(d.monthly).reduce((a, b) => a + b, 0);
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
        total,
      };
    });
  }, [selectedCountry, selectedMonth, selectedStatus]);

  const resetFilters = () => {
    setSelectedMonth('ALL');
    setSelectedSource('ALL');
    setSelectedMedium('ALL');
    setSelectedStatus('ALL');
    setSelectedCountry('ALL');
  };

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1E1E1E] flex flex-col">
      {/* Power BI Top Navigation Bar */}
      <header className="bg-[#1E1E1E] text-white border-b-4 border-[#FDB913] px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#FDB913] text-[#1E1E1E] font-black px-3 py-1.5 rounded text-sm tracking-wider">
            REGIOJET
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              ukol.pbip — Power BI Marketing & Sales Report (1920×1080)
            </h1>
            <p className="text-xs text-slate-400">
              PBIP / TMDL SemanticModel + PBIR Report v2.0 • Student Agency / RegioJet BI
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 bg-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('page1')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'page1'
                ? 'bg-[#FDB913] text-[#1E1E1E]'
                : 'text-slate-300 hover:text-white hover:bg-neutral-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Stránka 1: Objednávky & Kampaně
          </button>
          <button
            onClick={() => setActiveTab('page2')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'page2'
                ? 'bg-[#FDB913] text-[#1E1E1E]'
                : 'text-slate-300 hover:text-white hover:bg-neutral-700'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            Stránka 2: Destinace & Sezónnost
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'model'
                ? 'bg-[#FDB913] text-[#1E1E1E]'
                : 'text-slate-300 hover:text-white hover:bg-neutral-700'
            }`}
          >
            <Database className="w-4 h-4" />
            Datový model (TMDL)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#FDB913] text-[#1E1E1E]'
                : 'text-slate-300 hover:text-white hover:bg-neutral-700'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            TMDL & PBIR Kódy
          </button>
        </nav>
      </header>

      {/* Main Canvas Container */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-6 space-y-4">
        {activeTab === 'page1' && (
          <>
            {/* Horní lišta (Y: 24px, H: 80px) */}
            <section className="bg-white rounded-xl border-2 border-[#FDB913] shadow-sm px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1E1E1E] tracking-tight">
                  PŘEHLED OBJEDNÁVEK & MARKETINGOVÝCH KAMPANÍ
                </h2>
                <p className="text-xs text-slate-500">
                  Performance přehled rezervací, nákladovosti (CPA), konverzního poměru (CR %) a akvizičních zdrojů
                </p>
              </div>

              {/* 4 Dropdown filtry */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                    Měsíc / Rok [Dim_Date]
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E1E1E]"
                  >
                    <option value="ALL">Všechny měsíce (2024)</option>
                    {MONTHLY_DATA.map((m) => (
                      <option key={m.month} value={m.month}>
                        {m.month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                    Zdroj [dataGA.sessionSource]
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E1E1E]"
                  >
                    <option value="ALL">Všechny zdroje</option>
                    {Array.from(new Set(SOURCE_DATA.map((s) => s.source))).map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                    Médium [dataGA.sessionMedium]
                  </label>
                  <select
                    value={selectedMedium}
                    onChange={(e) => setSelectedMedium(e.target.value)}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E1E1E]"
                  >
                    <option value="ALL">Všechna média</option>
                    {Array.from(new Set(SOURCE_DATA.map((s) => s.medium))).map((med) => (
                      <option key={med} value={med}>
                        {med}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                    Stav rezervace [datastav.nazev]
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E1E1E]"
                  >
                    <option value="ALL">Všechny stavy</option>
                    <option value="Vystaveno">Vystaveno</option>
                    <option value="Stornováno">Stornováno</option>
                    <option value="Změněno">Změněno</option>
                    <option value="Čeká na platbu">Čeká na platbu</option>
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  title="Resetovat filtry"
                  className="mt-3.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* 4 KPI Karty (Y: 120 px, výška 130 px, šířka 456 px) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* KPI 1 */}
              <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#FDB913] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    1. CELKEM OBJEDNÁVEK (CRM)
                  </span>
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                    [Pocet Objednavek (CRM)]
                  </span>
                </div>
                <div className="my-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#1E1E1E]">
                    {kpiSummary.totalOrders.toLocaleString('cs-CZ')}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                      kpiSummary.latestMoMPct >= 0
                        ? 'bg-emerald-50 text-[#10B981]'
                        : 'bg-red-50 text-[#EF4444]'
                    }`}
                  >
                    {kpiSummary.latestMoMPct >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {kpiSummary.latestMoMPct >= 0 ? '+' : ''}
                    {kpiSummary.latestMoMPct.toFixed(1)} % MoM
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DISTINCTCOUNT(dataCRM[id_rezervace]) • 1:1 vazba na GA
                </p>
              </div>

              {/* KPI 2 */}
              <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#FDB913] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    2. AKTIVNÍCH KAMPANÍ
                  </span>
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                    [Pocet Kampani]
                  </span>
                </div>
                <div className="my-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#1E1E1E]">
                    {kpiSummary.maxCampaigns}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Dim_Campaign Bridge (1:N)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DISTINCTCOUNTNOBLANK(dataAds[sessionCampaignName])
                </p>
              </div>

              {/* KPI 3 */}
              <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#FDB913] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    3. PRŮMĚRNÁ CPA
                  </span>
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                    [CPA]
                  </span>
                </div>
                <div className="my-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#1E1E1E]">
                    {kpiSummary.cpa.toLocaleString('cs-CZ', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    Kč
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Náklady / Objednávky
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DIVIDE([Naklady Ads], [Pocet Objednavek (CRM)], BLANK())
                </p>
              </div>

              {/* KPI 4 */}
              <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-[#FDB913] p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    4. KONVERZNÍ POMĚR (CR %)
                  </span>
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                    [CR %]
                  </span>
                </div>
                <div className="my-2 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#1E1E1E]">
                    {kpiSummary.cr.toFixed(2)} %
                  </span>
                  <span className="text-xs font-semibold text-[#10B981]">
                    Objednávky / Kliky Ads
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DIVIDE([Pocet Objednavek (CRM)], [Kliky Ads], BLANK())
                </p>
              </div>
            </section>

            {/* Spodní analytická sekce: Levá matice (800 px) + Pravý graf TOP 10 zdrojů (1056 px) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Levá část: Matice Měsíce vs. Počet objednávek, Počet letenek, MoM změna */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1E1E]">
                      MĚSÍČNÍ VÝVOJ OBJEDNÁVEK, LETENEK A MEZIMĚSÍČNÍ ZMĚNA (MoM)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Matice (X: 24 px, Y: 266 px, Šířka: 800 px, Výška: 790 px)
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#FDB913] bg-slate-50 text-left text-[#1E1E1E]">
                        <th className="py-2.5 px-3 font-bold">Měsíc (RokMesicText)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Objednávky (CRM)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Počet letenek</th>
                        <th className="py-2.5 px-3 font-bold text-right">MoM %</th>
                        <th className="py-2.5 px-3 font-bold text-right">MoM Trend Indikátor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enrichedMonthly.map((row) => {
                        const isPos = (row.momPct ?? 0) > 0;
                        const isNeg = (row.momPct ?? 0) < 0;
                        return (
                          <tr key={row.month} className="hover:bg-amber-50/40 transition">
                            <td className="py-2 px-3 font-semibold text-[#1E1E1E]">{row.month}</td>
                            <td className="py-2 px-3 text-right font-medium">
                              {row.ordersCRM.toLocaleString('cs-CZ')}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600">
                              {row.tickets.toLocaleString('cs-CZ')}
                            </td>
                            <td
                              className={`py-2 px-3 text-right font-bold ${
                                isPos
                                  ? 'text-[#10B981]'
                                  : isNeg
                                  ? 'text-[#EF4444]'
                                  : 'text-slate-400'
                              }`}
                            >
                              {row.momPct === null
                                ? '—'
                                : `${row.momPct > 0 ? '+' : ''}${row.momPct.toFixed(1)} %`}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {row.momPct === null ? (
                                <span className="text-slate-400">— (bez historie)</span>
                              ) : (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold ${
                                    isPos
                                      ? 'bg-emerald-50 text-[#10B981]'
                                      : 'bg-red-50 text-[#EF4444]'
                                  }`}
                                >
                                  {isPos ? '▲' : '▼'} {isPos ? '+' : ''}
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
                      <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-[#1E1E1E]">
                        <td className="py-2.5 px-3">Celkem</td>
                        <td className="py-2.5 px-3 text-right">
                          {enrichedMonthly
                            .reduce((a, b) => a + b.ordersCRM, 0)
                            .toLocaleString('cs-CZ')}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {enrichedMonthly
                            .reduce((a, b) => a + b.tickets, 0)
                            .toLocaleString('cs-CZ')}
                        </td>
                        <td className="py-2.5 px-3 text-right text-[#10B981]">
                          +{kpiSummary.latestMoMPct.toFixed(1)} %
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          Průměr: 1,66 letenky / obj.
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Pravá část: Clustered Bar Chart TOP 10 nejefektivnějších zdrojů */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1E1E]">
                      TOP 10 NEJEFEKTIVNĚJŠÍCH ZDROJŮ (sessionSource) PODLE POČTU OBJEDNÁVEK
                    </h3>
                    <p className="text-xs text-slate-500">
                      Clustered Bar Chart (X: 840 px, Y: 266 px, Šířka: 1056 px, Výška: 790 px) • Najetím zobrazíte CPA a CR % v Tooltipu
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-[#FDB913]/20 text-[#1E1E1E] px-2.5 py-1 rounded">
                    TopN = 10 • Barva #FDB913
                  </span>
                </div>

                <div className="space-y-3 my-auto">
                  {filteredSources.map((src, idx) => {
                    const maxOrders = filteredSources[0]?.orders || 1;
                    const widthPct = Math.max(6, (src.orders / maxOrders) * 100);
                    return (
                      <div key={`${src.source}-${src.medium}`} className="group relative">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-[#1E1E1E]">
                            {idx + 1}. {src.source}{' '}
                            <span className="text-slate-400 font-normal">/ {src.medium}</span>
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-[11px] text-slate-500">
                              CPA:{' '}
                              <strong className="text-[#1E1E1E]">
                                {src.cpa > 0 ? `${src.cpa.toFixed(0)} Kč` : '0 Kč (Organic/Direct)'}
                              </strong>
                            </span>
                            <span className="font-bold text-[#1E1E1E] w-20 text-right">
                              {src.orders.toLocaleString('cs-CZ')} obj.
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-6 bg-slate-100 rounded-md overflow-hidden flex items-center">
                          <div
                            style={{ width: `${widthPct}%` }}
                            className="h-full bg-[#FDB913] group-hover:bg-[#e5a50a] transition-all flex items-center justify-end pr-2 text-[11px] font-bold text-[#1E1E1E]"
                          >
                            {widthPct > 18 ? `${src.orders.toLocaleString('cs-CZ')}` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'page2' && (
          <>
            {/* Horní lišta Stránky 2 */}
            <section className="bg-white rounded-xl border-2 border-[#FDB913] shadow-sm px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1E1E1E] tracking-tight">
                  DESTINACE, GEOGRAFIE & SEZÓNNOST LETENEK (BONUS)
                </h2>
                <p className="text-xs text-slate-500">
                  Analýza TOP 5 destinací v čase, geografická bublinová mapa a matice stavů objednávek
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                    Stav objednávky [datastav.nazev]
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E1E1E]"
                  >
                    <option value="ALL">Všechny stavy</option>
                    <option value="Vystaveno">Vystaveno</option>
                    <option value="Stornováno">Stornováno</option>
                    <option value="Změněno">Změněno</option>
                    <option value="Čeká na platbu">Čeká na platbu</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                    Země / Destinace [datadestinace]
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E1E1E]"
                  >
                    <option value="ALL">Všechny země</option>
                    {DESTINATION_DATA.map((d) => (
                      <option key={d.country} value={d.country}>
                        {d.country} ({d.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">
                    Měsíc [Dim_Date.RokMesicText]
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1E1E1E]"
                  >
                    <option value="ALL">Všechny měsíce (2024)</option>
                    {MONTHLY_DATA.map((m) => (
                      <option key={m.month} value={m.month}>
                        {m.month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Horní graf (Šířka: celá 1872px, Výška: 380px): Line Chart Top 5 destinací */}
            <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1E1E]">
                    VÝVOJ POPULARITY TOP 5 DESTINACÍ V ČASE DLE MĚSÍCŮ (datadestinace[nazev])
                  </h3>
                  <p className="text-xs text-slate-500">
                    Line Chart (X: 24 px, Y: 120 px, Šířka: 1872 px, Výška: 380 px)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {DESTINATION_DATA.slice(0, 5).map((d, i) => {
                    const colors = ['#FDB913', '#1E1E1E', '#002B49', '#10B981', '#EF4444'];
                    return (
                      <span key={d.city} className="flex items-center gap-1.5 font-semibold">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: colors[i] }}
                        />
                        {d.city}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 pt-2 items-end h-56 border-b border-slate-200 pb-2 px-2">
                {MONTHLY_DATA.map((m) => {
                  const top5 = DESTINATION_DATA.slice(0, 5);
                  const colors = ['#FDB913', '#1E1E1E', '#002B49', '#10B981', '#EF4444'];
                  return (
                    <div
                      key={m.month}
                      className={`flex flex-col items-center h-full justify-end group ${
                        selectedMonth !== 'ALL' && selectedMonth !== m.month ? 'opacity-30' : ''
                      }`}
                    >
                      <div className="w-full flex items-end justify-center gap-1 h-44">
                        {top5.map((dest, idx) => {
                          const val = dest.monthly[m.month] || 200;
                          const hPct = Math.round((val / 1300) * 100);
                          return (
                            <div
                              key={dest.city}
                              style={{
                                height: `${hPct}%`,
                                backgroundColor: colors[idx],
                              }}
                              title={`${dest.city} (${m.month}): ${val} letenek`}
                              className="w-2.5 rounded-t transition-all group-hover:brightness-110"
                            />
                          );
                        })}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 mt-2">
                        {m.month.slice(5)}. měs
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Spodní část: Levá Bublinová mapa (900px) + Pravá Matice a Analytická poznámka (956px) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Spodní levá část: Bublinová mapa */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1E1E]">
                      BUBLINOVÁ MAPA DESTINACÍ DLE POČTU LETENEK (#FDB913)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Map visual (X: 24 px, Y: 516 px, Šířka: 900 px, Výška: 520 px) • dataCategory: Place
                    </p>
                  </div>
                </div>

                <div className="relative bg-[#002B49] rounded-xl h-96 overflow-hidden flex items-center justify-center p-6">
                  {/* Stylizovaná souřadnicová síť mapy */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="relative w-full h-full">
                    {filteredDestinations.map((dest) => {
                      const xPct = Math.min(90, Math.max(12, ((dest.lon + 80) / 145) * 100));
                      const yPct = Math.min(86, Math.max(15, ((60 - dest.lat) / 45) * 100));
                      const sizePx = Math.max(34, Math.min(76, Math.round(dest.total / 135)));
                      return (
                        <div
                          key={dest.city}
                          style={{ left: `${xPct}%`, top: `${yPct}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                        >
                          <div
                            style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
                            className="rounded-full bg-[#FDB913]/85 border-2 border-white shadow-lg flex items-center justify-center text-[11px] font-extrabold text-[#1E1E1E] group-hover:scale-110 transition cursor-pointer"
                          >
                            {dest.total.toLocaleString('cs-CZ')}
                          </div>
                          <span className="mt-1 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-semibold whitespace-nowrap">
                            {dest.city}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Spodní pravá část: Matice destinací vs. stavy objednávky + Analytická poznámka */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex-1">
                  <h3 className="text-sm font-bold text-[#1E1E1E] mb-1">
                    MATICE: MĚSTA / DESTINACE VS. STAVY OBJEDNÁVKY
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    PivotTable (X: 940 px, Y: 516 px, Šířka: 956 px, Výška: 356 px)
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#FDB913] bg-slate-50 text-left">
                          <th className="py-2 px-3 font-bold">Destinace (nazev)</th>
                          <th className="py-2 px-3 font-bold text-right text-[#10B981]">Vystaveno</th>
                          <th className="py-2 px-3 font-bold text-right text-[#EF4444]">Stornováno</th>
                          <th className="py-2 px-3 font-bold text-right text-amber-600">Změněno</th>
                          <th className="py-2 px-3 font-bold text-right text-slate-500">Čeká na platbu</th>
                          <th className="py-2 px-3 font-bold text-right">Celkem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDestinations.map((d) => (
                          <tr key={d.city} className="hover:bg-amber-50/40">
                            <td className="py-2 px-3 font-semibold">{d.city}</td>
                            <td className="py-2 px-3 text-right font-medium">
                              {d.vystaveno.toLocaleString('cs-CZ')}
                            </td>
                            <td className="py-2 px-3 text-right text-[#EF4444]">
                              {d.stornovano.toLocaleString('cs-CZ')}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {d.zmeneno.toLocaleString('cs-CZ')}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-500">
                              {d.cekaNaPlatbu.toLocaleString('cs-CZ')}
                            </td>
                            <td className="py-2 px-3 text-right font-bold">
                              {(d.vystaveno + d.stornovano + d.zmeneno + d.cekaNaPlatbu).toLocaleString(
                                'cs-CZ'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytická poznámka (Text box s odpovědí na bonusovou otázku) */}
                <div className="bg-white rounded-xl border-2 border-[#FDB913] p-4 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-5 h-5 text-[#FDB913] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1.5">
                      <h4 className="font-bold text-[#1E1E1E]">
                        ANALYTICKÁ POZNÁMKA – CHYBĚJÍCÍ DATA PRO VÝPOČET CPA / ROAS / CTR V DATABÁZI:
                      </h4>
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        <li>
                          <strong>Chybějící imprese (Impressions) v dataAds:</strong> Tabulka obsahuje pouze{' '}
                          <code>AdsCost</code> a <code>AdsClicks</code>, bez počtu zobrazení nelze vypočítat{' '}
                          <strong>CTR %</strong> (Kliky / Imprese) ani CPM.
                        </li>
                        <li>
                          <strong>Chybějící nekonvertující sessions v dataGA:</strong> Tabulka obsahuje pouze záznamy s{' '}
                          <code>rezervacni_kod</code>, nikoliv celkovou návštěvnost webu pro skutečný e-commerce CR %.
                        </li>
                        <li>
                          <strong>Týdenní agregace nákladů (WeekGroup) a absence tržeb/marže:</strong> Náklady v{' '}
                          <code>dataAds</code> jsou agregované na týdny bez přímé vazby na <code>id_rezervace</code> a v{' '}
                          <code>dataCRM</code>/<code>dataLet</code> chybí cena letenky či marže v Kč pro výpočet{' '}
                          <strong>ROAS / PNO</strong>.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'model' && (
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1E1E1E]">
                ARCHITEKTURA DATOVÉHO MODELU (ukol.SemanticModel)
              </h2>
              <p className="text-xs text-slate-500">
                Star-schema rozšířené o přemosťovací dimenzi Dim_Campaign, kalendář Dim_Date a 1:1 obousměrnou relaci mezi dataCRM a dataGA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-[#FDB913] rounded-xl p-4 bg-amber-50/20">
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  <Layers className="w-4 h-4 text-[#FDB913]" />
                  1. Kalendářní dimenze Dim_Date (1:N)
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Dynamická DAX tabulka pokrývající kompletní roky ze všech faktových tabulek, napojená 1:N na:
                </p>
                <ul className="text-xs font-mono space-y-1 text-slate-800">
                  <li>• Dim_Date[Date] 1 ──► * dataCRM[datum_rezervace]</li>
                  <li>• Dim_Date[Date] 1 ──► * dataAds[WeekGroup]</li>
                  <li>• RokMesicText řazen dle RokMesicKod</li>
                </ul>
              </div>

              <div className="border-2 border-[#1E1E1E] rounded-xl p-4 bg-slate-50">
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  <Layers className="w-4 h-4 text-[#1E1E1E]" />
                  2. Propojení CRM & GA (1:1 Obousměrně)
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Zachovány samostatné tabulky propojené přes rezervační kód:
                </p>
                <ul className="text-xs font-mono space-y-1 text-slate-800">
                  <li>• dataCRM[locator] 1 ◄──► 1 dataGA[customEvent:rezervacni_kod]</li>
                  <li>• crossFilteringBehavior: bothDirections</li>
                  <li>• Umožňuje filtrovat CRM objednávky a letenky podle GA zdrojů</li>
                </ul>
              </div>

              <div className="border-2 border-emerald-500 rounded-xl p-4 bg-emerald-50/20">
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  3. Dim_Campaign (Zamezení M:N)
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Unikátní číselník kampaní sjednocující názvy kampaní z Ads a GA:
                </p>
                <ul className="text-xs font-mono space-y-1 text-slate-800">
                  <li>• Dim_Campaign[sessionCampaignName] 1 ──► * dataAds</li>
                  <li>• Dim_Campaign[sessionCampaignName] 1 ◄──► * dataGA</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'code' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1E1E]">
                    ukol.SemanticModel/definition/tables/_Measures.tmdl
                  </h3>
                  <p className="text-xs text-slate-500">
                    Všechna DAX měřítka uložená přímo v modelu
                  </p>
                </div>
                <button
                  onClick={() => copyCode('measures', TMDL_MEASURES_CODE)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDB913] text-[#1E1E1E] text-xs font-bold cursor-pointer"
                >
                  {copiedBlock === 'measures' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Zkopírováno
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Kopírovat TMDL
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-[#1E1E1E] text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto flex-1">
                {TMDL_MEASURES_CODE}
              </pre>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1E1E]">
                    ukol.SemanticModel/definition/relationships.tmdl
                  </h3>
                  <p className="text-xs text-slate-500">
                    Relace 1:1 dataCRM &lt;-&gt; dataGA, 1:N Dim_Date a Dim_Campaign
                  </p>
                </div>
                <button
                  onClick={() => copyCode('rels', TMDL_RELATIONSHIPS_CODE)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDB913] text-[#1E1E1E] text-xs font-bold cursor-pointer"
                >
                  {copiedBlock === 'rels' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Zkopírováno
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Kopírovat TMDL
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-[#1E1E1E] text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto flex-1">
                {TMDL_RELATIONSHIPS_CODE}
              </pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
