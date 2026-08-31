import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

const EXECUTIVES = ["Abhishek", "Rudransh", "Lakshya"];

const INITIAL_LEADS = [
  {
    id: 1,
    name: "Dhriti Bhutra",
    phone: "7027179939",
    source: "Instagram",
    executive: "Abhishek",
    status: "Interested",
    date: "31-Aug-2026",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    phone: "9876543210",
    source: "Website",
    executive: "Rudransh",
    status: "Follow Up",
    date: "31-Aug-2026",
  },
  {
    id: 3,
    name: "Priya Singh",
    phone: "9988776655",
    source: "Facebook",
    executive: "Lakshya",
    status: "New",
    date: "31-Aug-2026",
  },
];

const INITIAL_SALES = [
  {
    id: 1,
    client: "Dhriti Bhutra",
    executive: "Abhishek",
    package: "3 Months",
    amount: 7500,
    status: "Paid",
    date: "31-Aug-2026",
  },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const [activePage, setActivePage] = useState("Dashboard");

  const [leads, setLeads] = useState(INITIAL_LEADS);

  const [sales, setSales] = useState(INITIAL_SALES);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [executiveFilter, setExecutiveFilter] =
    useState("All");

  const [notice, setNotice] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = useMemo(() => {
    return {
      total: leads.length,

      new: leads.filter(
        (lead) => lead.status === "New"
      ).length,

      interested: leads.filter(
        (lead) => lead.status === "Interested"
      ).length,

      followUp: leads.filter(
        (lead) => lead.status === "Follow Up"
      ).length,

      converted: leads.filter(
        (lead) => lead.status === "Converted"
      ).length,

      notInterested: leads.filter(
        (lead) => lead.status === "Not Interested"
      ).length,

      dnp: leads.filter(
        (lead) => lead.status === "DNP"
      ).length,
    };
  }, [leads]);

  const revenue = useMemo(() => {
    return sales.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );
  }, [sales]);

  function showNotice(message) {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  }

  function handleLogin() {
    setLoggedIn(true);
    setActivePage("Dashboard");
  }

  function logout() {
    setLoggedIn(false);
  }

  function assignLead(leadId, executive) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              executive,
            }
          : lead
      )
    );

    showNotice("Lead assigned successfully");
  }

  function updateLeadStatus(leadId, status) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status,
            }
          : lead
      )
    );

    showNotice("Lead status updated");
  }

  function importExcel(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(
          e.target.result
        );

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const rows = XLSX.utils.sheet_to_json(
          sheet
        );

        if (!rows.length) {
          showNotice("Excel file is empty");
          return;
        }

        const imported = rows.map(
          (row, index) => ({
            id:
              Date.now() +
              index,

            name:
              row.Name ||
              row.name ||
              row.Client ||
              row.client ||
              "Unknown",

            phone:
              String(
                row.Phone ||
                  row.phone ||
                  row.Contact ||
                  row.contact ||
                  ""
              ),

            source:
              row.Source ||
              row.source ||
              "Excel",

            executive:
              EXECUTIVES[
                index % EXECUTIVES.length
              ],

            status: "New",

            date: new Date()
              .toLocaleDateString(
                "en-GB"
              )
              .replaceAll("/", "-"),
          })
        );

        setLeads((current) => [
          ...current,
          ...imported,
        ]);

        showNotice(
          `${imported.length} leads imported successfully`
        );
      } catch (error) {
        console.error(error);
        showNotice(
          "Excel import failed"
        );
      }
    };

    reader.readAsArrayBuffer(file);

    event.target.value = "";
  }

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? ""
            : "sidebar-collapsed"
        }`}
      >

        <div className="brand">

          <div className="brand-logo">
            F
          </div>

          {sidebarOpen && (
            <div>
              <div className="brand-name">
                FIDDLEFITTLIFE
              </div>

              <div className="brand-sub">
                CRM SYSTEM
              </div>
            </div>
          )}

        </div>

        <div className="menu-title">
          MAIN MENU
        </div>

        <nav className="navigation">

          <NavItem
            icon="▦"
            label="Dashboard"
            active={
              activePage ===
              "Dashboard"
            }
            collapsed={!sidebarOpen}
            onClick={() =>
              setActivePage("Dashboard")
            }
          />

          <NavItem
            icon="♟"
            label="Leads"
            active={
              activePage === "Leads"
            }
            collapsed={!sidebarOpen}
            onClick={() =>
              setActivePage("Leads")
            }
          />

          <NavItem
            icon="☎"
            label="Calling"
            active={
              activePage === "Calling"
            }
            collapsed={!sidebarOpen}
            onClick={() =>
              setActivePage("Calling")
            }
          />

          <NavItem
            icon="₹"
            label="Sales"
            active={
              activePage === "Sales"
            }
            collapsed={!sidebarOpen}
            onClick={() =>
              setActivePage("Sales")
            }
          />

          <NavItem
            icon="▤"
            label="Reports"
            active={
              activePage === "Reports"
            }
            collapsed={!sidebarOpen}
            onClick={() =>
              setActivePage("Reports")
            }
          />

          <NavItem
            icon="♙"
            label="Team"
            active={
              activePage === "Team"
            }
            collapsed={!sidebarOpen}
            onClick={() =>
              setActivePage("Team")
            }
          />

        </nav>

        <div className="sidebar-bottom">

          <NavItem
            icon="⚙"
            label="Settings"
            active={
              activePage === "Settings"
            }
            collapsed={!sidebarOpen}
            onClick={() =>
              setActivePage("Settings")
            }
          />

          <button
            className="logout-button"
            onClick={logout}
          >
            <span>↪</span>

            {sidebarOpen && (
              <span>Logout</span>
            )}
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main
        className={`main ${
          sidebarOpen
            ? ""
            : "main-expanded"
        }`}
      >

        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="menu-toggle"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            ☰
          </button>

          <div className="breadcrumb">
            FIDDLEFITTLIFE
            <span>/</span>
            {activePage}
          </div>

          <div className="top-actions">

            <button className="notification">
              🔔
              <span />
            </button>

            <div className="profile">

              <div className="profile-avatar">
                A
              </div>

              <div className="profile-text">

                <strong>
                  Admin
                </strong>

                <small>
                  Administrator
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <section className="content">

          {notice && (
            <div className="toast">
              ✓ {notice}
            </div>
          )}

          {activePage ===
            "Dashboard" && (
            <Dashboard
              leads={leads}
              stats={stats}
              sales={sales}
              revenue={revenue}
              setActivePage={
                setActivePage
              }
            />
          )}

          {activePage ===
            "Leads" && (
            <LeadsPage
              leads={leads}
              search={search}
              setSearch={setSearch}
              statusFilter={
                statusFilter
              }
              setStatusFilter={
                setStatusFilter
              }
              executiveFilter={
                executiveFilter
              }
              setExecutiveFilter={
                setExecutiveFilter
              }
              assignLead={assignLead}
              updateLeadStatus={
                updateLeadStatus
              }
              importExcel={
                importExcel
              }
            />
          )}

          {activePage ===
            "Calling" && (
            <CallingPage
              leads={leads}
              updateLeadStatus={
                updateLeadStatus
              }
            />
          )}

          {activePage ===
            "Sales" && (
            <SalesPage
              sales={sales}
              revenue={revenue}
            />
          )}

          {activePage ===
            "Reports" && (
            <ReportsPage
              leads={leads}
              sales={sales}
              stats={stats}
              revenue={revenue}
            />
          )}

          {activePage ===
            "Team" && (
            <TeamPage
              leads={leads}
              sales={sales}
            />
          )}

          {activePage ===
            "Settings" && (
            <SettingsPage />
          )}

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   LOGIN
===================================================== */

function LoginPage({ onLogin }) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  function submit(e) {
    e.preventDefault();

    onLogin();
  }

  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">

          <div className="login-logo">
            F
          </div>

          <div>
            <strong>
              FIDDLEFITTLIFE
            </strong>

            <span>
              CRM SYSTEM
            </span>
          </div>

        </div>

        <div className="login-content">

          <span className="login-tag">
            BUSINESS MANAGEMENT
          </span>

          <h1>
            Manage your business
            <br />
            <span>smarter.</span>
          </h1>

          <p>
            One centralized workspace for
            leads, calling, sales and
            performance reporting.
          </p>

          <div className="login-features">

            <Feature
              icon="👥"
              title="Lead Management"
            />

            <Feature
              icon="☎"
              title="Calling Operations"
            />

            <Feature
              icon="₹"
              title="Sales Tracking"
            />

            <Feature
              icon="📊"
              title="Performance Reports"
            />

          </div>

        </div>

      </div>


      <div className="login-right">

        <form
          className="login-box"
          onSubmit={submit}
        >

          <div className="mobile-login-logo">
            F
          </div>

          <h2>
            Welcome back
          </h2>

          <p>
            Sign in to access your CRM
            dashboard.
          </p>

          <label>
            Email Address
          </label>

          <input
            type="email"
            placeholder="admin@fiddlefit.in"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <label>
            Password
          </label>

          <div className="password-box">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "◉"
                : "○"}
            </button>

          </div>

          <div className="login-options">

            <label className="remember">
              <input
                type="checkbox"
              />

              Remember me
            </label>

            <button
              type="button"
              className="forgot"
            >
              Forgot password?
            </button>

          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign In
            <span>→</span>
          </button>

          <div className="login-demo">
            Demo login — any email/password
          </div>

        </form>

      </div>

    </div>
  );
}


function Feature({ icon, title }) {
  return (
    <div className="login-feature">

      <div className="feature-icon">
        {icon}
      </div>

      <span>
        {title}
      </span>

    </div>
  );
}


/* =====================================================
   NAV ITEM
===================================================== */

function NavItem({
  icon,
  label,
  active,
  onClick,
  collapsed,
}) {
  return (
    <button
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
      title={
        collapsed
          ? label
          : ""
      }
    >

      <span className="nav-icon">
        {icon}
      </span>

      {!collapsed && (
        <span>
          {label}
        </span>
      )}

    </button>
  );
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({
  leads,
  stats,
  sales,
  revenue,
  setActivePage,
}) {
  const monthlyTarget = 350000;

  const revenueProgress =
    monthlyTarget > 0
      ? Math.min(
          Math.round(
            (revenue /
              monthlyTarget) *
              100
          ),
          100
        )
      : 0;

  const callingTarget = 300;

  const callsCompleted =
    Math.min(
      leads.length * 20,
      callingTarget
    );

  const callingProgress =
    Math.round(
      (callsCompleted /
        callingTarget) *
        100
    );

  const conversionRate =
    stats.total > 0
      ? Math.round(
          (stats.converted /
            stats.total) *
            100
        )
      : 0;

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <span className="eyebrow">
            FIDDLEFITTLIFE CRM
          </span>

          <h1>
            Good morning, Admin 👋
          </h1>

          <p>
            Here's what's happening with
            your business today.
          </p>

        </div>

        <div className="date-card">

          <div className="date-icon">
            📅
          </div>

          <div>
            <small>
              TODAY
            </small>

            <strong>
              31 August 2026
            </strong>
          </div>

        </div>

      </div>


      {/* KPI */}

      <div className="kpi-grid">

        <KpiCard
          title="Total Leads"
          value={stats.total}
          icon="👥"
          color="blue"
          trend="+12.5%"
          subtitle="vs last month"
        />

        <KpiCard
          title="Interested Leads"
          value={stats.interested}
          icon="🔥"
          color="orange"
          trend="+8.4%"
          subtitle="high intent leads"
        />

        <KpiCard
          title="Follow Ups"
          value={stats.followUp}
          icon="📅"
          color="purple"
          trend="+5.2%"
          subtitle="scheduled callbacks"
        />

        <KpiCard
          title="Converted"
          value={stats.converted}
          icon="✓"
          color="green"
          trend={`${conversionRate}%`}
          subtitle="conversion rate"
        />

      </div>


      {/* REVENUE + CALLING */}

      <div className="dashboard-two">

        <div className="revenue-card">

          <div className="card-top">

            <div>

              <span>
                REVENUE OVERVIEW
              </span>

              <h2>
                ₹
                {revenue.toLocaleString(
                  "en-IN"
                )}
              </h2>

              <p>
                ↑ 18.6%
                <small>
                  vs previous month
                </small>
              </p>

            </div>

            <div className="dark-icon">
              ₹
            </div>

          </div>


          <div className="bar-chart">

            {[
              35,
              48,
              42,
              65,
              58,
              72,
              68,
              84,
              76,
              92,
              81,
              96,
            ].map(
              (height, index) => (
                <div
                  className="chart-bar-wrapper"
                  key={index}
                >
                  <div
                    className="chart-bar"
                    style={{
                      height:
                        `${height}%`,
                    }}
                  />
                </div>
              )
            )}

          </div>


          <div className="target-row">

            <div>
              <span>
                Monthly Target
              </span>

              <strong>
                ₹
                {monthlyTarget.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="target-progress">

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      `${revenueProgress}%`,
                  }}
                />
              </div>

              <strong>
                {revenueProgress}%
              </strong>

            </div>

          </div>

        </div>


        <div className="calling-card">

          <div className="card-top">

            <div>

              <span>
                CALLING PERFORMANCE
              </span>

              <h2 className="light-number">
                {callsCompleted}
              </h2>

              <p className="gray-text">
                calls completed
              </p>

            </div>

            <div className="light-icon">
              ☎
            </div>

          </div>


          <div className="circle-wrapper">

            <div
              className="circle-progress"
              style={{
                background:
                  `conic-gradient(
                    #2563eb ${
                      callingProgress *
                      3.6
                    }deg,
                    #e8edf5 0deg
                  )`,
              }}
            >

              <div className="circle-inner">

                <strong>
                  {callingProgress}%
                </strong>

                <span>
                  Target
                </span>

              </div>

            </div>

          </div>


          <div className="calling-bottom">

            <div>
              <strong>
                {callingTarget}
              </strong>

              <span>
                Daily Target
              </span>
            </div>

            <div>
              <strong>
                {stats.interested}
              </strong>

              <span>
                Interested
              </span>
            </div>

            <div>
              <strong>
                {stats.followUp}
              </strong>

              <span>
                Callbacks
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* FUNNEL + LEADERBOARD */}

      <div className="dashboard-two">

        <div className="white-card">

          <div className="section-heading">

            <div>
              <h2>
                Lead Conversion Funnel
              </h2>

              <p>
                Track leads through your
                sales pipeline
              </p>
            </div>

            <span className="filter-chip">
              This Month ▾
            </span>

          </div>


          <div className="funnel">

            <Funnel
              label="Total Leads"
              value={stats.total}
              percentage={100}
              color="blue"
            />

            <Funnel
              label="Interested"
              value={stats.interested}
              percentage={
                stats.total
                  ? Math.round(
                      (stats.interested /
                        stats.total) *
                        100
                    )
                  : 0
              }
              color="orange"
            />

            <Funnel
              label="Follow Up"
              value={stats.followUp}
              percentage={
                stats.total
                  ? Math.round(
                      (stats.followUp /
                        stats.total) *
                        100
                    )
                  : 0
              }
              color="purple"
            />

            <Funnel
              label="Converted"
              value={stats.converted}
              percentage={
                stats.total
                  ? Math.round(
                      (stats.converted /
                        stats.total) *
                        100
                    )
                  : 0
              }
              color="green"
            />

          </div>

        </div>


        <div className="white-card">

          <div className="section-heading">

            <div>
              <h2>
                Executive Leaderboard
              </h2>

              <p>
                Team performance overview
              </p>
            </div>

            <span className="trophy">
              🏆
            </span>

          </div>


          {EXECUTIVES.map(
            (person, index) => {

              const assigned =
                leads.filter(
                  (lead) =>
                    lead.executive ===
                    person
                ).length;

              const interested =
                leads.filter(
                  (lead) =>
                    lead.executive ===
                      person &&
                    lead.status ===
                      "Interested"
                ).length;

              const converted =
                leads.filter(
                  (lead) =>
                    lead.executive ===
                      person &&
                    lead.status ===
                      "Converted"
                ).length;

              return (
                <div
                  className="leader-row"
                  key={person}
                >

                  <div className="rank">
                    #{index + 1}
                  </div>

                  <div className="leader-avatar">
                    {person.charAt(0)}
                  </div>

                  <div className="leader-name">

                    <strong>
                      {person}
                    </strong>

                    <span>
                      {assigned} leads assigned
                    </span>

                  </div>

                  <div className="leader-stat">

                    <strong>
                      {interested}
                    </strong>

                    <span>
                      Interested
                    </span>

                  </div>

                  <div className="leader-stat">

                    <strong>
                      {converted}
                    </strong>

                    <span>
                      Sales
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>


      {/* HOT LEADS + FOLLOW UPS */}

      <div className="dashboard-two">

        <div className="white-card">

          <div className="section-heading">

            <div>
              <h2>
                🔥 Hot Leads
              </h2>

              <p>
                Interested customers requiring
                attention
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                setActivePage(
                  "Leads"
                )
              }
            >
              View All →
            </button>

          </div>


          {leads.filter(
            (lead) =>
              lead.status ===
              "Interested"
          ).length === 0 ? (

            <EmptyState
              icon="🔥"
              title="No hot leads yet"
              text="Interested leads will appear here"
            />

          ) : (

            leads
              .filter(
                (lead) =>
                  lead.status ===
                  "Interested"
              )
              .slice(0, 4)
              .map((lead) => (
                <div
                  className="hot-row"
                  key={lead.id}
                >

                  <div className="hot-avatar">
                    {lead.name.charAt(
                      0
                    )}
                  </div>

                  <div className="hot-info">

                    <strong>
                      {lead.name}
                    </strong>

                    <span>
                      {lead.phone}
                    </span>

                  </div>

                  <span className="executive-small">
                    {lead.executive}
                  </span>

                  <span className="hot-badge">
                    Interested
                  </span>

                </div>
              ))

          )}

        </div>


        <div className="white-card">

          <div className="section-heading">

            <div>
              <h2>
                📅 Upcoming Follow Ups
              </h2>

              <p>
                Leads requiring callback
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                setActivePage(
                  "Calling"
                )
              }
            >
              View All →
            </button>

          </div>


          {leads.filter(
            (lead) =>
              lead.status ===
              "Follow Up"
          ).length === 0 ? (

            <EmptyState
              icon="📅"
              title="No upcoming follow ups"
              text="Scheduled callbacks will appear here"
            />

          ) : (

            leads
              .filter(
                (lead) =>
                  lead.status ===
                  "Follow Up"
              )
              .slice(0, 4)
              .map((lead) => (
                <div
                  className="follow-row"
                  key={lead.id}
                >

                  <div className="follow-date">
                    <strong>
                      31
                    </strong>

                    <span>
                      AUG
                    </span>
                  </div>

                  <div className="hot-info">

                    <strong>
                      {lead.name}
                    </strong>

                    <span>
                      {lead.phone}
                    </span>

                  </div>

                  <span className="follow-time">
                    10:30 AM
                  </span>

                </div>
              ))

          )}

        </div>

      </div>


      {/* ACTIVITY */}

      <div className="white-card activity-card">

        <div className="section-heading">

          <div>
            <h2>
              Recent Activity
            </h2>

            <p>
              Latest updates from your CRM
            </p>
          </div>

          <button
            className="text-button"
            onClick={() =>
              setActivePage(
                "Reports"
              )
            }
          >
            View Reports →
          </button>

        </div>


        <div className="activity-grid">

          <Activity
            icon="👤"
            title="New leads"
            value={stats.new}
            text="new leads waiting for calling"
          />

          <Activity
            icon="🔥"
            title="Interested"
            value={stats.interested}
            text="customers showing high interest"
          />

          <Activity
            icon="📅"
            title="Follow ups"
            value={stats.followUp}
            text="callbacks scheduled"
          />

          <Activity
            icon="✓"
            title="Conversions"
            value={stats.converted}
            text="successful conversions"
          />

        </div>

      </div>

    </div>
  );
}


function KpiCard({
  title,
  value,
  icon,
  color,
  trend,
  subtitle,
}) {
  return (
    <div className="kpi-card">

      <div className="kpi-top">

        <div>
          <span>
            {title}
          </span>

          <strong>
            {value}
          </strong>
        </div>

        <div
          className={`kpi-icon ${color}`}
        >
          {icon}
        </div>

      </div>

      <div className="kpi-bottom">

        <b>
          ↑ {trend}
        </b>

        <span>
          {subtitle}
        </span>

      </div>

    </div>
  );
}


function Funnel({
  label,
  value,
  percentage,
  color,
}) {
  return (
    <div className="funnel-item">

      <div className="funnel-label">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <div className="funnel-track">

        <div
          className={`funnel-fill ${color}`}
          style={{
            width:
              `${Math.max(
                percentage,
                value > 0
                  ? 4
                  : 0
              )}%`,
          }}
        />

      </div>

      <span className="funnel-percent">
        {percentage}%
      </span>

    </div>
  );
}


function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="empty-state">

      <div>
        {icon}
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {text}
      </span>

    </div>
  );
}


function Activity({
  icon,
  title,
  value,
  text,
}) {
  return (
    <div className="activity-item">

      <div className="activity-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {text}
        </small>

      </div>

    </div>
  );
}


/* =====================================================
   LEADS
===================================================== */

function LeadsPage({
  leads,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  executiveFilter,
  setExecutiveFilter,
  assignLead,
  updateLeadStatus,
  importExcel,
}) {
  const filtered = leads.filter(
    (lead) => {

      const matchesSearch =
        lead.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        lead.phone.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        lead.status ===
          statusFilter;

      const matchesExecutive =
        executiveFilter === "All" ||
        lead.executive ===
          executiveFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesExecutive
      );
    }
  );

  return (
    <div className="page">

      <PageHeader
        title="Lead Management"
        subtitle="Manage and assign your leads"
      />

      <div className="lead-actions">

        <label className="upload-button">

          📥 Import Excel

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={importExcel}
            hidden
          />

        </label>

        <div className="lead-count">
          Total Leads
          <strong>
            {leads.length}
          </strong>
        </div>

      </div>


      <div className="mini-stats">

        <MiniStat
          label="New"
          value={
            leads.filter(
              (x) =>
                x.status === "New"
            ).length
          }
        />

        <MiniStat
          label="Interested"
          value={
            leads.filter(
              (x) =>
                x.status ===
                "Interested"
            ).length
          }
        />

        <MiniStat
          label="Follow Up"
          value={
            leads.filter(
              (x) =>
                x.status ===
                "Follow Up"
            ).length
          }
        />

        <MiniStat
          label="Converted"
          value={
            leads.filter(
              (x) =>
                x.status ===
                "Converted"
            ).length
          }
        />

      </div>


      <div className="white-card">

        <div className="filters">

          <input
            className="search-input"
            placeholder="🔍 Search name or phone..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            value={executiveFilter}
            onChange={(e) =>
              setExecutiveFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Executives
            </option>

            {EXECUTIVES.map(
              (person) => (
                <option
                  key={person}
                  value={person}
                >
                  {person}
                </option>
              )
            )}

          </select>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="New">
              New
            </option>

            <option value="Interested">
              Interested
            </option>

            <option value="Follow Up">
              Follow Up
            </option>

            <option value="Not Interested">
              Not Interested
            </option>

            <option value="DNP">
              DNP
            </option>

            <option value="Converted">
              Converted
            </option>

          </select>

        </div>


        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>LEAD</th>
                <th>PHONE</th>
                <th>SOURCE</th>
                <th>EXECUTIVE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map(
                (lead) => (
                  <tr key={lead.id}>

                    <td>
                      <div className="table-person">

                        <div>
                          {lead.name.charAt(
                            0
                          )}
                        </div>

                        <strong>
                          {lead.name}
                        </strong>

                      </div>
                    </td>

                    <td>
                      {lead.phone}
                    </td>

                    <td>
                      {lead.source}
                    </td>

                    <td>

                      <select
                        value={
                          lead.executive
                        }
                        onChange={(e) =>
                          assignLead(
                            lead.id,
                            e.target.value
                          )
                        }
                      >

                        {EXECUTIVES.map(
                          (
                            person
                          ) => (
                            <option
                              key={
                                person
                              }
                              value={
                                person
                              }
                            >
                              {
                                person
                              }
                            </option>
                          )
                        )}

                      </select>

                    </td>

                    <td>
                      <StatusBadge
                        status={
                          lead.status
                        }
                      />
                    </td>

                    <td>

                      <select
                        value={
                          lead.status
                        }
                        onChange={(e) =>
                          updateLeadStatus(
                            lead.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="New">
                          New
                        </option>

                        <option value="Interested">
                          Interested
                        </option>

                        <option value="Follow Up">
                          Follow Up
                        </option>

                        <option value="Not Interested">
                          Not Interested
                        </option>

                        <option value="DNP">
                          DNP
                        </option>

                        <option value="Converted">
                          Converted
                        </option>

                      </select>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


function MiniStat({
  label,
  value,
}) {
  return (
    <div className="mini-stat">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


function StatusBadge({
  status,
}) {
  const className =
    status
      .toLowerCase()
      .replaceAll(
        " ",
        "-"
      );

  return (
    <span
      className={`status ${className}`}
    >
      {status}
    </span>
  );
}


/* =====================================================
   CALLING
===================================================== */

function CallingPage({
  leads,
  updateLeadStatus,
}) {
  const callingLeads =
    leads.filter(
      (lead) =>
        lead.status !==
          "Converted" &&
        lead.status !==
          "Not Interested" &&
        lead.status !== "DNP"
    );

  return (
    <div className="page">

      <PageHeader
        title="Calling Operations"
        subtitle="Manage your daily calling pipeline"
      />

      <div className="calling-summary">

        <MiniStat
          label="Today's Calls"
          value={
            callingLeads.length
          }
        />

        <MiniStat
          label="Interested"
          value={
            leads.filter(
              (x) =>
                x.status ===
                "Interested"
            ).length
          }
        />

        <MiniStat
          label="Callbacks"
          value={
            leads.filter(
              (x) =>
                x.status ===
                "Follow Up"
            ).length
          }
        />

        <MiniStat
          label="Daily Target"
          value="300"
        />

      </div>


      <div className="white-card">

        <div className="section-heading">

          <div>
            <h2>
              Calling Queue
            </h2>

            <p>
              Leads currently requiring action
            </p>
          </div>

        </div>


        <div className="calling-list">

          {callingLeads.map(
            (lead) => (
              <div
                className="calling-row"
                key={lead.id}
              >

                <div className="table-person">

                  <div>
                    {lead.name.charAt(
                      0
                    )}
                  </div>

                  <strong>
                    {lead.name}
                  </strong>

                </div>

                <span>
                  {lead.phone}
                </span>

                <span>
                  {lead.executive}
                </span>

                <StatusBadge
                  status={
                    lead.status
                  }
                />

                <div className="call-actions">

                  <button
                    onClick={() =>
                      updateLeadStatus(
                        lead.id,
                        "Interested"
                      )
                    }
                  >
                    Interested
                  </button>

                  <button
                    onClick={() =>
                      updateLeadStatus(
                        lead.id,
                        "Follow Up"
                      )
                    }
                  >
                    Callback
                  </button>

                  <button
                    onClick={() =>
                      updateLeadStatus(
                        lead.id,
                        "Not Interested"
                      )
                    }
                  >
                    Not Interested
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   SALES
===================================================== */

function SalesPage({
  sales,
  revenue,
}) {
  return (
    <div className="page">

      <PageHeader
        title="Sales Management"
        subtitle="Track packages, payments and conversions"
      />

      <div className="mini-stats">

        <MiniStat
          label="Total Sales"
          value={sales.length}
        />

        <MiniStat
          label="Revenue"
          value={`₹${revenue.toLocaleString(
            "en-IN"
          )}`}
        />

        <MiniStat
          label="Paid"
          value={
            sales.filter(
              (x) =>
                x.status === "Paid"
            ).length
          }
        />

        <MiniStat
          label="Target"
          value="₹3.5L"
        />

      </div>


      <div className="white-card">

        <div className="section-heading">

          <div>
            <h2>
              Recent Sales
            </h2>

            <p>
              Latest converted customers
            </p>
          </div>

        </div>


        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>CLIENT</th>
                <th>EXECUTIVE</th>
                <th>PACKAGE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>

            <tbody>

              {sales.map(
                (sale) => (
                  <tr key={sale.id}>

                    <td>
                      <strong>
                        {sale.client}
                      </strong>
                    </td>

                    <td>
                      {sale.executive}
                    </td>

                    <td>
                      {sale.package}
                    </td>

                    <td>
                      ₹
                      {sale.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <StatusBadge
                        status={
                          sale.status
                        }
                      />
                    </td>

                    <td>
                      {sale.date}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   REPORTS
===================================================== */

function ReportsPage({
  leads,
  sales,
  stats,
  revenue,
}) {
  const contacted =
    leads.filter(
      (lead) =>
        lead.status !==
        "New"
    ).length;

  const contactRate =
    leads.length > 0
      ? Math.round(
          (contacted /
            leads.length) *
            100
        )
      : 0;

  return (
    <div className="page">

      <PageHeader
        title="Reports & Analytics"
        subtitle="Business performance overview"
      />

      <div className="report-grid">

        <ReportCard
          title="Total Leads"
          value={stats.total}
          icon="👥"
        />

        <ReportCard
          title="Contact Rate"
          value={`${contactRate}%`}
          icon="☎"
        />

        <ReportCard
          title="Conversion"
          value={`${stats.total
            ? Math.round(
                (stats.converted /
                  stats.total) *
                  100
              )
            : 0}%`}
          icon="📈"
        />

        <ReportCard
          title="Revenue"
          value={`₹${revenue.toLocaleString(
            "en-IN"
          )}`}
          icon="₹"
        />

      </div>


      <div className="dashboard-two">

        <div className="white-card">

          <div className="section-heading">

            <div>
              <h2>
                Pipeline Breakdown
              </h2>

              <p>
                Current lead distribution
              </p>
            </div>

          </div>

          <Funnel
            label="New"
            value={stats.new}
            percentage={
              stats.total
                ? Math.round(
                    (stats.new /
                      stats.total) *
                      100
                  )
                : 0
            }
            color="blue"
          />

          <Funnel
            label="Interested"
            value={stats.interested}
            percentage={
              stats.total
                ? Math.round(
                    (stats.interested /
                      stats.total) *
                      100
                  )
                : 0
            }
            color="orange"
          />

          <Funnel
            label="Follow Up"
            value={stats.followUp}
            percentage={
              stats.total
                ? Math.round(
                    (stats.followUp /
                      stats.total) *
                      100
                  )
                : 0
            }
            color="purple"
          />

          <Funnel
            label="Converted"
            value={stats.converted}
            percentage={
              stats.total
                ? Math.round(
                    (stats.converted /
                      stats.total) *
                      100
                  )
                : 0
            }
            color="green"
          />

        </div>


        <div className="white-card">

          <div className="section-heading">

            <div>
              <h2>
                Sales Overview
              </h2>

              <p>
                Revenue generated by team
              </p>
            </div>

          </div>

          {EXECUTIVES.map(
            (person) => {

              const personSales =
                sales.filter(
                  (sale) =>
                    sale.executive ===
                    person
                );

              const amount =
                personSales.reduce(
                  (
                    sum,
                    sale
                  ) =>
                    sum +
                    Number(
                      sale.amount ||
                        0
                    ),
                  0
                );

              return (
                <div
                  className="report-person"
                  key={person}
                >

                  <div className="leader-avatar">
                    {person.charAt(
                      0
                    )}
                  </div>

                  <div>
                    <strong>
                      {person}
                    </strong>

                    <span>
                      {personSales.length}
                      {" "}
                      sales
                    </span>
                  </div>

                  <strong>
                    ₹
                    {amount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}


function ReportCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="report-card">

      <div className="report-icon">
        {icon}
      </div>

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


/* =====================================================
   TEAM
===================================================== */

function TeamPage({
  leads,
  sales,
}) {
  return (
    <div className="page">

      <PageHeader
        title="Team Performance"
        subtitle="Monitor executive performance"
      />

      <div className="team-grid">

        {EXECUTIVES.map(
          (person) => {

            const assigned =
              leads.filter(
                (lead) =>
                  lead.executive ===
                  person
              ).length;

            const interested =
              leads.filter(
                (lead) =>
                  lead.executive ===
                    person &&
                  lead.status ===
                    "Interested"
              ).length;

            const personSales =
              sales.filter(
                (sale) =>
                  sale.executive ===
                  person
              );

            const amount =
              personSales.reduce(
                (
                  total,
                  sale
                ) =>
                  total +
                  Number(
                    sale.amount ||
                      0
                  ),
                0
              );

            return (
              <div
                className="team-card"
                key={person}
              >

                <div className="team-avatar">
                  {person.charAt(0)}
                </div>

                <h3>
                  {person}
                </h3>

                <span>
                  Calling Executive
                </span>

                <div className="team-metrics">

                  <div>
                    <strong>
                      {assigned}
                    </strong>

                    <span>
                      Leads
                    </span>
                  </div>

                  <div>
                    <strong>
                      {interested}
                    </strong>

                    <span>
                      Interested
                    </span>
                  </div>

                  <div>
                    <strong>
                      ₹
                      {amount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span>
                      Sales
                    </span>
                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


/* =====================================================
   SETTINGS
===================================================== */

function SettingsPage() {
  return (
    <div className="page">

      <PageHeader
        title="Settings"
        subtitle="Manage CRM preferences"
      />

      <div className="settings-grid">

        <div className="white-card">

          <h2>
            Profile Settings
          </h2>

          <div className="setting-row">
            <span>
              Administrator
            </span>

            <strong>
              Admin
            </strong>
          </div>

          <div className="setting-row">
            <span>
              Email
            </span>

            <strong>
              admin@fiddlefit.in
            </strong>
          </div>

          <div className="setting-row">
            <span>
              Role
            </span>

            <strong>
              Administrator
            </strong>
          </div>

        </div>


        <div className="white-card">

          <h2>
            CRM Preferences
          </h2>

          <div className="setting-row">

            <span>
              Email Notifications
            </span>

            <input
              type="checkbox"
              defaultChecked
            />

          </div>

          <div className="setting-row">

            <span>
              Follow Up Reminders
            </span>

            <input
              type="checkbox"
              defaultChecked
            />

          </div>

          <div className="setting-row">

            <span>
              Auto Assignment
            </span>

            <input
              type="checkbox"
              defaultChecked
            />

          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   PAGE HEADER
===================================================== */

function PageHeader({
  title,
  subtitle,
}) {
  return (
    <div className="page-header">

      <div>

        <span className="eyebrow">
          FIDDLEFITTLIFE
        </span>

        <h1>
          {title}
        </h1>

        <p>
          {subtitle}
        </p>

      </div>

    </div>
  );
}


/* =====================================================
   CSS
===================================================== */

const style = document.createElement(
  "style"
);

style.textContent = `

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f5f7fb;
  color: #111827;
}

