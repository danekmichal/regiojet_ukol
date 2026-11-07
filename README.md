# Marketingový & Obchodní BI Report — Student Agency / RegioJet (`ukol.pbip`)

Tento dokument popisuje architektonická rozhodnutí, datový model, logiku DAX měřítek, řešení datových anomálií v poskytnuté SQLite databázi (`test_db.db`) a přímé odpovědi na všechny úkoly a analytické otázky ze zadání **`testovaci ukol BI.odt`**.

---

## 1. Architektura datového modelu (`ukol.SemanticModel`)

Cílem návrhu modelu bylo zachovat plnou auditovatelnost primárních tabulek ze zdrojové databáze (7 tabulek: `dataCRM`, `dataGA`, `dataAds`, `dataLet`, `dataItiner`, `datadestinace`, `datastav`) a současně zabránit vzniku nejednoznačných relací (*Many-to-Many*), prázdných hodnot `(Blank)` v časových osách a chybného geokódování letišť.

### Klíčová rozhodnutí v datovém modelu (Reasoning):

1. **Samostatné tabulky `dataCRM` a `dataGA` propojené 1:1 (`locator` ↔ `customEvent:rezervacni_kod`)**:
   - **Proč:** Tabulka `dataCRM` obsahuje celkem **3 953 unikátních objednávek** (a **6 491 letenek** v `dataLet`), zatímco tabulka `dataGA` (export událostí z Google Analytics 4) obsahuje pouze **88 spárovaných konverzních relací** s vyplněným rezervačním kódem.
   - Sloučením obou tabulek přes *Inner Join* by došlo ke ztrátě 97,8 % reálných obchodních objednávek z CRM. Naopak ponecháním samostatných tabulek s relací `1:1` (obousměrný filtr) můžeme na jednom místě reportovat jak celkový obchodní výkon z CRM (`3 953 objednávek`), tak atribuovaný marketingový výkon z GA (`88 objednávek`).

2. **Přemosťovací (Bridge) dimenze `Dim_Campaign` mezi `dataGA` a `dataAds`**:
   - **Proč:** Tabulka `dataAds` obsahuje reklamní náklady (`AdsCost`) a prokliky (`AdsClicks`) agregované na úrovni týdnů (`WeekGroup`) a názvů kampaní (`sessionCampaignName`). Tabulka `dataGA` rovněž obsahuje sloupec `sessionCampaignName`, kde se názvy kampaní opakují.
   - Přímé propojení `dataAds[sessionCampaignName] <-> dataGA[sessionCampaignName]` by vytvořilo vazbu **M:N (Many-to-Many)**, která v Power BI zkresluje součty nákladů při filtrování podle kampaně. Vložením unikátní dimenze `Dim_Campaign` vznikly dvě čisté relace `1:N` (`Dim_Campaign` ➔ `dataAds` a `Dim_Campaign` ➔ `dataGA`).

3. **Kalendářní dimenze `Dim_Date` provázaná na `dataCRM[datum_rezervace]` (`1:N`)**:
   - **Proč:** Pro korektní DAX Time Intelligence funkce (`DATEADD`, meziměsíční srovnání MoM) vyžaduje engine VertiPaq souvislou kalendářní tabulku.
   - Protože reálné objednávky v `dataCRM` spadají do období **srpen 2023 až prosinec 2023 (`2023-08` až `2023-12`)**, jsou měřítka a vizuály ošetřeny tak, aby se v grafech a tabulkách nezobrazovaly prázdné měsíce bez rezervací ani hodnota `(Blank)`.

4. **Analýza leteckých tras `Odkud ➔ Kam` v tabulce `dataItiner`**:
   - **Proč:** Tabulka `dataItiner` nese informaci o počátečním letišti (`First id_from`) a cílovém letišti (`Last id_to`) každé letenky, zatímco číselník `datadestinace` je aktivní relací napojen pouze na jeden sloupec.
   - Pomocí DAX funkce `LOOKUPVALUE` byly v `dataItiner` vytvořeny počítané sloupce:
     - `Odkud (Letiště)` — název odletového letiště dle `First id_from`,
     - `Kam (Letiště)` — název příletového letiště dle `Last id_to`,
     - `Letecká trasa (Odkud ➔ Kam)` — složená trasa (např. `Istanbul Airport ➔ Letiště Václava Havla`, `Schiphol ➔ Letiště Václava Havla`, `Letiště Václava Havla ➔ Dubai International`).

