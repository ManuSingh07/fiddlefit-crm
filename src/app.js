import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

const TEAM = ["Abhishek", "Rudransh", "Lakshya"];

const USERS = [
  {
    email: "admin@fiddlefittlife.com",
    password: "admin123",
    role: "Admin",
    name: "Admin"
  },
  {
    email: "abhishek@fiddlefittlife.com",
    password: "123456",
    role: "Calling Executive",
    name: "Abhishek"
  },
  {
    email: "rudransh@fiddlefittlife.com",
    password: "123456",
    role: "Calling Executive",
    name: "Rudransh"
  },
  {
    email: "lakshya@fiddlefittlife.com",
    password: "123456",
    role: "Calling Executive",
    name: "Lakshya"
  },
  {
    email: "sales@fiddlefittlife.com",
    password: "sales123",
    role: "Sales Person",
    name: "Sales"
  },
  {
    email: "dietitian@fiddlefittlife.com",
    password: "dietitian123",
    role: "Dietitian",
    name: "Dietitian"
  }
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
  "Lost"
];

function getLeads() {
  try {
    const saved = localStorage.getItem("fiddlefittlife_leads");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveLeads(leads) {
  localStorage.setItem(
    "fiddlefittlife_leads",
    JSON.stringify(leads)
  );
}

function App() {
  const [user, setUser] = useState(null);

  if (user === null) {
    return React.createElement(Login, {
      onLogin: setUser
    });
  }

  return React.createElement(CRM, {
    user: user,
    logout: function () {
      setUser(null);
    }
  });
}

/* =====================================================
   LOGIN
===================================================== */

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login(event) {
    event.preventDefault();

    const foundUser = USERS.find(function (item) {
      return (
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
      );
    });

    if (!foundUser) {
      setError("Invalid email or password");
      return;
    }

    setError("");
    onLogin(foundUser);
  }

  return React.createElement(
    "div",
    { className: "login-page" },

    React.createElement(
      "div",
      { className: "login-card" },

      React.createElement(
        "div",
        { className: "logo" },
        "F"
      ),

      React.createElement(
        "h1",
        null,
        "FIDDLEFITTLIFE"
      ),

      React.createElement(
        "p",
        { className: "subtitle" },
        "CENTRALIZED CRM SYSTEM"
      ),

      React.createElement(
        "form",
        { onSubmit: login },

        React.createElement(
          "label",
          null,
          "Email / Employee ID"
        ),

        React.createElement("input", {
          type: "text",
          value: email,
          placeholder: "Enter email",
          onChange: function (event) {
            setEmail(event.target.value);
          },
          required: true
        }),

        React.createElement(
          "label",
          null,
          "Password"
        ),

        React.createElement("input", {
          type: "password",
          value: password,
          placeholder: "Enter password",
          onChange: function (event) {
            setPassword(event.target.value);
          },
          required: true
        }),

        error &&
          React.createElement(
            "div",
            { className: "error" },
            "⚠ ",
            error
          ),

        React.createElement(
          "button",
          {
            type: "submit",
            className: "primary-button"
          },
          "Sign In"
        )
      ),

      React.createElement(
        "div",
        { className: "demo-box" },

        React.createElement(
          "h3",
          null,
          "Demo Accounts"
        ),

        USERS.map(function (item) {
          return React.createElement(
            "button",
            {
              key: item.email,
              className: "demo-account",
              onClick: function () {
                setEmail(item.email);
                setPassword(item.password);
              }
            },

            React.createElement(
              "strong",
              null,
              item.name
            ),

            React.createElement(
              "small",
              null,
              item.role
            )
          );
        })
      )
    )
  );
}

/* =====================================================
   CRM
===================================================== */

function CRM({ user, logout }) {
  const defaultPage =
    user.role === "Calling Executive"
      ? "Calling"
      : "Dashboard";

  const [page, setPage] = useState(defaultPage);
  const [leads, setLeads] = useState(getLeads);

  function updateLeads(newLeads) {
    setLeads(newLeads);
    saveLeads(newLeads);
  }

  function updateLead(id, changes) {
    const current = getLeads();

    const updated = current.map(function (lead) {
      if (lead.id === id) {
        return {
          ...lead,
          ...changes,
          updatedAt: new Date().toISOString()
        };
      }

      return lead;
    });

    updateLeads(updated);
  }

  function importLeads(newLeads) {
    const current = getLeads();

    const contacts = new Set(
      current.map(function (lead) {
        return lead.contact;
      })
    );

    const unique = newLeads.filter(function (lead) {
      return !contacts.has(lead.contact);
    });

    updateLeads(current.concat(unique));

    return unique.length;
  }

  function autoAssign() {
    const current = getLeads();

    let index = 0;

    const updated = current.map(function (lead) {
      if (lead.assignedTo) {
        return lead;
      }

      const agent = TEAM[index % TEAM.length];

      index++;

      return {
        ...lead,
        assignedTo: agent,
        status: "Assigned"
      };
    });

    updateLeads(updated);
  }

  function deleteLead(id) {
    const confirmed = window.confirm(
      "Delete this lead permanently?"
    );

    if (!confirmed) {
      return;
    }

    const updated = getLeads().filter(function (lead) {
      return lead.id !== id;
    });

    updateLeads(updated);
  }

  let menuItems = [];

  if (user.role === "Admin") {
    menuItems = [
      "Dashboard",
      "Leads",
      "Calling",
      "Sales",
      "Dietitian",
      "Reports"
    ];
  } else if (user.role === "Calling Executive") {
    menuItems = ["Calling", "Reports"];
  } else if (user.role === "Sales Person") {
    menuItems = ["Sales", "Reports"];
  } else if (user.role === "Dietitian") {
    menuItems = ["Dietitian", "Reports"];
  }

  let content = null;

  if (page === "Dashboard") {
    content = React.createElement(AdminDashboard, {
      leads: leads,
      goLeads: function () {
        setPage("Leads");
      }
    });
  }

  if (page === "Leads") {
    content = React.createElement(Leads, {
      leads: leads,
      importLeads: importLeads,
      autoAssign: autoAssign,
      updateLead: updateLead,
      deleteLead: deleteLead
    });
  }

  if (page === "Calling") {
    content = React.createElement(Calling, {
      user: user,
      leads: leads,
      updateLead: updateLead
    });
  }

  if (
    page === "Sales" ||
    page === "Dietitian" ||
    page === "Reports"
  ) {
    content = React.createElement(Placeholder, {
      title: page
    });
  }

  return React.createElement(
    "div",
    { className: "crm" },

    React.createElement(
      "header",
      { className: "topbar" },

      React.createElement(
        "div",
        { className: "brand" },
        React.createElement(
          "div",
          { className: "small-logo" },
          "F"
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "strong",
            null,
            "FIDDLEFITTLIFE"
          ),
          React.createElement(
            "span",
            null,
            "CRM SYSTEM"
          )
        )
      ),

      React.createElement(
        "div",
        { className: "user-area" },

        React.createElement(
          "span",
          null,
          user.name,
          " • ",
          user.role
        ),

        React.createElement(
          "button",
          {
            className: "logout",
            onClick: logout
          },
          "Logout"
        )
      )
    ),

    React.createElement(
      "div",
      { className: "crm-body" },

      React.createElement(
        "aside",
        { className: "sidebar" },

        React.createElement(
          "div",
          { className: "menu-title" },
          "MENU"
        ),

        menuItems.map(function (item) {
          return React.createElement(
            "button",
            {
              key: item,
              className:
                page === item
                  ? "nav-button active"
                  : "nav-button",
              onClick: function () {
                setPage(item);
              }
            },
            item
          );
        })
      ),

      React.createElement(
        "main",
        { className: "content" },
        content
      )
    )
  );
}

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function AdminDashboard({ leads, goLeads }) {
  const assigned = leads.filter(function (lead) {
    return lead.assignedTo;
  }).length;

  const interested = leads.filter(function (lead) {
    return lead.status === "Interested";
  }).length;

  const followups = leads.filter(function (lead) {
    return lead.status === "Follow-up";
  }).length;

  const converted = leads.filter(function (lead) {
    return lead.status === "Converted";
  }).length;

  return React.createElement(
    "div",
    null,

    React.createElement(
      "div",
      { className: "page-header" },

      React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          "Admin Dashboard"
        ),
        React.createElement(
          "p",
          null,
          "Complete CRM overview"
        )
      ),

      React.createElement(
        "button",
        {
          className: "primary-button small",
          onClick: goLeads
        },
        "+ Manage Leads"
      )
    ),

    React.createElement(
      "div",
      { className: "cards" },

      React.createElement(Card, {
        title: "Total Leads",
        value: leads.length,
        icon: "👥"
      }),

      React.createElement(Card, {
        title: "Assigned",
        value: assigned,
        icon: "📌"
      }),

      React.createElement(Card, {
        title: "Interested",
        value: interested,
        icon: "⭐"
      }),

      React.createElement(Card, {
        title: "Follow-ups",
        value: followups,
        icon: "🔔"
      }),

      React.createElement(Card, {
        title: "Converted",
        value: converted,
        icon: "✅"
      })
    ),

    React.createElement(
      "div",
      { className: "panel" },

      React.createElement(
        "h2",
        null,
        "Calling Team"
      ),

      TEAM.map(function (agent) {
        const count = leads.filter(function (lead) {
          return lead.assignedTo === agent;
        }).length;

        return React.createElement(
          "div",
          {
            key: agent,
            className: "team-row"
          },

          React.createElement(
            "strong",
            null,
            agent
          ),

          React.createElement(
            "span",
            null,
            count,
            " Leads"
          )
        );
      })
    )
  );
}

