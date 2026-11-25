import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const KEY = "simplifyd.launchpad.v1";
const lanes = ["Backlog", "In progress", "Shipped"];
const initial = [
  {
    id: "1",
    title: "Give the new brand a voice",
    category: "Design",
    status: "Shipped",
    description: "A warm, confident identity for the next chapter.",
  },
  {
    id: "2",
    title: "Build the first customer journey",
    category: "Engineering",
    status: "In progress",
    description: "From the first click to the first little win.",
  },
  {
    id: "3",
    title: "Find our first 100 explorers",
    category: "Growth",
    status: "Backlog",
    description: "Invite the curious. Make every conversation count.",
  },
  {
    id: "4",
    title: "Ship the landing page",
    category: "Engineering",
    status: "Shipped",
    description: "Fast, accessible, and ready for the big reveal.",
  },
  {
    id: "5",
    title: "Make the onboarding feel magical",
    category: "Design",
    status: "In progress",
    description: "Less setup. More aha.",
  },
  {
    id: "6",
    title: "Write the launch story",
    category: "Growth",
    status: "Backlog",
    description: "Tell people what we made and why it matters.",
  },
];
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (
      Array.isArray(saved) &&
      saved.length <= 500 &&
      saved.every(
        (t) =>
          t &&
          typeof t.id === "string" &&
          typeof t.title === "string" &&
          typeof t.description === "string" &&
          ["Design", "Engineering", "Growth"].includes(t.category) &&
          lanes.includes(t.status),
      )
    )
      return saved;
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  return initial;
}
function App() {
  const [tasks, setTasks] = useState(load);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All work");
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);
  function update(next) {
    setTasks(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  function add(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = data.get("title").trim();
    if (!title) return;
    update([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title,
        description: data.get("description").trim(),
        category: data.get("category"),
        status: "Backlog",
      },
    ]);
    setAdding(false);
    setSearch("");
    setCategory("All work");
    setNotice("New task added to Backlog.");
  }
  const shipped = tasks.filter((t) => t.status === "Shipped").length;
  const percent = tasks.length ? Math.round((shipped / tasks.length) * 100) : 0;
  const visible = tasks.filter(
    (t) =>
      (category === "All work" || t.category === category) &&
      `${t.title} ${t.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function exportTasks() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "launchpad-tasks.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Board exported as JSON.");
  }
  return (
    <div className="app">
      <aside className="sidebar">
        <a href="#main" className="brand">
          <span className="brand-icon">↗</span> launchpad
          <span className="brand-dot">.</span>
        </a>
        <div className="workspace">
          <span className="avatar">O</span>
          <div>
            Orbit studio<small>Your next big thing</small>
          </div>
        </div>
        <p className="eyebrow">WORKSPACE</p>
        <a className="nav active" href="#main">
          ▦ <span>Launch board</span>
          <span className="count">{tasks.length}</span>
        </a>
        <a className="nav" href="#progress">
          ◔ <span>Mission progress</span>
        </a>
        <div className="sidebar-bottom">
          <div className="cloud-dot" />A Simplifyd Cloud sample
          <small>React + Vite · Made to make yours</small>
          <a href="https://github.com/SimplifydCloud/sample-react-launchpad">
            Explore the source ↗
          </a>
        </div>
      </aside>
      <main id="main">
        <header>
          <span>
            Orbit studio <span className="muted">/</span> Launch board
          </span>
          <span className="local-badge">● Saved in this browser</span>
        </header>
        <section className="intro">
          <div>
            <p className="eyebrow">MISSION CONTROL / 001</p>
            <h1>
              Small steps.
              <br />
              <span>Extraordinary launches.</span>
            </h1>
            <p>A little focus, a good crew, and one thing shipped at a time.</p>
          </div>
          <button className="primary" onClick={() => setAdding(!adding)}>
            {adding ? "Close form" : "+ New task"}
          </button>
        </section>
        <section className="mission" id="progress">
          <div className="orbit-art" aria-hidden="true">
            <div className="planet" />
            <i />
            <b>✦</b>
          </div>
          <div className="mission-copy">
            <span className="eyebrow">THE NEXT CHAPTER</span>
            <h2>From idea to out in the world.</h2>
            <p>Your launch is taking shape. Keep the momentum going.</p>
            <div className="progress-label">
              <span>Launch readiness</span>
              <strong>{percent}%</strong>
            </div>
            <progress value={percent} max="100" aria-label="Launch readiness" />
          </div>
          <div className="mission-stat">
            <strong>
              {shipped}
              <span>/{tasks.length}</span>
            </strong>
            <p>tasks in orbit</p>
            <span className="pill">✦ Every step counts</span>
          </div>
        </section>
        <div
          role="status"
          className={notice || storageError ? "notice" : "sr-only"}
        >
          {storageError
            ? "Storage unavailable. Changes last until this tab closes."
            : notice}
        </div>
        {adding && (
          <form className="task-form" onSubmit={add}>
            <h2>What are we shipping next?</h2>
            <div className="form-row">
              <label>
                Task title
                <input
                  name="title"
                  autoFocus
                  required
                  maxLength="100"
                  placeholder="Make something people love"
                />
              </label>
              <label>
                Team
                <select name="category">
                  <option>Design</option>
                  <option>Engineering</option>
                  <option>Growth</option>
                </select>
              </label>
            </div>
            <label>
              Description
              <textarea
                name="description"
                maxLength="240"
                rows="2"
                placeholder="A little context goes a long way."
              />
            </label>
            <button className="primary">Add to backlog</button>
          </form>
        )}
        <div className="board-toolbar">
          <div>
            <h2>
              The launch board <span>{tasks.length}</span>
            </h2>
            <p>A home for every big idea and small detail.</p>
          </div>
          <button className="secondary" onClick={exportTasks}>
            Export board ↓
          </button>
        </div>
        <div className="filters">
          <div className="tabs" role="group" aria-label="Filter by team">
            {["All work", "Design", "Engineering", "Growth"].map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                className={category === c ? "selected" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            className="search"
            aria-label="Search tasks"
            type="search"
            placeholder="Search the mission…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="board">
          {lanes.map((lane, i) => (
            <section className="lane" key={lane}>
              <h3>
                <span className={`lane-dot dot-${i}`} />
                {lane}
                <span className="lane-count">
                  {visible.filter((t) => t.status === lane).length}
                </span>
              </h3>
              {visible
                .filter((t) => t.status === lane)
                .map((t) => (
                  <article className="task" key={t.id}>
                    <span className={`tag ${t.category.toLowerCase()}`}>
                      {t.category}
                    </span>
                    <h4>{t.title}</h4>
                    <p>{t.description}</p>
                    <div className="card-footer">
                      <label className="move-label">
                        Move to
                        <select
                          aria-label={`Status for ${t.title}`}
                          value={t.status}
                          onChange={(e) => {
                            update(
                              tasks.map((x) =>
                                x.id === t.id
                                  ? { ...x, status: e.target.value }
                                  : x,
                              ),
                            );
                            setNotice(`${t.title} moved to ${e.target.value}.`);
                          }}
                        >
                          {lanes.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="delete"
                        aria-label={`Delete ${t.title}`}
                        onClick={() => {
                          update(tasks.filter((x) => x.id !== t.id));
                          setNotice("Task deleted.");
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </article>
                ))}
              {!visible.some((t) => t.status === lane) && (
                <div className="empty">Room for the next big thing.</div>
              )}
            </section>
          ))}
        </div>
        <footer>
          <span>Built with React. Ready for your next idea.</span>
          <button
            onClick={() => {
              if (confirm("Reset this board to the demo tasks?")) {
                update(initial);
                setSearch("");
                setCategory("All work");
                setNotice("Demo board restored.");
              }
            }}
          >
            Reset demo
          </button>
        </footer>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