5. **Přesné geokódování měst v `datadestinace[Mapa Lokace]` (`dataCategory: City`)**:
   - **Proč:** Číselník `datadestinace[nazev]` obsahuje oficiální názvy letišť pojmenované po osobnostech či regionech (např. `Letiště Václava Havla`, `Pablo Ruiz Picasso`, `Charles De Gaulle`, `Fiumicino`, `Schiphol`, `Suvarnabhumi`, `Ben Gurion`, `Adnan Menderes`), ale také železniční stanice (`Železniční stanice`, `žel. stanice`, `Žel.st. TGV`) a nevalidní záznamy (`0`, `&#...`).
   - Když mapový vizuál v Power BI (Azure Maps) dostane řetězec `"Letiště Václava Havla"` bez země/města, vyhledá foneticky nejbližší obec **Hävla ve Švédsku** a umístí Prahu do Skandinávie. Obdobně u `"Pablo Ruiz Picasso"` nepozná, že jde o **Málagu ve Španělsku**.
   - Proto byl vytvořen počítaný sloupec `Mapa Lokace` s kategorií dat **`City`**, který převádí názvy letišť přímo na **město a stát** (`"Prague, Czechia"`, `"Malaga, Spain"`, `"Paris, France"`, `"Rome, Italy"`, `"Amsterdam, Netherlands"`, `"Bangkok, Thailand"`, `"Vienna, Austria"` atd.) a u ostatních položek ořezává přípony `"Airport"`, `"International"`, `"Intl."`, aby geokodér hledal výhradně město.

---

## 2. Logika DAX měřítek a vysvětlení výpočtů (`_Measures.tmdl`)

Všechna explicitní DAX měřítka jsou uložena v dedikované tabulce `_Measures` a rozdělena do přehledných složek (`displayFolder`):

### A. Proč má u celkového pohledu („All“) meziměsíční změna (MoM) specifickou logiku a jak číst MoM u Konverzního poměru (CR %)
1. **Srovnání posledního aktivního měsíce při výběru všech měsíců (`All`)**:
   - Pokud uživatel v průřezu `Měsíc / Rok` nevybere konkrétní měsíc (je vybráno `All`, tedy všech 5 měsíců `2023-08` až `2023-12`), standardní výraz `CALCULATE([Měřítko], DATEADD('Dim_Date'[Date], -1, MONTH))` posune 5měsíční okno (`srpen–prosinec`) na `červenec–listopad`. Protože v červenci `2023-07` nejsou v databázi žádné objednávky (`0`), porovnával by součet **5 měsíců** (`3 953 objednávek`) se součtem **4 měsíců** (`3 191 objednávek`), což by vytvořilo umělý nárůst `+762 (+23,9 %)` (což je ve skutečnosti jen hodnota prosince `762`).
   - Proto měřítka MoM (`Objednavky PM`, `MoM Trend Indikator`, `MoM Letenky Indikator`, `MoM Kampane Indikator`, `MoM CPA Indikator`, `MoM CR Indikator`) kontrolují `HASONEVALUE('Dim_Date'[RokMesicText])`:
     - Pokud je vybrán **1 konkrétní měsíc** (nebo na řádku měsíční tabulky), porovnává se daný měsíc s předchozím měsícem (`DATEADD(..., -1, MONTH)`).
     - Pokud je vybráno **více měsíců (`All`)**, porovnává se **poslední aktivní měsíc ve výběru (`2023-12`)** s **předchozím aktivním měsícem (`2023-11`)**.

2. **Proč u Konverzního poměru (`CR % = 0,33 %`) mohla dříve svítit změna `+3,9 %` a jak je to nyní zpřehledněno**:
   - Konverzní poměr `CR %` je sám o sobě procentuální veličina (`[Pocet Objednavek (CRM)] / [Kliky Ads] ≈ 0,33 %`).
   - Když se konverzní poměr mezi dvěma obdobími změní například z `0,318 %` na `0,330 %`, pak:
     - **Absolutní změna v procentních bodech (p.b.)** je `+0,01 p.b.` (`0,330 % - 0,318 %`).
     - **Relativní procentuální změna** je `+3,9 %` (`(0,330 - 0,318) / 0,318 = +3,9 %`).
   - Samotný údaj `+3,9 %` pod hodnotou `0,33 %` působí na první pohled matoucím dojmem (vypadá to, jako by CR vyrostlo o 3,9 procentního bodu). Proto měřítko `MoM CR Indikator` nově zobrazuje primárně změnu v **procentních bodech (`p.b.`)** doplněnou o relativní změnu v závorce: např. **`▼ -0,01 p.b. (-3,2 %)`** nebo **`▲ +0,01 p.b. (+3,9 %)`**.