/* =====================================================
   LEADS
===================================================== */

function Leads({
  leads,
  importLeads,
  autoAssign,
  updateLead,
  deleteLead
}) {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    function () {
      const query = search.toLowerCase();

      return leads.filter(function (lead) {
        return (
          String(lead.name)
            .toLowerCase()
            .includes(query) ||
          String(lead.contact)
            .toLowerCase()
            .includes(query)
        );
      });
    },
    [leads, search]
  );

  function downloadSample() {
    const rows = [
      {
        "Sr. No": 1,
        Name: "Rahul Sharma",
        Contact: "9876543210"
      },
      {
        "Sr. No": 2,
        Name: "Neha Singh",
        Contact: "9876543211"
      },
      {
        "Sr. No": 3,
        Name: "Amit Kumar",
        Contact: "9876543212"
      }
    ];

    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      sheet,
      "Leads"
    );

    XLSX.writeFile(
      workbook,
      "FiddleFittLife_Sample.xlsx"
    );
  }

  async function handleExcel(event) {
    const file = event.target.files
      ? event.target.files[0]
      : null;

    if (!file) {
      return;
    }

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array"
      });

      const firstSheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(
        firstSheet,
        {
          defval: ""
        }
      );

      const newLeads = rows
        .map(function (row, index) {
          const name =
            row.Name ||
            row.name ||
            row.NAME ||
            "";

          const rawContact =
            row.Contact ||
            row.contact ||
            row.CONTACT ||
            row.Phone ||
            row.phone ||
            "";

          const contact = String(rawContact)
            .replace(/\D/g, "")
            .slice(-10);

          return {
            id:
              Date.now() +
              index +
              Math.floor(Math.random() * 1000),

            srNo:
              row["Sr. No"] ||
              row["Sr No"] ||
              row["sr. No"] ||
              index + 1,

            name: String(name).trim(),

            contact: contact,

            assignedTo: "",

            status: "New",

            remarks: "",

            nextFollowUp: "",

            lastCall: "",

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString()
          };
        })
        .filter(function (lead) {
          return (
            lead.name &&
            lead.contact.length === 10
          );
        });

      const count = importLeads(newLeads);

      setMessage(
        count +
          " new leads imported successfully."
      );

      event.target.value = "";
    } catch (error) {
      console.error(error);
      setMessage("Excel import failed.");
    }
  }

  return React.createElement(
    "div",
    null,

    React.createElement(
      "div",
      { className: "page-header" },

      React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          "Leads Management"
        ),

        React.createElement(
          "p",
          null,
          "Import, assign and manage your leads."
        )
      )
    ),

    React.createElement(
      "div",
      { className: "actions" },

      React.createElement(
        "button",
        {
          className: "secondary-button",
          onClick: downloadSample
        },
        "📄 Sample Excel"
      ),

      React.createElement(
        "label",
        { className: "primary-button file-button" },
        "📥 Import Excel",

        React.createElement("input", {
          type: "file",
          accept: ".xlsx,.xls,.csv",
          hidden: true,
          onChange: handleExcel
        })
      ),

      React.createElement(
        "button",
        {
          className: "primary-button auto-button",
          onClick: autoAssign
        },
        "⚡ Auto Assign"
      )
    ),

    message &&
      React.createElement(
        "div",
        { className: "success-message" },
        "✓ ",
        message
      ),

    React.createElement("input", {
      className: "search",
      type: "text",
      placeholder: "Search name or contact...",
      value: search,
      onChange: function (event) {
        setSearch(event.target.value);
      }
    }),

    React.createElement(
      "div",
      { className: "table-panel" },

      React.createElement(
        "div",
        { className: "table-header" },

        React.createElement(
          "div",
          null,
          React.createElement(
            "h2",
            null,
            "Lead Database"
          ),

          React.createElement(
            "span",
            null,
            filtered.length,
            " leads"
          )
        )
      ),

      filtered.length === 0
        ? React.createElement(
            "div",
            { className: "empty" },
            "👥",
            React.createElement(
              "h3",
              null,
              "No Leads Found"
            ),
            React.createElement(
              "p",
              null,
              "Import an Excel file to add leads."
            )
          )
        : React.createElement(
            "div",
            { className: "table-wrapper" },

            React.createElement(
              "table",
              null,

              React.createElement(
                "thead",
                null,

                React.createElement(
                  "tr",
                  null,

                  React.createElement("th", null, "Sr. No"),
                  React.createElement("th", null, "Name"),
                  React.createElement("th", null, "Contact"),
                  React.createElement("th", null, "Assigned"),
                  React.createElement("th", null, "Status"),
                  React.createElement("th", null, "Action")
                )
              ),

              React.createElement(
                "tbody",
                null,

                filtered.map(function (lead) {
                  return React.createElement(
                    "tr",
                    { key: lead.id },

                    React.createElement(
                      "td",
                      null,
                      lead.srNo
                    ),

                    React.createElement(
                      "td",
                      null,
                      React.createElement(
                        "strong",
                        null,
                        lead.name
                      )
                    ),

                    React.createElement(
                      "td",
                      null,
                      lead.contact
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "select",
                        {
                          value: lead.assignedTo || "",
                          onChange: function (event) {
                            const value =
                              event.target.value;

                            updateLead(
                              lead.id,
                              {
                                assignedTo: value,
                                status: value
                                  ? "Assigned"
                                  : "New"
                              }
                            );
                          }
                        },

                        React.createElement(
                          "option",
                          { value: "" },
                          "Unassigned"
                        ),

                        TEAM.map(function (agent) {
                          return React.createElement(
                            "option",
                            {
                              key: agent,
                              value: agent
                            },
                            agent
                          );
                        })
                      )
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "select",
                        {
                          value: lead.status || "New",
                          onChange: function (event) {
                            updateLead(
                              lead.id,
                              {
                                status:
                                  event.target.value
                              }
                            );
                          }
                        },

                        STATUS.map(function (item) {
                          return React.createElement(
                            "option",
                            {
                              key: item,
                              value: item
                            },
                            item
                          );
                        })
                      )
                    ),

                    React.createElement(
                      "td",
                      null,

                      React.createElement(
                        "button",
                        {
                          className: "delete-button",
                          onClick: function () {
                            deleteLead(lead.id);
                          }
                        },
                        "🗑"
                      )
                    )
                  );
                })
              )
            )
          )
    )
  );
}