button,
input,
select {
  font-family: inherit;
}

button {
  cursor: pointer;
}


/* LOGIN */

.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: #ffffff;
}

.login-left {
  background:
    radial-gradient(
      circle at 20% 20%,
      #334155 0,
      transparent 30%
    ),
    linear-gradient(
      145deg,
      #0f172a,
      #172554
    );
  color: white;
  padding: 55px 8%;
  position: relative;
  overflow: hidden;
}

.login-left:after {
  content: "";
  position: absolute;
  width: 500px;
  height: 500px;
  border: 1px solid
    rgba(255,255,255,.08);
  border-radius: 50%;
  right: -200px;
  bottom: -200px;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-logo,
.mobile-login-logo {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2563eb;
  color: white;
  font-size: 22px;
  font-weight: 900;
}

.login-brand strong {
  display: block;
  font-size: 15px;
  letter-spacing: .5px;
}

.login-brand span {
  display: block;
  color: #94a3b8;
  font-size: 9px;
  margin-top: 3px;
}

.login-content {
  max-width: 600px;
  margin-top: 150px;
  position: relative;
  z-index: 2;
}

.login-tag,
.eyebrow {
  font-size: 9px;
  letter-spacing: 1.8px;
  font-weight: 800;
  color: #60a5fa;
}

.login-content h1 {
  font-size: 52px;
  line-height: 1.05;
  margin: 18px 0;
  letter-spacing: -2px;
}

.login-content h1 span {
  color: #60a5fa;
}

.login-content p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.7;
  max-width: 500px;
}

