import { useMemo, useState } from "react";
import {
  Anchor,
  ArrowUpRight,
  BatteryCharging,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Droplets,
  FileText,
  Gauge,
  Menu,
  PanelLeft,
  Ruler,
  Search,
  ShieldAlert,
  Snowflake,
  Thermometer,
  Users,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";

type SectionId =
  | "overview"
  | "electrical"
  | "hvac"
  | "plumbing"
  | "ancillary"
  | "drawings"
  | "gaps"
  | "crew";

type Icon = typeof Anchor;

type NavItem = {
  id: SectionId;
  label: string;
  eyebrow: string;
  icon: Icon;
  count?: string;
};

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", eyebrow: "Start here", icon: Anchor },
  { id: "electrical", label: "Electrical", eyebrow: "Power plant", icon: Zap },
  { id: "hvac", label: "HVAC", eyebrow: "Comfort systems", icon: Thermometer },
  { id: "plumbing", label: "Plumbing", eyebrow: "Water & waste", icon: Droplets },
  { id: "ancillary", label: "Ancillary", eyebrow: "Cross-system", icon: Boxes },
  { id: "drawings", label: "Drawings", eyebrow: "Design register", icon: Ruler },
  { id: "gaps", label: "Open items", eyebrow: "Needs attention", icon: ShieldAlert, count: "6" },
  { id: "crew", label: "Crew reference", eyebrow: "Run the vessel", icon: Users },
];

const searchIndex: { title: string; detail: string; section: SectionId; tag: string }[] = [
  { title: "Sea chest", detail: "Single point of failure for nine systems; as-built not started.", section: "ancillary", tag: "Cross-system" },
  { title: "Battery labeling rule", detail: 'Use “solid state marine type” in every drawing, schedule, and crew communication. Never “lithium.”', section: "electrical", tag: "Electrical" },
  { title: "48V bow thruster bank", detail: "Isolated 48VDC bank located VIP under-bed; as-built remains open.", section: "electrical", tag: "Electrical" },
  { title: "Webasto chillers", detail: "Two central raw-water-cooled chillers feed a 25% water/glycol hydronic loop.", section: "hvac", tag: "HVAC" },
  { title: "Air handler schedule", detail: "17 fan-coil units across aft deck, owner, bunkroom, salon, helm, crew, and engine room zones.", section: "hvac", tag: "HVAC" },
  { title: "Fresh water loop", detail: "Sea chest → SRC AquaMatic 700-1 → approximately 1,500 gallon tanks → VFD pressure pump → PEX distribution.", section: "plumbing", tag: "Plumbing" },
  { title: "Hamilton jets", detail: "Three units; actuator/control wiring is undocumented and remains a critical launch item.", section: "ancillary", tag: "Ancillary" },
  { title: "SCC-21-140-22", detail: "HVAC arrangement drawing; verify current model and pump nameplates in the field.", section: "drawings", tag: "Drawing" },
  { title: "No bilge system drawing", detail: "MC Marine must produce the as-built from scratch; ABYC H-22 compliance remains open.", section: "gaps", tag: "Critical" },
  { title: "Potable water manual", detail: "In progress; Rev B pending hot-water heater and pump nameplate.", section: "crew", tag: "Crew document" },
];

const systemCards = [
  { id: "electrical" as SectionId, icon: Zap, title: "Electrical", description: "Two independent DC worlds bridged by a four-inverter AC/DC plant.", stat: "24 / 48 VDC", tone: "blue" },
  { id: "hvac" as SectionId, icon: Snowflake, title: "HVAC", description: "Hydronic comfort system serving 17 fan-coil air handlers.", stat: "2 chillers · 17 AH", tone: "teal" },
  { id: "plumbing" as SectionId, icon: Droplets, title: "Plumbing", description: "Sea chest, fresh water, raw water, waste, and fuel interfaces.", stat: "9 sea chest users", tone: "gold" },
  { id: "ancillary" as SectionId, icon: Waves, title: "Ancillary", description: "Propulsion, bow thruster, Seakeeper, windlass, crane, and safety.", stat: "3 Hamilton jets", tone: "plum" },
];

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "critical" | "warning" | "ok" | "neutral" }) {
  return <span className={`status-pill status-${tone}`}><span className="status-dot" />{children}</span>;
}