/* =====================================================
   CALLING
===================================================== */

function Calling({
  user,
  leads,
  updateLead
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [status, setStatus] = useState("Calling");

  const myLeads = useMemo(
    function () {
      return leads.filter(function (lead) {
        return lead.assignedTo === user.name;
      });
    },
    [leads, user.name]
  );

  const filtered = myLeads.filter(function (lead) {
    const query = search.toLowerCase();

    return (
      String(lead.name)
        .toLowerCase()
        .includes(query) ||
      String(lead.contact)
        .toLowerCase()
        .includes(query)
    );
  });

  const pending = myLeads.filter(function (lead) {
    return [
      "New",
      "Assigned",
      "Calling",
      "No Answer"
    ].includes(lead.status);
  }).length;

  const interested = myLeads.filter(function (lead) {
    return lead.status === "Interested";
  }).length;

  const followups = myLeads.filter(function (lead) {
    return lead.status === "Follow-up";
  }).length;

  function openCall(lead) {
    setSelected(lead);

    setRemarks(lead.remarks || "");

    setFollowUp(lead.nextFollowUp || "");

    if (
      lead.status === "New" ||
      lead.status === "Assigned"
    ) {
      setStatus("Calling");
    } else {
      setStatus(lead.status);
    }
  }

  function saveCall() {
    if (!selected) {
      return;
    }

    updateLead(selected.id, {
      status: status,
      remarks: remarks,
      nextFollowUp: followUp,
      lastCall: new Date().toLocaleString("en-IN")
    });

    setSelected(null);
    setRemarks("");
    setFollowUp("");
    setStatus("Calling");
  }

  return React.createElement(
    "div",
    null,

    React.createElement(
      "div",
      { className: "page-header" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "h1",
          null,
          "Calling Dashboard"
        ),

        React.createElement(
          "p",
          null,
          "Welcome, ",
          React.createElement(
            "strong",
            null,
            user.name
          )
        )
      )
    ),

    React.createElement(
      "div",
      { className: "cards" },

      React.createElement(Card, {
        title: "Assigned Leads",
        value: myLeads.length,
        icon: "👥"
      }),

      React.createElement(Card, {
        title: "Pending Calls",
        value: pending,
        icon: "📞"
      }),

      React.createElement(Card, {
        title: "Interested",
        value: interested,
        icon: "⭐"
      }),

      React.createElement(Card, {
        title: "Follow-ups",
        value: followups,
        icon: "🔔"
      })
    ),

    React.createElement(
      "div",
      { className: "table-panel" },

      React.createElement(
        "div",
        { className: "table-header calling-header" },

        React.createElement(
          "h2",
          null,
          "My Assigned Leads"
        ),

        React.createElement("input", {
          className: "search calling-search",
          placeholder: "Search lead...",
          value: search,
          onChange: function (event) {
            setSearch(event.target.value);
          }
        })
      ),

      filtered.length === 0
        ? React.createElement(
            "div",
            { className: "empty" },
            "📞",
            React.createElement(
              "h3",
              null,
              "No Leads Assigned"
            ),
            React.createElement(
              "p",
              null,
              "Admin se lead assign hone ke baad yahan show hogi."
            )
          )
        : React.createElement(
            "div",
            { className: "calling-list" },

            filtered.map(function (lead) {
              return React.createElement(
                "div",
                {
                  className: "calling-row",
                  key: lead.id
                },

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "strong",
                    null,
                    lead.name
                  ),

                  React.createElement(
                    "small",
                    null,
                    "📱 ",
                    lead.contact
                  )
                ),

                React.createElement(
                  "span",
                  { className: "status" },
                  lead.status
                ),

                React.createElement(
                  "small",
                  null,
                  "Last Call: ",
                  lead.lastCall || "Not Called"
                ),

                React.createElement(
                  "button",
                  {
                    className: "primary-button small",
                    onClick: function () {
                      openCall(lead);
                    }
                  },
                  "📞 Update"
                )
              );
            })
          )
    ),

    selected &&
      React.createElement(
        "div",
        { className: "modal-overlay" },

        React.createElement(
          "div",
          { className: "modal" },

          React.createElement(
            "div",
            { className: "modal-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Call Update"
              ),

              React.createElement(
                "p",
                null,
                selected.name,
                " • ",
                selected.contact
              )
            ),

            React.createElement(
              "button",
              {
                className: "close-button",
                onClick: function () {
                  setSelected(null);
                }
              },
              "×"
            )
          ),

          React.createElement(
            "label",
            null,
            "Call Status"
          ),

          React.createElement(
            "select",
            {
              value: status,
              onChange: function (event) {
                setStatus(event.target.value);
              }
            },

            STATUS.map(function (item) {
              return React.createElement(
                "option",
                {
                  key: item,
                  value: item
                },
                item
              );
            })
          ),

          React.createElement(
            "label",
            null,
            "Remarks"
          ),

          React.createElement("textarea", {
            rows: 4,
            value: remarks,
            placeholder: "Enter call remarks...",
            onChange: function (event) {
              setRemarks(event.target.value);
            }
          }),

          React.createElement(
            "label",
            null,
            "Next Follow-up"
          ),

          React.createElement("input", {
            type: "datetime-local",
            value: followUp,
            onChange: function (event) {
              setFollowUp(event.target.value);
            }
          }),

          React.createElement(
            "button",
            {
              className: "primary-button",
              onClick: saveCall
            },
            "✓ Save Call Result"
          )
        )
      )
  );
}

/* =====================================================
   CARD
===================================================== */

function Card({ title, value, icon }) {
  return React.createElement(
    "div",
    { className: "card" },

    React.createElement(
      "div",
      { className: "card-icon" },
      icon
    ),

    React.createElement(
      "h2",
      null,
      value
    ),

    React.createElement(
      "span",
      null,
      title
    )
  );
}

/* =====================================================
   PLACEHOLDER
===================================================== */

function Placeholder({ title }) {
  return React.createElement(
    "div",
    { className: "placeholder" },

    React.createElement(
      "div",
      { className: "placeholder-icon" },
      "🔧"
    ),

    React.createElement(
      "h1",
      null,
      title
    ),

    React.createElement(
      "p",
      null,
      "This module will be added next."
    )
  );
}

export default App;