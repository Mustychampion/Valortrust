/**
 * Unified backend for BOTH apps (ValorTrust + Portfolio).
 *
 * Both frontends previously talked to Supabase directly and there was no
 * shared server. This single Express server now acts as the "main backend"
 * for both applications. It exposes:
 *
 *   - Legacy / shared endpoints              ->  /news, /health
 *   - ValorTrust app endpoints               ->  /api/valortrust/*
 *   - Portfolio app endpoints                ->  /api/portfolio/*
 *
 * Both apps share the same Supabase project, so a single Supabase client is
 * used server-side. Point both frontends at this server's base URL.
 */

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables from a local .env file when present.
try {
  require("dotenv").config();
} catch (_) {
  /* dotenv is optional; env vars may be provided by the host (e.g. Render) */
}

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// CORS: allow both app frontends (dev + production).
// ---------------------------------------------------------------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  [
    "http://127.0.0.1:5173", // valortrust dev
    "http://127.0.0.1:5174", // portfolio dev
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8080",
  ].join(",")
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no origin) and any whitelisted origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // relaxed by default; tighten in production
    },
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Shared Supabase client (both apps use the same project).
// ---------------------------------------------------------------------------
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://tfygcpiozlysvvivfrxt.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmeWdjcGlvemx5c3Z2aXZmcnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDc2MjAsImV4cCI6MjA4MTAyMzYyMH0.jVXK4mbm-pIoJSLKXo81J5-ri6hDiZiQvKjvIgHTSbI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Small helper to keep route handlers tidy.
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// ---------------------------------------------------------------------------
// Health + legacy endpoints (kept for backwards compatibility).
// ---------------------------------------------------------------------------
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

app.get("/news", (req, res) => {
  res.json([{ id: 1, title: "First News", content: "Hello from the unified backend!" }]);
});

// ===========================================================================
// VALORTRUST APP  ->  /api/valortrust/*
// ===========================================================================
const vt = express.Router();

vt.get("/blog", handle(async (req, res) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  res.json(data);
}));

vt.get("/portfolio", handle(async (req, res) => {
  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  res.json(data);
}));

vt.get("/testimonials", handle(async (req, res) => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  res.json(data);
}));

vt.get("/sectors", handle(async (req, res) => {
  const { data, error } = await supabase.from("sectors").select("*");
  if (error) throw error;
  res.json(data);
}));

vt.post("/enquiries", handle(async (req, res) => {
  const { error } = await supabase.from("enquiries").insert(req.body);
  if (error) throw error;
  res.status(201).json({ success: true });
}));

vt.post("/subscribers", handle(async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "email is required" });
  const { error } = await supabase.from("subscribers").insert({ email });
  if (error) throw error;
  res.status(201).json({ success: true });
}));

app.use("/api/valortrust", vt);

// ===========================================================================
// PORTFOLIO APP  ->  /api/portfolio/*
// ===========================================================================
const pf = express.Router();

pf.get("/skills", handle(async (req, res) => {
  const { data, error } = await supabase.from("skills").select("*");
  if (error) throw error;
  res.json(data);
}));

pf.get("/profile", handle(async (req, res) => {
  const { data, error } = await supabase.from("profiles").select("*").limit(1).single();
  if (error) throw error;
  res.json(data);
}));

pf.get("/bio", handle(async (req, res) => {
  const { data, error } = await supabase.from("site_bio").select("*").limit(1).single();
  if (error) throw error;
  res.json(data);
}));

pf.get("/contacts", handle(async (req, res) => {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  res.json(data);
}));

pf.post("/contacts", handle(async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message)
    return res.status(400).json({ error: "name, email and message are required" });
  const { error } = await supabase
    .from("contact_submissions")
    .insert({ name, email, subject, message });
  if (error) throw error;
  res.status(201).json({ success: true });
}));

app.use("/api/portfolio", pf);

// ---------------------------------------------------------------------------
// Start server.
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Unified backend running on port ${PORT}`);
  console.log(`  ValorTrust API:  /api/valortrust/*`);
  console.log(`  Portfolio API:   /api/portfolio/*`);
});