3. **Podmíněné barvy MoM u všech 5 KPI karet**:
   - Každá z 5 KPI karet má vlastní barvové měřítko (`MoM Barva`, `MoM Letenky Barva`, `MoM Kampane Barva`, `MoM CPA Barva`, `MoM CR Barva`):
     - **Zelená (`#10B981`)**: Pozitivní vývoj (růst objednávek, letenek, kampaní a CR %; u nákladového ukazatele **CPA naopak pokles ceny za akvizici** `< 0`).
     - **Červená (`#EF4444`)**: Negativní vývoj (pokles objednávek, letenek, kampaní a CR %; u **CPA nárůst ceny za akvizici** `> 0`).
     - **Oranžová (`#F59E0B`)**: Nulová meziměsíční změna (`0,0 %`).

4. **Boční Insight karty a vysvětlení podílu (Share) v závorce**:
   - U karet **Nejefektivnější zdroj objednávek** a **Nejúspěšnější marketingová kampaň** se podíl v závorce (`%`) počítá vůči všem objednávkám se zaznamenaným zdrojem/kampaní v GA (`88 objednávek`), nikoliv vůči nespárovaným CRM záznamům. Proto např. `(direct)` s `38 objednávkami` ukazuje reálný podíl **`43,2 %`** (místo zkresleného `1,0 %`).
   - Při najetí myší (hover tooltip) na každou z bočních karet se zobrazí český popisek vysvětlující, že **hodnota v závorce udává procentuální podíl (share) na celku**.

---

## 3. Odpovědi na otázky a úkoly ze zadání (`testovaci ukol BI.odt`)

### Základní část zadání:
1. **Filtr podle měsíců objednávky (`[datum_rezervace]`) a podle zdrojů objednávky**:
   - Implementováno v horní liště 1. i 2. stránky jako dropdown průřezy `Měsíc / Rok`, `Zdroj objednávky`, `Médium` a `Stav objednávky`. Průřez `Měsíc / Rok` je odfiltrován pouze na aktivní měsíce s reálnými objednávkami (`2023-08` až `2023-12`).
2. **Tabulka počtu objednávek podle měsíců**:
   - Umístěna v levé spodní části 1. stránky (`Měsíční přehled objednávek, letenek a meziměsíční změny (MoM)`), doplněná o počet prodaných letenek a podmíněně obarvený MoM indikátor.
3. **Kartičky s počtem objednávek a kampaní (spočítané pomocí DAXu)**:
   - Umístěny v horní řadě 5 KPI karet: `Počet objednávek` (`[Pocet Objednavek (CRM)] = 3 953`), `Počet letenek` (`[Pocet Letenek] = 6 491`), `Aktivních kampaní` (`[Pocet Kampani] = 304`), `Průměrná CPA` a `Konverzní poměr (CR)`. U každé karty je nahoře zvýrazněna hlavní hodnota (`18pt`, `#1E1E1E`), pod ní barevný MoM vývoj a vpravo sparkline křivka.
4. **Graf zobrazující TOP 10 nejefektivnějších zdrojů objednávek**:
   - Umístěn ve středním sloupci dole na 1. stránce. Pomocí DAX měřítka `[Pocet Objednavek Zdroje (Top 10)]` automaticky odfiltrovává prázdné `(Blank)` a `(not set)` relace a zobrazuje čistý žebříček 10 nejvýkonnějších zdrojů (`(direct)`, `google`, `seznam`, `studentagency.eu`, `bing`, `dovolena.cz`, `platba.sa.cz` atd.).

---

### Bonusová část zadání a analytické otázky:

#### 1. Prozkoumejte závislost popularity destinací (měst) podle měsíců
- Na 2. stránce reportu (`Destinace, trasy & sezónnost`) je spojnicový graf **Sezónnost a vývoj popularity TOP 5 destinací v čase dle měsíců** řízený DAX měřítkem `[Pocet Letenek (Top 5)]`.
- **Zjištění z dat**:
  - Dominantním uzlem (hubem) v celém datasetu je **Praha (`Letiště Václava Havla`)** s celkem **1 803 letenkami**, která si drží stabilně vysoký objem od srpna (`363`) přes září (`381` – sezónní špička pozdního léta) a listopad (`365`) s mírným poklesem v prosinci (`330`).
  - Mezi nejčastější zahraniční destinace a přestupní uzly patří **Vídeň (`Vienna Intl.`)**, **Istanbul (`Istanbul Airport`)**, **Amsterdam (`Schiphol`)**, **Bangkok (`Suvarnabhumi`)**, **Paříž (`Charles De Gaulle`)** a **Dubaj (`Dubai International`)**.
  - Na podzim a v zimě (listopad–prosinec) roste podíl dálkových a teplých destinací (Dubaj, Bangkok, Doha, Málaga), zatímco v srpnu a září převažují evropské lety.