.login-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
  margin-top: 35px;
}

.login-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px;
  border-radius: 10px;
  background: rgba(255,255,255,.05);
  border: 1px solid
    rgba(255,255,255,.07);
  font-size: 11px;
}

.feature-icon {
  width: 31px;
  height: 31px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(96,165,250,.13);
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-box {
  width: 100%;
  max-width: 400px;
}

.mobile-login-logo {
  display: none;
}

.login-box h2 {
  font-size: 28px;
  margin: 0 0 8px;
}

.login-box > p {
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 30px;
}

.login-box > label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #374151;
  margin: 17px 0 7px;
}

.login-box input[type="email"],
.login-box input[type="password"],
.password-box input[type="text"] {
  width: 100%;
  height: 45px;
  border: 1px solid #dbe1ea;
  border-radius: 9px;
  padding: 0 13px;
  outline: none;
  font-size: 12px;
}

.login-box input:focus {
  border-color: #2563eb;
  box-shadow:
    0 0 0 3px
    rgba(37,99,235,.08);
}

.password-box {
  position: relative;
}

.password-box button {
  position: absolute;
  right: 12px;
  top: 10px;
  border: 0;
  background: none;
  color: #64748b;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 13px 0 22px;
  font-size: 10px;
}

.remember {
  display: flex;
  gap: 6px;
  align-items: center;
  color: #6b7280;
}