function SectionHeading({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: Icon }) {
  return (
    <div className="section-heading">
      <div className="section-heading-icon"><Icon size={19} strokeWidth={1.8} /></div>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Metric({ value, label, accent = "navy" }: { value: string; label: string; accent?: string }) {
  return <div className={`metric metric-${accent}`}><strong>{value}</strong><span>{label}</span></div>;
}

function Table({ children }: { children: React.ReactNode }) {
  return <div className="table-wrap"><table>{children}</table></div>;
}

function Home() {
  const [active, setActive] = useState<SectionId>("overview");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeNav = navItems.find((item) => item.id === active) ?? navItems[0];
  const ActiveIcon = activeNav.icon;
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return searchIndex.filter((item) => `${item.title} ${item.detail} ${item.tag}`.toLowerCase().includes(query));
  }, [search]);

  const navigate = (id: SectionId) => {
    setActive(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-block">
          <div className="brand-mark"><Anchor size={21} strokeWidth={1.7} /></div>
          <div><div className="brand-kicker">Owner’s manual</div><div className="brand-name">M/V Sarah B</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="sidebar-rule" />
        <div className="nav-label">Vessel systems</div>
        <nav className="side-nav" aria-label="Vessel systems navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${active === item.id ? "nav-item-active" : ""}`} onClick={() => navigate(item.id)}>
              <span className="nav-icon"><Icon size={17} strokeWidth={1.8} /></span>
              <span className="nav-copy"><strong>{item.label}</strong><small>{item.eyebrow}</small></span>
              {item.count && <span className="nav-count">{item.count}</span>}
              {active === item.id && <ChevronRight className="nav-arrow" size={15} />}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="source-card"><div className="source-card-icon"><BookOpen size={16} /></div><div><strong>Field guide v13</strong><span>Snapshot · 03 Jul 2026</span></div></div>
          <div className="sidebar-footnote">Designed for the people who care for, maintain, and run Sarah B.</div>
        </div>
      </aside>

      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="crumb"><span>Sarah B</span><ChevronRight size={13} /><strong>{activeNav.label}</strong></div></div>
          <div className="topbar-actions"><div className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the manual…" aria-label="Search the manual" />{search && <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}</div><div className="revision"><span>REV</span><strong>13</strong></div></div>
        </header>

        <div className="mobile-nav-scroll">{navItems.map((item) => <button key={item.id} className={active === item.id ? "mobile-nav-active" : ""} onClick={() => navigate(item.id)}>{item.label}</button>)}</div>

        <div className="content-wrap">
          {search && <section className="search-results-card"><div className="search-results-head"><div><div className="eyebrow">Manual search</div><h2>{searchResults.length ? `${searchResults.length} result${searchResults.length === 1 ? "" : "s"}` : "No matches"}</h2></div><button className="text-button" onClick={() => setSearch("")}>Clear search <X size={14} /></button></div>{searchResults.length ? <div className="search-results-grid">{searchResults.map((result) => <button key={`${result.section}-${result.title}`} className="search-result" onClick={() => { navigate(result.section); setSearch(""); }}><div className="result-top"><span>{result.tag}</span><ArrowUpRight size={15} /></div><strong>{result.title}</strong><p>{result.detail}</p></button>)}</div> : <p className="empty-search">Try a system name, component, drawing number, or open item.</p>}</section>}

          {active === "overview" && <Overview navigate={navigate} />}
          {active === "electrical" && <Electrical />}
          {active === "hvac" && <HVAC />}
          {active === "plumbing" && <Plumbing />}
          {active === "ancillary" && <Ancillary />}
          {active === "drawings" && <Drawings />}
          {active === "gaps" && <Gaps />}
          {active === "crew" && <Crew />}

          <footer className="site-footer"><div className="footer-line" /><div className="footer-brand"><Anchor size={15} /> <strong>The Gulf Coast Sailor LLC</strong></div><p>M/V Sarah B · Virtual owner’s manual · Knowledge base v13 · Published July 2026</p><p className="footer-note">Field information should be verified against installed condition before maintenance, commissioning, or operation.</p></footer>
        </div>
      </main>
    </div>
  );
}

function Overview({ navigate }: { navigate: (id: SectionId) => void }) {
  return <>
    <section className="hero-panel">
      <div className="hero-copy"><div className="eyebrow hero-eyebrow">A working knowledge base</div><h1>Know the boat.<br /><em>Run it with confidence.</em></h1><p>A living owner’s manual for M/V Sarah B — organized around the systems, interfaces, and decisions that matter onboard.</p><div className="hero-actions"><button className="primary-button" onClick={() => navigate("crew")}>Open crew reference <ArrowUpRight size={16} /></button><button className="secondary-button" onClick={() => navigate("gaps")}>Review open items <ShieldAlert size={15} /></button></div></div>
      <div className="hero-visual"><div className="ring ring-one" /><div className="ring ring-two" /><div className="hero-compass"><Anchor size={52} strokeWidth={1.1} /><span>MSB</span></div><div className="coordinate coord-one">28° 05′ N</div><div className="coordinate coord-two">082° 27′ W</div><div className="hero-stamp">FIELD<br /><strong>GUIDE</strong></div></div>
      <div className="hero-meta"><span><CircleDot size={13} /> Snapshot date</span><strong>03 July 2026</strong><span><Gauge size={13} /> Knowledge base</span><strong>v13 · active</strong></div>
    </section>

    <section className="metrics-row"><Metric value="99" label="Drawing PDFs" /><Metric value="33" label="Drawing numbers" accent="gold" /><Metric value="17" label="Air handlers" accent="teal" /><Metric value="6" label="Critical gaps" accent="red" /></section>

    <section className="section-block"><div className="block-heading"><div><div className="eyebrow">System map</div><h2>Everything aboard is connected</h2></div><p>Use the manual by system, then follow the interfaces between them.</p></div><div className="system-grid">{systemCards.map((card) => { const Icon = card.icon; return <button key={card.id} className={`system-card card-${card.tone}`} onClick={() => navigate(card.id)}><div className="system-card-top"><span className="system-icon"><Icon size={20} strokeWidth={1.7} /></span><ArrowUpRight size={16} /></div><h3>{card.title}</h3><p>{card.description}</p><span className="system-stat">{card.stat}</span></button>; })}</div></section>

    <section className="split-grid"><div className="insight-card dark-card"><div className="eyebrow">The naval architect’s read</div><h2>Five ideas explain how Sarah B works.</h2><ol className="insight-list"><li><span>01</span><div><strong>The sea chest is the single point of failure</strong><p>Nine systems depend on it, from chillers to watermaker and deckwash.</p></div></li><li><span>02</span><div><strong>Propulsion has no conventional steering</strong><p>Three Hamilton jets use actuators and reverse buckets instead of a shaft-and-rudder system.</p></div></li><li><span>03</span><div><strong>Two independent electrical worlds</strong><p>24VDC house power and an isolated 48VDC bow-thruster bank share one labeling rule.</p></div></li></ol><button className="dark-link" onClick={() => navigate("ancillary")}>Read the system interfaces <ArrowUpRight size={15} /></button></div><div className="snapshot-card"><div className="eyebrow">Current field context</div><h2>Where the project stands</h2><div className="snapshot-row"><StatusPill tone="ok">On track</StatusPill><span>Cathodic protection Stages 1–2 complete.</span></div><div className="snapshot-row"><StatusPill tone="warning">In progress</StatusPill><span>Midship air handlers placed and piped starboard; port side continues.</span></div><div className="snapshot-row"><StatusPill tone="critical">Critical path</StatusPill><span>House AC/DC panel submittal is the Gate 2 item.</span></div><div className="snapshot-footer"><span>Original design intent</span><strong>Verify installed condition</strong></div></div></section>
  </>;
}

function Electrical() {
  return <><SectionHeading eyebrow="System 01 · Power plant" title="Electrical" description="Two independent DC worlds, a split-phase AC backbone, and four field-confirmed Victron inverters." icon={Zap} /><div className="callout callout-gold"><strong>Standing rule · label it correctly</strong><p>Every battery system — the 24VDC house bank and the isolated 48VDC bow-thruster bank alike — is labeled <b>“solid state marine type.”</b> Never use “lithium” in a drawing, schedule, or crew communication.</p></div><div className="three-col"><div className="info-card"><div className="card-icon blue"><Zap size={18} /></div><div className="eyebrow">AC backbone</div><h3>Split-phase house power</h3><p>Two 240VAC shore inlets and two Northern Lights 30kW generators feed a transfer switch and two 175A main panels.</p><div className="mini-list"><span>SPR-1 / SPR-2 inlets</span><span>AC-MAIN-1 / AC-MAIN-2</span><span>HP-1-SP · HP-2-SP</span></div></div><div className="info-card"><div className="card-icon teal"><BatteryCharging size={18} /></div><div className="eyebrow">DC plant</div><h3>24V house + 48V thruster</h3><p>Four Victron Quattro 48|10000|140-100/100 inverters bridge the AC and DC plant from the starboard ER forward bulkhead.</p><div className="mini-list"><span>24VDC throughout</span><span>48VDC bow-thruster bank</span><span>ER-BAT control</span></div></div><div className="info-card"><div className="card-icon gold"><Gauge size={18} /></div><div className="eyebrow">Field confirmation</div><h3>Panel register</h3><p>Four panels are field-confirmed; ER-SP-DC location still carries an annotation that must be resolved.</p><div className="mini-list"><span>PA-SP-1 · PA-SP-2</span><span>ER-SP-DC · ER-AUX-DC</span><span>Sync pending</span></div></div></div><section className="content-card"><div className="card-heading"><div><div className="eyebrow">Reference</div><h2>Key electrical systems</h2></div><StatusPill tone="warning">Field verification active</StatusPill></div><Table><thead><tr><th>System</th><th>Detail</th><th>Status</th></tr></thead><tbody><tr><td>Bow thruster · VETUS BOWB320</td><td>48VDC · 3/0–4/0 AWG · 400–450A ANL fuse · BATSW600</td><td><StatusPill tone="critical">As-built open</StatusPill></td></tr><tr><td>Windlass · Maxwell AutoAnchor 560 V2</td><td>24VDC, all-chain rode</td><td><StatusPill tone="warning">Circuit ID open</StatusPill></td></tr><tr><td>Davit crane · Steelhead ES2200/ES2500</td><td>24VDC, 208A peak</td><td><StatusPill tone="ok">Approved / procurement</StatusPill></td></tr><tr><td>Underwater lights</td><td>UW-LTE port / starboard / forward · 14 controllers</td><td><StatusPill tone="warning">Midship in progress</StatusPill></td></tr><tr><td>ARCO Zeus A8000-48V</td><td>External-regulator-only · up to 9,630W · Bluetooth regulator required</td><td><StatusPill tone="warning">Procurement</StatusPill></td></tr></tbody></Table></section></>;
}

function HVAC() {
  return <><SectionHeading eyebrow="System 02 · Comfort systems" title="HVAC" description="A hydronic chilled/heated water system: two central Webasto chillers circulate 25% water/glycol to 17 fan-coil air handlers." icon={Thermometer} /><div className="callout callout-blue"><strong>How to troubleshoot comfort complaints</strong><p>Air handlers carry no refrigerant. A comfort complaint at the point of use is a hydronic flow, control, air-handler, or condensate issue — not a refrigerant issue.</p></div><div className="architecture-strip"><div className="architecture-step"><span>01</span><strong>Sea chest</strong><small>Raw-water cooling source</small></div><ChevronRight /><div className="architecture-step"><span>02</span><strong>Webasto ×2</strong><small>Central chillers in ER</small></div><ChevronRight /><div className="architecture-step"><span>03</span><strong>25% glycol loop</strong><small>5 bar(g) pressure rating</small></div><ChevronRight /><div className="architecture-step"><span>04</span><strong>17 air handlers</strong><small>Hydronic fan-coil units</small></div></div><div className="three-col"><div className="info-card"><div className="card-icon teal"><Snowflake size={18} /></div><div className="eyebrow">Chiller model</div><h3>Webasto C1080 × 2</h3><p>Source drawing SCC-21-140-22 states C1080. Field documentation says C1085; the nameplate should govern.</p></div><div className="info-card"><div className="card-icon blue"><Wind size={18} /></div><div className="eyebrow">Raw-water pump</div><h3>74 GPM each</h3><p>Source drawing states Webasto W63500. Field documentation says MB2020; verify the installed nameplate.</p></div><div className="info-card"><div className="card-icon gold"><CircleDot size={18} /></div><div className="eyebrow">Confirmed crossover</div><h3>ER air handlers · Slimline A18</h3><p>Both engine-room air handlers are confirmed Webasto Slimline A18, closing the v13 “TBC” model gap.</p></div></div><section className="content-card"><div className="card-heading"><div><div className="eyebrow">17-unit schedule</div><h2>Air handler zones</h2></div><span className="card-note">4 of 17 not yet photographed</span></div><Table><thead><tr><th>Tag</th><th>Zone / deck</th><th>Model</th><th>Count</th></tr></thead><tbody><tr><td>AH-AD-1 to -4</td><td>Aft Deck · Aft Deck</td><td>A12 Compact-230V</td><td>4</td></tr><tr><td>AH-OW-1 to -3</td><td>Owner’s Stateroom · Lower</td><td>A12 Compact-230V</td><td>3</td></tr><tr><td>AH-BKP-1, -2</td><td>Bunkroom Port · Lower</td><td>A9 Compact-230V</td><td>2</td></tr><tr><td>AH-BKS-1, -2</td><td>Bunkroom Starboard · Lower</td><td>A9 Compact-230V</td><td>2</td></tr><tr><td>AH-SAL-1 to -3</td><td>Salon · Main</td><td>A12 Compact-230V</td><td>3</td></tr><tr><td>AH-ER-1, -2</td><td>Engine Room · ER</td><td>Webasto Slimline A18</td><td>2</td></tr><tr><td>AH-HLM-1</td><td>Helm · Main</td><td>Field verify</td><td>1</td></tr></tbody></Table></section></>;
}

function Plumbing() {
  return <><SectionHeading eyebrow="System 03 · Water, waste & fuel" title="Plumbing" description="The vessel’s water systems begin at the sea chest and branch into cooling, potable, waste, fuel, and deck-service systems." icon={Droplets} /><div className="callout callout-gold"><strong>The sea chest is the single point of failure for nine systems</strong><p>Its raw-water supply supports the main engines, generators, HVAC chillers, MSD, watermaker, live well and deckwash, and icemaker. Keep the sea chest, strainers, and downstream shutoffs in the crew’s first-response mental model.</p></div><div className="flow-card"><div className="flow-title"><span className="card-icon blue"><Waves size={18} /></span><div><div className="eyebrow">Fresh-water loop</div><h2>From source to point of use</h2></div></div><div className="flow-line"><span>Sea chest</span><ChevronRight /><span>SRC AquaMatic 700-1</span><ChevronRight /><span>FW tanks<br /><small>≈ 1,500 gal total</small></span><ChevronRight /><span>VFD pressure pump<br /><small>tuned Jun 15 ✓</small></span><ChevronRight /><span>PEX distribution</span></div><div className="flow-footer"><CheckCircle2 size={15} /> PEX pressure test passed June 9, 2026</div></div><div className="three-col"><div className="info-card"><div className="eyebrow">Waste</div><h3>Headhunter MSD</h3><p>208–230V / 80A, raw water via SCC-25, blackwater via SCC-18.</p><span className="text-link">See SCC-21-140-25 <ArrowUpRight size={14} /></span></div><div className="info-card"><div className="eyebrow">Fuel</div><h3>Four design drawings</h3><p>SCC-14 to -17 are not yet integrated into any as-built. Fuel sender circuits remain undocumented.</p><span className="text-link">See open items <ArrowUpRight size={14} /></span></div><div className="info-card"><div className="eyebrow">Bilge</div><h3>As-built from scratch</h3><p>No bilge system drawing exists in the 33-number design set. MC Marine must produce it to ABYC H-22.</p><span className="text-link">Critical gap <ArrowUpRight size={14} /></span></div></div><section className="content-card"><div className="card-heading"><div><div className="eyebrow">Interface register</div><h2>Raw-water consumers</h2></div><span className="card-note">9 sea chest branches</span></div><Table><thead><tr><th>Consumer</th><th>Supply / detail</th><th>Drawing</th></tr></thead><tbody><tr><td>Main engines ×3</td><td>3 in branch · Caterpillar</td><td>SCC-21-140-21</td></tr><tr><td>Generators ×2</td><td>Dedicated 220V/5A · 10–14 GPM</td><td>Source set</td></tr><tr><td>HVAC chillers</td><td>74 GPM each · raw-water cooled</td><td>SCC-21-140-22</td></tr><tr><td>Headhunter MSD</td><td>1 in · dedicated 220V/5A · 4 GPM min</td><td>SCC-21-140-25</td></tr><tr><td>Watermaker</td><td>3/4 in nylon · 120VAC booster pump</td><td>SCC-21-140-26</td></tr><tr><td>Live well & deckwash</td><td>3/4 in · dedicated 220V/5A each</td><td>SCC-21-140-27</td></tr><tr><td>Icemaker</td><td>3/4 in · routing TBC</td><td>SCC-21-140-28</td></tr></tbody></Table></section></>;
}

function Ancillary() {
  return <><SectionHeading eyebrow="System 04 · Cross-system equipment" title="Ancillary systems" description="These systems cross electrical, HVAC, and plumbing boundaries. They are the places where a gap can fall between projects." icon={Boxes} /><div className="interface-banner"><div className="interface-banner-icon"><PanelLeft size={23} /></div><div><div className="eyebrow">Why this tab matters</div><h2>The engine room is the convergence point for all three trades.</h2><p>Trace each piece of equipment across its power, fluid, control, and access requirements before closing a wall or cabin.</p></div></div><section className="content-card"><div className="card-heading"><div><div className="eyebrow">Cross-system register</div><h2>Equipment at the interfaces</h2></div></div><Table><thead><tr><th>System</th><th>Touches</th><th>Status</th></tr></thead><tbody><tr><td>Sea chest</td><td>Electrical pump power · HVAC chiller cooling · Plumbing with 9 consumers</td><td><StatusPill tone="critical">As-built not started</StatusPill></td></tr><tr><td>Bow thruster · VETUS BOWB320</td><td>48VDC bank · tunnel at frames 25–27</td><td><StatusPill tone="critical">VIP closeout</StatusPill></td></tr><tr><td>Hamilton jets ×3</td><td>Actuators, helm controls · hull penetrations</td><td><StatusPill tone="critical">Wiring undocumented</StatusPill></td></tr><tr><td>Seakeeper 35</td><td>230VAC high-draw · 12V battery · raw water</td><td><StatusPill tone="warning">12V circuit open</StatusPill></td></tr><tr><td>Windlass · Maxwell 560 V2</td><td>Electrical only</td><td><StatusPill tone="ok">Manual complete</StatusPill></td></tr><tr><td>Davit crane · Steelhead</td><td>24VDC / 208A · drip-tray drain</td><td><StatusPill tone="warning">Drain TBD</StatusPill></td></tr><tr><td>Fire suppression</td><td>All three trades · cable path</td><td><StatusPill tone="neutral">Deferred</StatusPill></td></tr><tr><td>Systems & network cable paths</td><td>NMEA, WiFi, entertainment, ER-to-helm/hardtop, fire suppression</td><td><StatusPill tone="critical">G-NEW</StatusPill></td></tr></tbody></Table></section><div className="quote-card"><span className="quote-mark">“</span><blockquote>These are not separate systems when you are standing in the engine room. They are one operating environment.</blockquote><cite>Sarah B field guide · cross-system principle</cite></div></>;
}

function Drawings() {
  const drawings = [
    ["SCC-21-140-01", "General Arrangement", "2", "2022", "Structure / GA"],
    ["SCC-21-140-07", "Engine Room Arrangement", "4", "2022", "ER Layout"],
    ["SCC-21-140-09", "Electrical / Systems Arrangement", "10", "2022", "Electrical"],
    ["SCC-21-140-10", "Electrical / One-Line Diagram", "5 · Rev A", "2022", "Electrical"],
    ["SCC-21-140-11", "Electrical Panel Schedule", "1", "2022", "Electrical"],
    ["SCC-21-140-12", "Electronics & Navigation", "7+", "2022", "Electrical"],
    ["SCC-21-140-18", "Potable Water System", "3", "2023", "Plumbing"],
    ["SCC-21-140-19", "Grey Water System", "3", "2023", "Plumbing"],
    ["SCC-21-140-21", "Main Engine Raw Water", "2", "2023", "Plumbing"],
    ["SCC-21-140-22", "HVAC System", "3", "2023", "HVAC"],
    ["SCC-21-140-25", "MSD Raw Water / Blackwater", "2", "2023", "Plumbing"],
    ["SCC-21-140-26", "Watermaker Seawater Supply", "2", "2023", "Plumbing"],
    ["SCC-21-140-27", "Live Well & Deckwash", "2", "2023", "Plumbing"],
    ["SCC-21-140-28", "Icemaker Seawater Supply", "2", "2023", "Plumbing"],
    ["SCC-21-140-33", "Bulwark Details", "2 · Rev A", "2024", "Structure"],
  ];
  return <><SectionHeading eyebrow="System 06 · Design register" title="Drawings" description="The original SCC Marine design set is the map. The installed vessel is the territory — always confirm revision and field condition." icon={Ruler} /><div className="callout callout-blue"><strong>99 PDFs · 33 drawing numbers</strong><p>All sheets are raster/image-only and follow the file pattern <code>SCC21140NN_Sht_N.pdf</code>. Drawing 029 was searched and confirmed not to exist; Gap G-1 is closed.</p></div><div className="drawing-note"><FileText size={18} /><div><strong>Revision rule</strong><span>Rev C of SCC-21-140-20 is the only current revision. It supersedes Rev A and Rev B. Confirm the rev letter before using a sea chest drawing as reference.</span></div></div><section className="content-card"><div className="card-heading"><div><div className="eyebrow">SCC-21-140 series</div><h2>Drawing register</h2></div><span className="card-note">Showing 15 of 33 numbers</span></div><Table><thead><tr><th>Drawing #</th><th>Title</th><th>Sheets</th><th>Date</th><th>Category</th></tr></thead><tbody>{drawings.map((drawing) => <tr key={drawing[0]}><td><code>{drawing[0]}</code></td><td>{drawing[1]}</td><td>{drawing[2]}</td><td>{drawing[3]}</td><td>{drawing[4]}</td></tr>)}</tbody></Table><div className="table-footnote">Design intent only · annotate with as-installed changes wherever the design did not materially change.</div></section></>;
}

function Gaps() {
  return <><SectionHeading eyebrow="System 07 · Needs attention" title="Open items" description="A short list of decisions and field confirmations that protect launch, closeout, and future crew safety." icon={ShieldAlert} /><div className="gap-summary"><div className="gap-summary-main"><span className="eyebrow">Critical / open</span><strong>6</strong><p>Confirmed open items from the current gap register.</p></div><div className="gap-summary-side"><div><strong>7</strong><span>High-priority items</span></div><div><strong>3</strong><span>Facts to fold in</span></div><div><strong>1</strong><span>Deferred system</span></div></div></div><section className="content-card"><div className="card-heading"><div><div className="eyebrow red-eyebrow">Launch / closeout</div><h2>Critical gaps</h2></div><StatusPill tone="critical">Resolve before closeout</StatusPill></div><div className="gap-list"><GapItem title="Bow thruster as-built" detail="48VDC system location is confirmed VIP under-bed; as-built, takeoff entry, cable path, fuse, and switch remain undocumented before the VIP cabin closes." /><GapItem title="No bilge system drawing" detail="Not in the 33-number design set. MC Marine must produce from scratch and bring the as-built to ABYC H-22." /><GapItem title="Hamilton jet electrical / control wiring" detail="Three steering-nozzle actuators, three reverse buckets, and helm control wiring remain undocumented for Phase 1 launch." /><GapItem title="Engine raw-water drawing may assume two engines" detail="SCC-21-140-21 predates three-engine confirmation. Verify branch layout against installed piping." /><GapItem title="Temporary AC power source for splash" detail="Unconfirmed. Coordinate with Andrew before splash planning." /><GapItem title="Systems & network cable paths · G-NEW" detail="Lock NMEA, high-speed data, proprietary, fire-suppression, WiFi, entertainment, and ER-to-helm / hardtop paths before outfitters close remaining walls." /></div></section><section className="content-card"><div className="card-heading"><div><div className="eyebrow gold-eyebrow">Field verification</div><h2>High-priority items</h2></div></div><Table><thead><tr><th>Item</th><th>What needs to happen</th></tr></thead><tbody><tr><td>HVAC chiller pump model</td><td>Resolve MB2020 vs. W63500 from the installed nameplate.</td></tr><tr><td>HVAC condensate drainage</td><td>Decide whether routing is to bilge or overboard.</td></tr><tr><td>HVAC serial numbers</td><td>Photograph the remaining 8 of 17 units.</td></tr><tr><td>Windlass circuit ID</td><td>Confirm panel and circuit assignment in the electrical takeoff.</td></tr><tr><td>Seacock audit · ABYC T-9</td><td>Confirm every below-waterline thru-hull.</td></tr><tr><td>Fuel system as-built</td><td>Integrate SCC-14 to -17 into the as-built set.</td></tr><tr><td>Lift station count</td><td>Resolve takeoff ×4 versus grey-water drawing ×2 discrepancy.</td></tr></tbody></Table></section><div className="deferred-card"><div className="deferred-icon"><ClipboardCheck size={18} /></div><div><div className="eyebrow">Deferred</div><h3>Fire suppression control system</h3><p>Deferred until engines run and post-commissioning. Cable paths are not deferred; they remain part of G-NEW.</p></div></div></>;
}

function GapItem({ title, detail }: { title: string; detail: string }) {
  return <div className="gap-item"><div className="gap-marker"><ShieldAlert size={15} /></div><div><h3>{title}</h3><p>{detail}</p></div><ArrowUpRight size={15} /></div>;
}

function Crew() {
  const categories = [
    [Zap, "Electrical", "Panel photos, label strips, inverter configuration, battery bank layout", "Photos & manuals"],
    [Thermometer, "HVAC", "Chiller nameplates, air-handler zone map, control system guide", "Photos & manuals"],
    [Droplets, "Plumbing", "Sea chest, potable manual, MSD / watermaker operation", "Photos & manuals"],
    [Boxes, "Propulsion & ancillary", "Hamilton jet controls, bow thruster, Seakeeper, windlass, davit crane", "Reference"],
    [ClipboardCheck, "Commissioning", "Pressure tests, sea trials, systems start-up sequences", "Checklists"],
    [ShieldAlert, "Emergency & safety", "Fire suppression, bilge, seacocks, and shutoffs", "Safety"],
  ] as const;
  return <><SectionHeading eyebrow="System 08 · Run the vessel" title="Crew reference" description="The finished vessel lives here: a quick, practical reference for the people who operate, maintain, and hand over Sarah B." icon={Users} /><div className="crew-callout"><div className="crew-callout-icon"><Users size={20} /></div><div><strong>Built for the next person onboard.</strong><p>Use the system tabs to understand how things connect; use this page to find the photos, manuals, checklists, and start-up sequences that make operation repeatable.</p></div></div><div className="crew-grid">{categories.map(([Icon, title, detail, label]) => <div className="crew-card" key={title}><div className="crew-card-head"><span className="card-icon blue"><Icon size={18} /></span><span className="card-note">{label}</span></div><h3>{title}</h3><p>{detail}</p><button className="text-button">Open reference <ArrowUpRight size={14} /></button></div>)}</div><section className="content-card"><div className="card-heading"><div><div className="eyebrow">Document status</div><h2>Existing owner / crew documents</h2></div><span className="card-note">Source register</span></div><Table><thead><tr><th>Document</th><th>Status</th></tr></thead><tbody><tr><td>Bow Thruster Report (DOCX)</td><td><StatusPill tone="ok">Complete</StatusPill></td></tr><tr><td>Windlass Manual · Maxwell AutoAnchor 560 V2</td><td><StatusPill tone="ok">Complete</StatusPill></td></tr><tr><td>Potable Water Owner / Crew Manual</td><td><StatusPill tone="warning">Rev B pending nameplates</StatusPill></td></tr><tr><td>Potable Water Install Checklist (DOCX)</td><td><StatusPill tone="ok">Rev A complete</StatusPill></td></tr><tr><td>HVAC / Electrical / Bilge / Fire Suppression manuals</td><td><StatusPill tone="critical">Not started</StatusPill></td></tr></tbody></Table></section></>;
}

export default Home;