#### 2. Přidejte filtry stavu objednávky a destinací + mapový vizuál + letecké trasy `Odkud ➔ Kam`
- Na 2. stránce jsou umístěny průřezy `Stav objednávky`, `Letiště` (odfiltrované pouze na aktivní letiště s alespoň 1 prodanou letenkou) a `Měsíc / Rok`.
- **Mapový vizuál** zobrazuje geografickou distribuci prodejů podle vyčištěného sloupce `datadestinace[Mapa Lokace]` (kategorie `City`) s bublinami škálovanými podle `[Pocet Letenek]` a v detailu (tooltipu) ukazuje i nejčastější leteckou trasu daného letiště.
- Vedle mapy je zařazena tabulka **Nejčastější letecké trasy: Odkud ➔ Kam (`dataItiner`)**, která ukazuje přesné směrování cestujících mezi odletovým (`First id_from`) a příletovým (`Last id_to`) letištěm.

#### 3. Spočítejte CR, CPA a další možné marketingové KPI pomocí DAXu. Jaká data Vám chybí pro výpočet většiny z nich?

V modelu jsou spočítána měřítka:
- **`[CPA]` (Cost Per Acquisition / Cena za objednávku)** = `DIVIDE([Naklady Ads], [Pocet Objednavek (CRM)], BLANK())`
- **`[CR %]` (Conversion Rate / Konverzní poměr z prokliků)** = `DIVIDE([Pocet Objednavek (CRM)], [Kliky Ads], BLANK())`
- **`[CPC]` (Cost Per Click / Cena za proklik)** = `DIVIDE([Naklady Ads], [Kliky Ads], BLANK())`

**Jaká data v databázi chybí pro výpočet většiny standardních marketingových KPI ( a proč jsou současné CPA a CR zatíženy datovou limitací ):**

1. **Chybějící tržby (Revenue / Obrat v Kč) a marže v `dataCRM` nebo `dataLet`**:
   - **Které KPI nelze spočítat:** **ROAS** (*Return on Ad Spend* = Tržby / Náklady Ads), **PNO** (*Podíl nákladů na obratu* = Náklady Ads / Tržby), **ROI** (*Return on Investment*), **AOV** (*Average Order Value* / Průměrná hodnota objednávky) a **LTV** (*Customer Lifetime Value*).
   - **Proč:** V tabulkách `dataCRM` ani `dataLet` není uveden sloupec s cenou letenky nebo celkovou částkou objednávky v Kč.

2. **Chybějící počet zobrazení reklamy (`Impressions`) v tabulce `dataAds`**:
   - **Které KPI nelze spočítat:** **CTR** (*Click-Through Rate* / Míra prokliku = `Kliky / Imprese`) a **CPM** (*Cost Per Mille* / Cena za 1 000 zobrazení).
   - **Proč:** Tabulka `dataAds` obsahuje pouze sloupce `AdsCost` (náklady) a `AdsClicks` (kliky), nikoliv `Impressions`.

3. **Chybějící nekonvertující relace (Sessions / Users) v tabulce `dataGA`**:
   - **Které KPI je zkreslené:** Skutečný webový **Session Conversion Rate (`CR %`)** podle zdrojů a organických kanálů.
   - **Proč:** Tabulka `dataGA` obsahuje pouze **88 záznamů**, které již mají přiřazený `rezervacni_kod` (tedy pouze zkonvertované nákupy), ale neobsahuje celkový počet návštěv (sessions) webu pro neplacené zdroje (`organic`, `direct`, `referral`). Proto lze `CR %` v modelu počítat pouze vůči placeným proklikům `[Kliky Ads]` z tabulky `dataAds`.

4. **Odlišná granularita času v `dataAds` (`WeekGroup`) a nízké spárování GA ↔ CRM (88 z 3 953 objednávek)**:
   - **Důsledek:** Náklady v `dataAds` jsou agregovány pouze na týdenní skupiny (`WeekGroup`) a názvy kampaní bez přesného data (`Date`) a bez vazby na `id_rezervace`. Současně má v `dataGA` vyplněný rezervační kód jen 88 objednávek z celkových 3 953 v `dataCRM` (pravděpodobně kvůli odmítnutí analytických cookies / Consent Mode, AdBlockerům nebo telefonickým/pobočkovým rezervacím mimo web).