.forgot {
  border: 0;
  background: none;
  color: #2563eb;
  font-size: 10px;
}

.login-button {
  width: 100%;
  height: 47px;
  border: 0;
  border-radius: 9px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  box-shadow:
    0 8px 20px
    rgba(37,99,235,.22);
}

.login-button:hover {
  background: #1d4ed8;
}

.login-demo {
  text-align: center;
  margin-top: 15px;
  color: #9ca3af;
  font-size: 9px;
}


/* APP */

.app {
  min-height: 100vh;
}

.sidebar {
  width: 230px;
  background: #0f172a;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  color: white;
  padding: 19px 13px;
  z-index: 10;
  transition: .25s;
}

.sidebar-collapsed {
  width: 70px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px 23px;
}

.brand-logo {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.brand-name {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .4px;
}

.brand-sub {
  color: #64748b;
  font-size: 7px;
  margin-top: 3px;
  letter-spacing: 1px;
}

.menu-title {
  color: #475569;
  font-size: 8px;
  font-weight: 800;
  padding: 0 9px 9px;
  letter-spacing: 1px;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item,
.logout-button {
  width: 100%;
  border: 0;
  background: transparent;
  color: #94a3b8;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 10px;
  text-align: left;
  font-size: 11px;
}

.nav-item:hover {
  background: #1e293b;
  color: white;
}

.nav-item.active {
  background: #2563eb;
  color: white;
  box-shadow:
    0 5px 15px
    rgba(37,99,235,.2);
}

.nav-icon {
  width: 18px;
  text-align: center;
  font-size: 15px;
}

.sidebar-bottom {
  position: absolute;
  bottom: 18px;
  left: 13px;
  right: 13px;
}

.logout-button {
  color: #f87171;
  margin-top: 5px;
}

.logout-button:hover {
  background: rgba(248,113,113,.08);
}

.main {
  margin-left: 230px;
  min-height: 100vh;
  transition: .25s;
}

.main-expanded {
  margin-left: 70px;
}

.topbar {
  height: 65px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 27px;
  gap: 16px;
}

.menu-toggle {
  border: 0;
  background: #f8fafc;
  width: 34px;
  height: 34px;
  border-radius: 8px;
}

.breadcrumb {
  font-size: 10px;
  color: #6b7280;
}

.breadcrumb span {
  margin: 0 8px;
  color: #cbd5e1;
}

.top-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 18px;
}

.notification {
  border: 0;
  background: transparent;
  position: relative;
  font-size: 15px;
}

.notification span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ef4444;
  position: absolute;
  top: 1px;
  right: 0;
}

