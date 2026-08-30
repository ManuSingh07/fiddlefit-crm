import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

const TEAM = ["Abhishek", "Rudransh", "Lakshya"];

const USERS = [
  {
    email: "admin@fiddlefittlife.com",
    password: "admin123",
    name: "Admin",
    role: "Admin",
  },
  {
    email: "abhishek@fiddlefittlife.com",
    password: "123456",
    name: "Abhishek",
    role: "Calling Executive",
  },
  {
    email: "rudransh@fiddlefittlife.com",
    password: "123456",
    name: "Rudransh",
    role: "Calling Executive",
  },
  {
    email: "lakshya@fiddlefittlife.com",
    password: "123456",
    name: "Lakshya",
    role: "Calling Executive",
  },
  {
    email: "sales@fiddlefittlife.com",
    password: "sales123",
    name: "Sales",
    role: "Sales Person",
  },
  {
    email: "dietitian@fiddlefittlife.com",
    password: "dietitian123",
    name: "Dietitian",
    role: "Dietitian",
  },
];

const STATUS = [
  "New",
  "Assigned",
  "Calling",
  "No Answer",
  "Interested",
  "Follow-up",
  "Converted",
  "Not Interested",
  "Lost",
];

const PLANS = [
  "1 Month",
  "3 Months",
  "6 Months",
  "12 Months",
];

const MENU = {
  Admin: [
    ["Dashboard", "▦"],
    ["Leads", "♟"],
    ["Calling", "☎"],
    ["Sales", "₹"],
    ["Dietitian", "♧"],
    ["Reports", "▤"],
  ],
  "Calling Executive": [
    ["Calling", "☎"],
    ["Reports", "▤"],
  ],
  "Sales Person": [
    ["Sales", "₹"],
    ["Reports", "▤"],
  ],
  Dietitian: [
    ["Dietitian", "♧"],
    ["Reports", "▤"],
  ],
};

const STORAGE_KEY = "fiddlefittlife_crm_leads";

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function loadLeads() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLeads(leads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <CRM
      user={user}
      onLogout={() => setUser(null)}
    />
  );
}

/* =========================================================
   LOGIN
========================================================= */

```jsx
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    const found = USERS.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!found) {
      setError("Invalid email or password.");
      return;
    }

    setError("");
    onLogin(found);
  }

  return (
    <div className="login-page">

      {/* LEFT SIDE - ONLY LOGO */}
      <div className="login-left">
        <div className="fiddlefit-logo">

          {/* Logo Icon */}
          <div className="logo-icon">
            <span className="quad black top-left"></span>
            <span className="quad green top-right"></span>
            <span className="quad green bottom-left"></span>
            <span className="quad black bottom-right"></span>
          </div>

          {/* Logo Text */}
          <div className="logo-text">
            <span className="logo-black">FIDDLEFITT</span>
            <span className="logo-green"> LIFE</span>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - LOGIN */}
      <div className="login-right">
        <div className="login-card">

          <div className="mobile-logo">
            F
          </div>

          <span className="section-label">
            WELCOME BACK
          </span>

          <h2>Sign in to CRM</h2>

          <p className="login-description">
            Enter your account details to access your workspace.
          </p>

          <form onSubmit={handleLogin}>

            <label>Email / Employee ID</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
            >
              Sign In
            </button>

          </form>

          <div className="demo-section">

            <div className="demo-title">
              DEMO ACCOUNTS
            </div>

            {USERS.map((item) => (
              <button
                key={item.email}
                type="button"
                className="demo-account"
                onClick={() => {
                  setEmail(item.email);
                  setPassword(item.password);
                  setError("");
                }}
              >
                <span className="demo-avatar">
                  {item.name.charAt(0)}
                </span>

                <span className="demo-details">
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </span>
              </button>
            ))}

          </div>

        </div>
      </div>

    </div>
  );
}
```

/* =========================================================
   CRM LAYOUT
========================================================= */