.profile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #e0e7ff;
  color: #3730a3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
}

.profile-text strong,
.profile-text small {
  display: block;
}

.profile-text strong {
  font-size: 10px;
}

.profile-text small {
  color: #9ca3af;
  font-size: 8px;
  margin-top: 3px;
}

.content {
  padding: 28px;
  max-width: 1700px;
  margin: auto;
}

.toast {
  position: fixed;
  right: 25px;
  top: 80px;
  background: #111827;
  color: white;
  padding: 12px 17px;
  border-radius: 9px;
  font-size: 11px;
  z-index: 50;
  box-shadow:
    0 10px 25px
    rgba(0,0,0,.15);
}


/* DASHBOARD */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 28px;
  margin: 8px 0 5px;
  letter-spacing: -.8px;
}

.dashboard-header p {
  margin: 0;
  color: #6b7280;
  font-size: 11px;
}

.date-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e5e7eb;
  padding: 9px 13px;
  border-radius: 10px;
}

.date-icon {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-card small,
.date-card strong {
  display: block;
}

.date-card small {
  color: #9ca3af;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 1px;
}

.date-card strong {
  font-size: 10px;
  margin-top: 3px;
}

.kpi-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.kpi-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 13px;
  padding: 17px;
  box-shadow:
    0 4px 15px
    rgba(15,23,42,.025);
}

.kpi-top {
  display: flex;
  justify-content: space-between;
}

.kpi-top span {
  display: block;
  color: #6b7280;
  font-size: 10px;
  margin-bottom: 7px;
}

.kpi-top strong {
  font-size: 27px;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kpi-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}

.kpi-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}

.kpi-icon.purple {
  background: #f5f3ff;
  color: #7c3aed;
}

.kpi-icon.green {
  background: #f0fdf4;
  color: #16a34a;
}

.kpi-bottom {
  margin-top: 13px;
  display: flex;
  gap: 7px;
  align-items: center;
  font-size: 8px;
  color: #9ca3af;
}

.kpi-bottom b {
  color: #16a34a;
  background: #f0fdf4;
  padding: 4px 6px;
  border-radius: 5px;
}

.dashboard-two {
  display: grid;
  grid-template-columns:
    1.45fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}

.revenue-card {
  background:
    linear-gradient(
      145deg,
      #111827,
      #1e293b
    );
  color: white;
  border-radius: 14px;
  padding: 21px;
  min-height: 305px;
}

.calling-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 21px;
  min-height: 305px;
}

.card-top {
  display: flex;
  justify-content: space-between;
}

.card-top > div:first-child > span {
  font-size: 8px;
  letter-spacing: 1.3px;
  font-weight: 800;
  opacity: .65;
}