function CRM({ user, onLogout }) {
  const defaultPage =
    user.role === "Calling Executive"
      ? "Calling"
      : user.role === "Sales Person"
      ? "Sales"
      : user.role === "Dietitian"
      ? "Dietitian"
      : "Dashboard";

  const [page, setPage] = useState(defaultPage);
  const [leads, setLeads] = useState(loadLeads);

  function updateLeads(nextLeads) {
    setLeads(nextLeads);
    saveLeads(nextLeads);
  }

  function updateLead(id, changes) {
    const next = leads.map((lead) =>
      lead.id === id
        ? {
            ...lead,
            ...changes,
            updatedAt: new Date().toISOString(),
          }
        : lead
    );

    updateLeads(next);
  }

  function deleteLead(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    updateLeads(
      leads.filter((lead) => lead.id !== id)
    );
  }

  function importLeads(newLeads) {
    const existingContacts = new Set(
      leads.map((lead) => lead.contact)
    );

    const unique = newLeads.filter(
      (lead) =>
        lead.contact &&
        !existingContacts.has(lead.contact)
    );

    updateLeads([...leads, ...unique]);

    return unique.length;
  }

  function autoAssign() {
    let nextIndex = 0;

    const updated = leads.map((lead) => {
      if (lead.assignedTo) {
        return lead;
      }

      const agent =
        TEAM[nextIndex % TEAM.length];

      nextIndex += 1;

      return {
        ...lead,
        assignedTo: agent,
        status: "Assigned",
        updatedAt: new Date().toISOString(),
      };
    });

    updateLeads(updated);
  }

  const menus = MENU[user.role] || [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">F</div>

          <div>
            <strong>FIDDLEFITTLIFE</strong>
            <span>CRM SYSTEM</span>
          </div>
        </div>

        <div className="menu-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {menus.map(([label, icon]) => (
            <button
              key={label}
              className={
                page === label
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => setPage(label)}
            >
              <span className="nav-icon">
                {icon}
              </span>

              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="profile-avatar">
              {user.name.charAt(0)}
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              FIDDLEFITTLIFE
              <span>/</span>
              {page}
            </div>

            <h1>{page}</h1>
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">
              {user.name.charAt(0)}
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          {page === "Dashboard" && (
            <DashboardPage
              leads={leads}
              onLeads={() => setPage("Leads")}
            />
          )}

          {page === "Leads" && (
            <LeadsPage
              leads={leads}
              onImport={importLeads}
              onAssign={autoAssign}
              onUpdate={updateLead}
              onDelete={deleteLead}
            />
          )}

          {page === "Calling" && (
            <CallingPage
              user={user}
              leads={leads}
              onUpdate={updateLead}
            />
          )}

          {page === "Sales" && (
            <SalesPage
              leads={leads}
              onUpdate={updateLead}
            />
          )}

          {page === "Dietitian" && (
            <DietitianPage
              leads={leads}
              onUpdate={updateLead}
            />
          )}

          {page === "Reports" && (
            <ReportsPage leads={leads} />
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage({ leads, onLeads }) {
  const assigned = leads.filter(
    (lead) => lead.assignedTo
  ).length;

  const interested = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  const followups = leads.filter(
    (lead) => lead.status === "Follow-up"
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const notInterested = leads.filter(
    (lead) => lead.status === "Not Interested"
  ).length;

  return (
    <section>
      <PageHeader
        eyebrow="OVERVIEW"
        title="Admin Dashboard"
        description="Monitor your complete CRM performance from one centralized workspace."
        action={
          <button
            className="primary-button"
            onClick={onLeads}
          >
            Manage Leads
          </button>
        }
      />

      <div className="stats-grid">
        <StatCard
          label="Total Leads"
          value={leads.length}
          icon="♟"
        />

        <StatCard
          label="Assigned"
          value={assigned}
          icon="●"
        />

        <StatCard
          label="Interested"
          value={interested}
          icon="★"
        />

        <StatCard
          label="Follow-ups"
          value={followups}
          icon="◷"
        />

        <StatCard
          label="Converted"
          value={converted}
          icon="✓"
        />
      </div>

      <div className="dashboard-columns">
        <div className="panel">
          <PanelHeader
            title="Calling Team"
            subtitle="Current lead allocation"
          />

          {TEAM.map((agent) => {
            const agentLeads = leads.filter(
              (lead) =>
                lead.assignedTo === agent
            );

            const agentInterested =
              agentLeads.filter(
                (lead) =>
                  lead.status === "Interested"
              ).length;

            return (
              <div
                className="team-item"
                key={agent}
              >
                <div className="team-info">
                  <div className="team-avatar">
                    {agent.charAt(0)}
                  </div>

                  <div>
                    <strong>{agent}</strong>
                    <span>
                      Calling Executive
                    </span>
                  </div>
                </div>

                <div className="team-results">
                  <div>
                    <strong>
                      {agentLeads.length}
                    </strong>
                    <span>Leads</span>
                  </div>

                  <div>
                    <strong>
                      {agentInterested}
                    </strong>
                    <span>Interested</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel">
          <PanelHeader
            title="Lead Pipeline"
            subtitle="Current lead distribution"
          />

          <PipelineRow
            label="New"
            value={
              leads.filter(
                (lead) => lead.status === "New"
              ).length
            }
            total={leads.length}
          />

          <PipelineRow
            label="Interested"
            value={interested}
            total={leads.length}
          />

          <PipelineRow
            label="Follow-up"
            value={followups}
            total={leads.length}
          />

          <PipelineRow
            label="Converted"
            value={converted}
            total={leads.length}
          />

          <PipelineRow
            label="Not Interested"
            value={notInterested}
            total={leads.length}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LEADS
========================================================= */

function LeadsPage({
  leads,
  onImport,
  onAssign,
  onUpdate,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [agentFilter, setAgentFilter] =
    useState("All");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("success");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        `${lead.name} ${lead.contact}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        lead.status === statusFilter;

      const matchesAgent =
        agentFilter === "All" ||
        lead.assignedTo === agentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAgent
      );
    });
  }, [
    leads,
    search,
    statusFilter,
    agentFilter,
  ]);

  function showMessage(text, type = "success") {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  function downloadSample() {
    const rows = [
      {
        "Sr. No": 1,
        Name: "Rahul Sharma",
        Contact: "9876543210",
        Plan: "3 Months",
      },
      {
        "Sr. No": 2,
        Name: "Neha Singh",
        Contact: "9876543211",
        Plan: "1 Month",
      },
      {
        "Sr. No": 3,
        Name: "Amit Kumar",
        Contact: "9876543212",
        Plan: "6 Months",
      },
    ];

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leads"
    );

    XLSX.writeFile(
      workbook,
      "FiddleFittLife_Lead_Template.xlsx"
    );
  }

  async function importExcel(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const buffer =
        await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const firstSheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const rows =
        XLSX.utils.sheet_to_json(
          firstSheet,
          {
            defval: "",
          }
        );

      const imported = rows
        .map((row, index) => {
          const name =
            row.Name ||
            row.name ||
            row["Client Name"] ||
            row["Customer Name"] ||
            "";

          const rawContact =
            row.Contact ||
            row.contact ||
            row.Phone ||
            row.Mobile ||
            row["Phone Number"] ||
            "";

          const contact = String(rawContact)
            .replace(/\D/g, "")
            .slice(-10);

          const plan =
            row.Plan ||
            row.plan ||
            row["Package"] ||
            "";

          return {
            id: createId(),
            srNo:
              row["Sr. No"] ||
              row["Sr No"] ||
              row["sr. No"] ||
              index + 1,
            name: String(name).trim(),
            contact,
            plan: String(plan).trim(),
            assignedTo: "",
            status: "New",
            remarks: "",
            nextFollowUp: "",
            lastCall: "",
            createdAt:
              new Date().toISOString(),
            updatedAt:
              new Date().toISOString(),
          };
        })
        .filter(
          (lead) =>
            lead.name &&
            lead.contact.length === 10
        );

      if (imported.length === 0) {
        showMessage(
          "No valid leads found. Please check Name and Contact columns.",
          "error"
        );
        return;
      }

      const count = onImport(imported);

      showMessage(
        `${count} new lead${
          count === 1 ? "" : "s"
        } imported successfully.`
      );
    } catch {
      showMessage(
        "Excel import failed. Please check the file format.",
        "error"
      );
    }

    event.target.value = "";
  }

  return (
    <section>
      <PageHeader
        eyebrow="CRM DATABASE"
        title="Leads Management"
        description="Import, assign, search and manage your complete lead database."
        action={
          <div className="action-group">
            <button
              className="secondary-button"
              onClick={downloadSample}
            >
              Sample Excel
            </button>

            <label className="primary-button file-button">
              Import Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.xls,.csv"
                onChange={importExcel}
              />
            </label>

            <button
              className="dark-button"
              onClick={onAssign}
            >
              Auto Assign
            </button>
          </div>
        }
      />

      {message && (
        <div
          className={
            messageType === "error"
              ? "alert error-alert"
              : "alert success-alert"
          }
        >
          {message}
        </div>
      )}

      <div className="lead-summary">
        <SummaryItem
          label="Total Leads"
          value={leads.length}
        />

        <SummaryItem
          label="Assigned"
          value={
            leads.filter(
              (lead) => lead.assignedTo
            ).length
          }
        />

        <SummaryItem
          label="Interested"
          value={
            leads.filter(
              (lead) =>
                lead.status ===
                "Interested"
            ).length
          }
        />

        <SummaryItem
          label="Follow-ups"
          value={
            leads.filter(
              (lead) =>
                lead.status ===
                "Follow-up"
            ).length
          }
        />

        <SummaryItem
          label="Converted"
          value={
            leads.filter(
              (lead) =>
                lead.status ===
                "Converted"
            ).length
          }
        />
      </div>

      <div className="panel leads-panel">
        <div className="filter-bar">
          <div className="search-box">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search name or contact..."
            />
          </div>

          <select
            value={agentFilter}
            onChange={(event) =>
              setAgentFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Executives
            </option>

            {TEAM.map((agent) => (
              <option
                key={agent}
                value={agent}
              >
                {agent}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Status
            </option>

            {STATUS.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="panel-header table-title">
          <div>
            <h3>Lead Database</h3>
            <p>
              Showing {filtered.length} of{" "}
              {leads.length} leads
            </p>
          </div>

          <span className="live-indicator">
            <i />
            Database Active
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="♟"
            title="No Leads Found"
            text="Import an Excel file to start building your lead database."
          />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>SR. NO.</th>
                  <th>LEAD</th>
                  <th>CONTACT</th>
                  <th>PLAN</th>
                  <th>EXECUTIVE</th>
                  <th>STATUS</th>
                  <th>CREATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <span className="serial">
                        {lead.srNo}
                      </span>
                    </td>

                    <td>
                      <div className="lead-cell">
                        <div className="mini-avatar">
                          {lead.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {lead.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="phone">
                        {lead.contact}
                      </span>
                    </td>

                    <td>
                      {lead.plan || "-"}
                    </td>

                    <td>
                      <select
                        className="table-select"
                        value={
                          lead.assignedTo
                        }
                        onChange={(event) =>
                          onUpdate(
                            lead.id,
                            {
                              assignedTo:
                                event.target
                                  .value,
                              status:
                                event.target
                                  .value
                                  ? "Assigned"
                                  : "New",
                            }
                          )
                        }
                      >
                        <option value="">
                          Unassigned
                        </option>

                        {TEAM.map(
                          (agent) => (
                            <option
                              key={agent}
                              value={agent}
                            >
                              {agent}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      <select
                        className={`status-select status-${lead.status
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                        value={lead.status}
                        onChange={(event) =>
                          onUpdate(
                            lead.id,
                            {
                              status:
                                event.target
                                  .value,
                            }
                          )
                        }
                      >
                        {STATUS.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      {formatDate(
                        lead.createdAt
                      )}
                    </td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() =>
                          onDelete(
                            lead.id
                          )
                        }
                        title="Delete lead"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   CALLING
========================================================= */

function CallingPage({
  user,
  leads,
  onUpdate,
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] =
    useState(null);
  const [status, setStatus] =
    useState("Calling");
  const [remarks, setRemarks] =
    useState("");
  const [followUp, setFollowUp] =
    useState("");

  const myLeads = useMemo(
    () =>
      leads.filter(
        (lead) =>
          lead.assignedTo === user.name
      ),
    [leads, user.name]
  );

  const filtered = myLeads.filter(
    (lead) =>
      `${lead.name} ${lead.contact}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  const pending = myLeads.filter(
    (lead) =>
      [
        "New",
        "Assigned",
        "Calling",
        "No Answer",
      ].includes(lead.status)
  ).length;

  const interested = myLeads.filter(
    (lead) =>
      lead.status === "Interested"
  ).length;

  const followups = myLeads.filter(
    (lead) =>
      lead.status === "Follow-up"
  ).length;

  function openLead(lead) {
    setSelected(lead);

    setStatus(
      lead.status === "New" ||
        lead.status === "Assigned"
        ? "Calling"
        : lead.status
    );

    setRemarks(lead.remarks || "");
    setFollowUp(lead.nextFollowUp || "");
  }

  function saveCall() {
    if (!selected) return;

    onUpdate(selected.id, {
      status,
      remarks,
      nextFollowUp: followUp,
      lastCall: new Date().toISOString(),
    });

    setSelected(null);
  }

  return (
    <section>
      <PageHeader
        eyebrow="CALLING DESK"
        title={`Welcome, ${user.name}`}
        description="Manage your assigned leads and update every call outcome."
        action={
          <span className="today-badge">
            TODAY
          </span>
        }
      />

      <div className="stats-grid">
        <StatCard
          label="Assigned Leads"
          value={myLeads.length}
          icon="♟"
        />

        <StatCard
          label="Pending Calls"
          value={pending}
          icon="☎"
        />

        <StatCard
          label="Interested"
          value={interested}
          icon="★"
        />

        <StatCard
          label="Follow-ups"
          value={followups}
          icon="◷"
        />
      </div>

      <div className="panel">
        <div className="panel-header calling-header">
          <div>
            <h3>My Assigned Leads</h3>
            <p>
              {myLeads.length} leads assigned
              to you
            </p>
          </div>

          <div className="search-box calling-search">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search lead..."
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="☎"
            title="No Leads Assigned"
            text={`Leads assigned to ${user.name} will appear here.`}
          />
        ) : (
          <div className="calling-list">
            {filtered.map((lead) => (
              <div
                className="calling-row"
                key={lead.id}
              >
                <div className="lead-cell">
                  <div className="mini-avatar">
                    {lead.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="calling-name">
                    <strong>
                      {lead.name}
                    </strong>
                    <span>
                      {lead.contact}
                    </span>
                  </div>
                </div>

                <StatusBadge
                  status={lead.status}
                />

                <div className="meta-block">
                  <small>LAST CALL</small>
                  <span>
                    {formatDateTime(
                      lead.lastCall
                    )}
                  </span>
                </div>

                <div className="meta-block">
                  <small>FOLLOW-UP</small>
                  <span>
                    {formatDateTime(
                      lead.nextFollowUp
                    )}
                  </span>
                </div>

                <button
                  className="dark-button"
                  onClick={() =>
                    openLead(lead)
                  }
                >
                  Update
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <CallModal
          selected={selected}
          status={status}
          remarks={remarks}
          followUp={followUp}
          setStatus={setStatus}
          setRemarks={setRemarks}
          setFollowUp={setFollowUp}
          onClose={() =>
            setSelected(null)
          }
          onSave={saveCall}
        />
      )}
    </section>
  );
}

/* =========================================================
   SALES
========================================================= */

function SalesPage({ leads, onUpdate }) {
  const [search, setSearch] = useState("");

  const salesLeads = leads.filter(
    (lead) =>
      lead.status === "Interested" ||
      lead.status === "Follow-up" ||
      lead.status === "Converted"
  );

  const converted = leads.filter(
    (lead) =>
      lead.status === "Converted"
  ).length;

  const interested = leads.filter(
    (lead) =>
      lead.status === "Interested"
  ).length;

  const followups = leads.filter(
    (lead) =>
      lead.status === "Follow-up"
  ).length;

  const filtered = salesLeads.filter(
    (lead) =>
      `${lead.name} ${lead.contact}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (
    <section>
      <PageHeader
        eyebrow="SALES OPERATIONS"
        title="Sales Dashboard"
        description="Manage interested leads, follow-ups and conversions."
      />

      <div className="stats-grid">
        <StatCard
          label="Interested"
          value={interested}
          icon="★"
        />

        <StatCard
          label="Follow-ups"
          value={followups}
          icon="◷"
        />

        <StatCard
          label="Converted"
          value={converted}
          icon="✓"
        />

        <StatCard
          label="Conversion Rate"
          value={
            leads.length
              ? `${Math.round(
                  (converted /
                    leads.length) *
                    100
                )}%`
              : "0%"
          }
          icon="%"
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Sales Pipeline</h3>
            <p>
              Leads requiring sales action
            </p>
          </div>

          <div className="search-box">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search customer..."
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="₹"
            title="No Sales Leads"
            text="Interested and follow-up leads will appear here."
          />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>LEAD</th>
                  <th>CONTACT</th>
                  <th>PLAN</th>
                  <th>EXECUTIVE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-cell">
                        <div className="mini-avatar">
                          {lead.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {lead.name}
                        </strong>
                      </div>
                    </td>

                    <td>{lead.contact}</td>

                    <td>
                      {lead.plan || "-"}
                    </td>

                    <td>
                      {lead.assignedTo || "-"}
                    </td>

                    <td>
                      <select
                        className="table-select"
                        value={lead.status}
                        onChange={(event) =>
                          onUpdate(
                            lead.id,
                            {
                              status:
                                event.target
                                  .value,
                            }
                          )
                        }
                      >
                        <option value="Interested">
                          Interested
                        </option>
                        <option value="Follow-up">
                          Follow-up
                        </option>
                        <option value="Converted">
                          Converted
                        </option>
                        <option value="Lost">
                          Lost
                        </option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="small-primary"
                        onClick={() =>
                          onUpdate(
                            lead.id,
                            {
                              status:
                                "Converted",
                            }
                          )
                        }
                      >
                        Convert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   DIETITIAN
========================================================= */

function DietitianPage({ leads, onUpdate }) {
  const dietitianLeads = leads.filter(
    (lead) =>
      lead.status === "Converted"
  );

  const activeClients =
    dietitianLeads.length;

  const pendingPlans = dietitianLeads.filter(
    (lead) => !lead.dietStatus
  ).length;

  const completed = dietitianLeads.filter(
    (lead) =>
      lead.dietStatus === "Completed"
  ).length;

  return (
    <section>
      <PageHeader
        eyebrow="CLIENT OPERATIONS"
        title="Dietitian Dashboard"
        description="Manage converted clients and nutrition program progress."
      />

      <div className="stats-grid">
        <StatCard
          label="Active Clients"
          value={activeClients}
          icon="♧"
        />

        <StatCard
          label="Pending Plans"
          value={pendingPlans}
          icon="◷"
        />

        <StatCard
          label="Completed"
          value={completed}
          icon="✓"
        />
      </div>

      <div className="panel">
        <PanelHeader
          title="Client Management"
          subtitle="Converted customers"
        />

        {dietitianLeads.length === 0 ? (
          <EmptyState
            icon="♧"
            title="No Clients Yet"
            text="Converted leads will appear here for dietitian management."
          />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>CLIENT</th>
                  <th>CONTACT</th>
                  <th>PLAN</th>
                  <th>EXECUTIVE</th>
                  <th>DIET STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {dietitianLeads.map(
                  (lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className="lead-cell">
                          <div className="mini-avatar">
                            {lead.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {lead.name}
                          </strong>
                        </div>
                      </td>

                      <td>{lead.contact}</td>

                      <td>
                        {lead.plan || "-"}
                      </td>

                      <td>
                        {lead.assignedTo ||
                          "-"}
                      </td>

                      <td>
                        <span
                          className={
                            lead.dietStatus ===
                            "Completed"
                              ? "badge badge-converted"
                              : "badge badge-follow-up"
                          }
                        >
                          {lead.dietStatus ||
                            "Pending"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="small-primary"
                          onClick={() =>
                            onUpdate(
                              lead.id,
                              {
                                dietStatus:
                                  lead.dietStatus ===
                                  "Completed"
                                    ? "Pending"
                                    : "Completed",
                              }
                            )
                          }
                        >
                          {lead.dietStatus ===
                          "Completed"
                            ? "Mark Pending"
                            : "Complete"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function ReportsPage({ leads }) {
  const total = leads.length;

  const statusCount = STATUS.map(
    (status) => ({
      status,
      count: leads.filter(
        (lead) =>
          lead.status === status
      ).length,
    })
  );

  const converted = leads.filter(
    (lead) =>
      lead.status === "Converted"
  ).length;

  const interested = leads.filter(
    (lead) =>
      lead.status === "Interested"
  ).length;

  const conversionRate =
    total > 0
      ? Math.round(
          (converted / total) * 100
        )
      : 0;

  function exportReport() {
    const rows = leads.map((lead) => ({
      Name: lead.name,
      Contact: lead.contact,
      Plan: lead.plan || "",
      Executive: lead.assignedTo || "",
      Status: lead.status,
      Remarks: lead.remarks || "",
      "Last Call": formatDateTime(
        lead.lastCall
      ),
      "Next Follow-up":
        formatDateTime(
          lead.nextFollowUp
        ),
      Created: formatDate(
        lead.createdAt
      ),
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "CRM Report"
    );

    XLSX.writeFile(
      workbook,
      "FiddleFittLife_CRM_Report.xlsx"
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="ANALYTICS"
        title="Reports & Analytics"
        description="Review lead performance, pipeline distribution and conversion results."
        action={
          <button
            className="primary-button"
            onClick={exportReport}
          >
            Export Excel
          </button>
        }
      />

      <div className="stats-grid">
        <StatCard
          label="Total Leads"
          value={total}
          icon="♟"
        />

        <StatCard
          label="Interested"
          value={interested}
          icon="★"
        />

        <StatCard
          label="Converted"
          value={converted}
          icon="✓"
        />

        <StatCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          icon="%"
        />
      </div>

      <div className="report-grid">
        <div className="panel">
          <PanelHeader
            title="Status Report"
            subtitle="Lead distribution by status"
          />

          <div className="report-list">
            {statusCount.map((item) => {
              const percentage =
                total > 0
                  ? Math.round(
                      (item.count /
                        total) *
                        100
                    )
                  : 0;

              return (
                <div
                  className="report-row"
                  key={item.status}
                >
                  <div className="report-label">
                    <span>
                      {item.status}
                    </span>
                    <strong>
                      {item.count}
                    </strong>
                  </div>

                  <div className="report-track">
                    <div
                      className="report-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <PanelHeader
            title="Executive Performance"
            subtitle="Lead allocation"
          />

          {TEAM.map((agent) => {
            const agentTotal =
              leads.filter(
                (lead) =>
                  lead.assignedTo ===
                  agent
              ).length;

            const agentConverted =
              leads.filter(
                (lead) =>
                  lead.assignedTo ===
                    agent &&
                  lead.status ===
                    "Converted"
              ).length;

            return (
              <div
                className="performance-row"
                key={agent}
              >
                <div className="team-info">
                  <div className="team-avatar">
                    {agent.charAt(0)}
                  </div>

                  <div>
                    <strong>{agent}</strong>
                    <span>
                      {agentTotal} assigned
                    </span>
                  </div>
                </div>

                <div className="performance-result">
                  <strong>
                    {agentConverted}
                  </strong>
                  <span>Converted</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CALL MODAL
========================================================= */

function CallModal({
  selected,
  status,
  remarks,
  followUp,
  setStatus,
  setRemarks,
  setFollowUp,
  onClose,
  onSave,
}) {
  return (
    <div className="modal-overlay">
      <div className="call-modal">
        <div className="modal-header">
          <div>
            <span className="section-label">
              CALL UPDATE
            </span>

            <h2>{selected.name}</h2>

            <p>{selected.contact}</p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <label>Call Status</label>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          {STATUS.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <label>Remarks</label>

        <textarea
          rows="5"
          value={remarks}
          onChange={(event) =>
            setRemarks(event.target.value)
          }
          placeholder="Enter call remarks..."
        />

        <label>Next Follow-up</label>

        <input
          type="datetime-local"
          value={followUp}
          onChange={(event) =>
            setFollowUp(event.target.value)
          }
        />

        <button
          className="primary-button full-button"
          onClick={onSave}
        >
          Save Call Result
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="page-header">
      <div>
        <span className="section-label">
          {eyebrow}
        </span>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      {action && (
        <div className="page-header-action">
          {action}
        </div>
      )}
    </div>
  );
}

function PanelHeader({
  title,
  subtitle,
}) {
  return (
    <div className="panel-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">
          {icon}
        </div>

        <span className="live-pill">
          LIVE
        </span>
      </div>

      <strong className="stat-value">
        {value}
      </strong>

      <span className="stat-label">
        {label}
      </span>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PipelineRow({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;

  return (
    <div className="pipeline-item">
      <div className="pipeline-heading">
        <span>{label}</span>
        <strong>
          {value}{" "}
          <small>
            ({percentage}%)
          </small>
        </strong>
      </div>

      <div className="pipeline-bar">
        <div
          className="pipeline-progress"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const className = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span
      className={`badge badge-${className}`}
    >
      {status}
    </span>
  );
}

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

export default App;