.card-top h2 {
  font-size: 30px;
  margin: 8px 0 3px;
}

.card-top p {
  color: #86efac;
  font-size: 9px;
  font-weight: 700;
  margin: 0;
}

.card-top p small {
  color: #94a3b8;
  margin-left: 5px;
  font-weight: 400;
}

.dark-icon,
.light-icon {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-icon {
  background: rgba(255,255,255,.08);
}

.light-icon {
  background: #eff6ff;
  color: #2563eb;
}

.light-number {
  color: #111827;
}

.gray-text {
  color: #9ca3af !important;
}

.bar-chart {
  height: 110px;
  display: flex;
  gap: 8px;
  align-items: end;
  margin-top: 24px;
  border-bottom:
    1px solid rgba(255,255,255,.1);
}

.chart-bar-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
}

.chart-bar {
  width: 55%;
  min-height: 4px;
  border-radius: 5px 5px 1px 1px;
  background:
    linear-gradient(
      to top,
      #3b82f6,
      #93c5fd
    );
}

.target-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  gap: 20px;
}

.target-row span,
.target-row strong {
  display: block;
}

.target-row span {
  color: #94a3b8;
  font-size: 8px;
}

.target-row strong {
  font-size: 10px;
  margin-top: 4px;
}

.target-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 9px;
}

.progress-track {
  height: 5px;
  background: rgba(255,255,255,.1);
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #60a5fa;
  border-radius: 10px;
}

.circle-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.circle-progress {
  width: 125px;
  height: 125px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-inner {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.circle-inner strong {
  font-size: 23px;
}

.circle-inner span {
  color: #9ca3af;
  font-size: 8px;
  margin-top: 3px;
}

.calling-bottom {
  border-top: 1px solid #eef0f3;
  margin-top: 17px;
  padding-top: 14px;
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  text-align: center;
}

.calling-bottom strong,
.calling-bottom span {
  display: block;
}

.calling-bottom strong {
  font-size: 14px;
}

.calling-bottom span {
  color: #9ca3af;
  font-size: 8px;
  margin-top: 3px;
}

.white-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
  box-shadow:
    0 4px 15px
    rgba(15,23,42,.025);
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 17px;
}

.section-heading h2 {
  margin: 0;
  font-size: 15px;
}

.section-heading p {
  margin: 5px 0 0;
  color: #9ca3af;
  font-size: 9px;
}

.filter-chip {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 9px;
  font-size: 8px;
  color: #6b7280;
}

.trophy {
  font-size: 19px;
}

.funnel {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.funnel-item {
  position: relative;
}

.funnel-label {
  display: flex;
  justify-content: space-between;
  color: #6b7280;
  font-size: 10px;
  margin-bottom: 6px;
}

.funnel-label strong {
  color: #111827;
}

.funnel-track {
  height: 8px;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f5f9;
}

.funnel-fill {
  height: 100%;
  border-radius: 10px;
}

.funnel-fill.blue {
  background: #2563eb;
}

.funnel-fill.orange {
  background: #ea580c;
}

.funnel-fill.purple {
  background: #7c3aed;
}

.funnel-fill.green {
  background: #16a34a;
}

.funnel-percent {
  position: absolute;
  right: 0;
  top: 21px;
  font-size: 8px;
  color: #9ca3af;
}

.leader-row {
  display: grid;
  grid-template-columns:
    30px 36px 1fr 65px 50px;
  gap: 8px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}

.rank {
  color: #94a3b8;
  font-size: 9px;
  font-weight: 800;
}

.leader-avatar,
.hot-avatar,
.team-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #111827;
  color: white;
  font-weight: 800;
}

.leader-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  font-size: 11px;
}

.leader-name,
.hot-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.leader-name strong,
.hot-info strong {
  font-size: 10px;
}

.leader-name span,
.hot-info span {
  color: #9ca3af;
  font-size: 8px;
}

.leader-stat {
  text-align: right;
}

.leader-stat strong,
.leader-stat span {
  display: block;
}

.leader-stat strong {
  font-size: 11px;
}

.leader-stat span {
  color: #9ca3af;
  font-size: 7px;
  margin-top: 3px;
}

.text-button {
  border: 0;
  background: none;
  color: #2563eb;
  font-size: 9px;
  font-weight: 700;
}

.hot-row {
  display: grid;
  grid-template-columns:
    38px 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #f0f2f5;
}

.hot-avatar {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  background: #fff7ed;
  color: #ea580c;
}

.executive-small {
  color: #9ca3af;
  font-size: 8px;
}

.hot-badge {
  color: #ea580c;
  background: #fff7ed;
  border-radius: 20px;
  padding: 5px 8px;
  font-size: 7px;
  font-weight: 800;
}

.follow-row {
  display: grid;
  grid-template-columns:
    42px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid #f0f2f5;
}

.follow-date {
  width: 38px;
  height: 39px;
  border-radius: 8px;
  background: #f5f3ff;
  color: #7c3aed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.follow-date strong {
  font-size: 12px;
}

.follow-date span {
  font-size: 6px;
  font-weight: 800;
}

.follow-time {
  color: #6b7280;
  font-size: 8px;
}

.empty-state {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: #9ca3af;
}

.empty-state div {
  font-size: 24px;
}

.empty-state strong {
  color: #6b7280;
  font-size: 10px;
}

.empty-state span {
  font-size: 8px;
}

.activity-card {
  margin-bottom: 20px;
}

.activity-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 11px;
}

.activity-item {
  display: flex;
  gap: 10px;
  background: #f8fafc;
  padding: 13px;
  border-radius: 9px;
}

.activity-icon {
  font-size: 16px;
}

.activity-item span,
.activity-item strong,
.activity-item small {
  display: block;
}

.activity-item span {
  color: #6b7280;
  font-size: 8px;
}

.activity-item strong {
  font-size: 19px;
  margin-top: 3px;
}

.activity-item small {
  color: #9ca3af;
  font-size: 7px;
  margin-top: 3px;
}


/* PAGE */

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 25px;
  margin: 7px 0 5px;
}

.page-header p {
  color: #6b7280;
  font-size: 11px;
  margin: 0;
}

.lead-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.upload-button {
  background: #2563eb;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.lead-count {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 9px 14px;
  border-radius: 8px;
  color: #6b7280;
  font-size: 9px;
}

.lead-count strong {
  color: #111827;
  margin-left: 7px;
  font-size: 14px;
}

.mini-stats,
.calling-summary {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 13px;
  margin-bottom: 17px;
}

.mini-stat {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
}

.mini-stat span,
.mini-stat strong {
  display: block;
}

.mini-stat span {
  color: #6b7280;
  font-size: 9px;
}

.mini-stat strong {
  font-size: 21px;
  margin-top: 6px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input,
.filters select,
table select {
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  background: white;
  height: 36px;
  padding: 0 10px;
  font-size: 9px;
  outline: none;
}

.search-input {
  flex: 1;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 750px;
}

th {
  text-align: left;
  color: #94a3b8;
  font-size: 8px;
  letter-spacing: .6px;
  padding: 12px;
  background: #f8fafc;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 9px;
  color: #64748b;
}

.table-person {
  display: flex;
  align-items: center;
  gap: 9px;
}

.table-person > div {
  width: 29px;
  height: 29px;
  border-radius: 8px;
  background: #e0e7ff;
  color: #3730a3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  font-size: 9px;
}

.table-person strong {
  color: #111827;
  font-size: 9px;
}

.status {
  display: inline-block;
  border-radius: 20px;
  padding: 5px 8px;
  font-size: 7px;
  font-weight: 800;
}

.status.new {
  background: #eff6ff;
  color: #2563eb;
}

.status.interested {
  background: #fff7ed;
  color: #ea580c;
}

.status.follow-up {
  background: #f5f3ff;
  color: #7c3aed;
}

.status.converted,
.status.paid {
  background: #f0fdf4;
  color: #16a34a;
}

.status.not-interested,
.status.dnp {
  background: #fef2f2;
  color: #dc2626;
}


/* CALLING */

.calling-list {
  display: flex;
  flex-direction: column;
}

.calling-row {
  display: grid;
  grid-template-columns:
    1.5fr 1fr 1fr 100px 260px;
  gap: 10px;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 9px;
  color: #64748b;
}

.call-actions {
  display: flex;
  gap: 4px;
}

.call-actions button {
  border: 0;
  border-radius: 5px;
  padding: 6px 7px;
  font-size: 7px;
}

.call-actions button:first-child {
  background: #eff6ff;
  color: #2563eb;
}

.call-actions button:nth-child(2) {
  background: #f5f3ff;
  color: #7c3aed;
}

.call-actions button:last-child {
  background: #fef2f2;
  color: #dc2626;
}


/* REPORTS */

.report-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.report-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 17px;
}

.report-icon {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.report-card span,
.report-card strong {
  display: block;
}

.report-card span {
  color: #6b7280;
  font-size: 9px;
}

.report-card strong {
  font-size: 23px;
  margin-top: 6px;
}

.report-person {
  display: grid;
  grid-template-columns:
    35px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.report-person div:nth-child(2) strong,
.report-person div:nth-child(2) span {
  display: block;
}

.report-person div:nth-child(2) strong {
  font-size: 10px;
}

.report-person div:nth-child(2) span {
  color: #9ca3af;
  font-size: 8px;
  margin-top: 3px;
}

.report-person > strong {
  font-size: 10px;
}


/* TEAM */

.team-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 17px;
}

.team-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 13px;
  padding: 23px;
  text-align: center;
}

.team-avatar {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  margin: auto;
  font-size: 17px;
}

.team-card h3 {
  font-size: 15px;
  margin: 11px 0 3px;
}

.team-card > span {
  color: #9ca3af;
  font-size: 9px;
}

.team-metrics {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  margin-top: 22px;
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
}

.team-metrics strong,
.team-metrics span {
  display: block;
}

.team-metrics strong {
  font-size: 13px;
}

.team-metrics span {
  color: #9ca3af;
  font-size: 7px;
  margin-top: 4px;
}


/* SETTINGS */

.settings-grid {
  display: grid;
  grid-template-columns:
    1fr 1fr;
  gap: 18px;
}

.settings-grid h2 {
  font-size: 15px;
  margin: 0 0 15px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 10px;
}

.setting-row span {
  color: #6b7280;
}

.setting-row strong {
  color: #111827;
}


/* RESPONSIVE */

@media (max-width: 1100px) {

  .kpi-grid,
  .activity-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .dashboard-two {
    grid-template-columns: 1fr;
  }

  .report-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

}

@media (max-width: 800px) {

  .login-page {
    grid-template-columns: 1fr;
  }

  .login-left {
    display: none;
  }

  .mobile-login-logo {
    display: flex;
    margin-bottom: 25px;
  }

  .sidebar {
    width: 70px;
  }

  .sidebar .brand-name,
  .sidebar .brand-sub,
  .sidebar .menu-title,
  .sidebar .nav-item span:not(.nav-icon),
  .sidebar .logout-button span:last-child {
    display: none;
  }

  .main {
    margin-left: 70px;
  }

  .content {
    padding: 18px;
  }

  .dashboard-header {
    align-items: flex-start;
  }

  .date-card {
    display: none;
  }

  .team-grid,
  .settings-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 550px) {

  .kpi-grid,
  .activity-grid,
  .mini-stats,
  .calling-summary,
  .report-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header h1 {
    font-size: 22px;
  }

  .filters {
    flex-direction: column;
  }

  .login-right {
    padding: 25px;
  }

}

`;

document.head.appendChild(style);


export default App;