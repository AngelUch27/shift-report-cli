"use strict";
const fs = require("fs");

const SEVERITIES = ["high", "medium", "low"];
const STATUSES = ["open", "resolved"];

class ShiftError extends Error {}

function require_(obj, field, where) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
    throw new ShiftError(`${where}: missing field '${field}'`);
  }
  return obj[field];
}

function parseIncident(raw, index) {
  const where = `incident ${raw && raw.id ? raw.id : "#" + (index + 1)}`;
  if (typeof raw !== "object" || raw === null) throw new ShiftError(`${where}: must be an object`);
  const inc = {
    id: String(require_(raw, "id", where)),
    title: String(require_(raw, "title", where)),
    severity: String(require_(raw, "severity", where)).toLowerCase(),
    time: String(require_(raw, "time", where)),
    status: String(require_(raw, "status", where)).toLowerCase(),
    downtimeMin: raw.downtime_min === undefined ? 0 : Number(raw.downtime_min),
    action: raw.action ? String(raw.action) : "",
  };
  if (!SEVERITIES.includes(inc.severity)) throw new ShiftError(`${where}: severity must be one of ${SEVERITIES.join(", ")}`);
  if (!STATUSES.includes(inc.status)) throw new ShiftError(`${where}: status must be one of ${STATUSES.join(", ")}`);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(inc.time)) throw new ShiftError(`${where}: time must be HH:MM`);
  if (!Number.isFinite(inc.downtimeMin) || inc.downtimeMin < 0) throw new ShiftError(`${where}: downtime_min must be a non-negative number`);
  return inc;
}

function parseShift(data) {
  if (typeof data !== "object" || data === null) throw new ShiftError("shift file must contain a JSON object");
  const where = "shift";
  const shift = {
    date: String(require_(data, "date", where)),
    shift: String(require_(data, "shift", where)),
    line: data.line ? String(data.line) : "",
    operator: String(require_(data, "operator", where)),
    incidents: (Array.isArray(data.incidents) ? data.incidents : []).map(parseIncident),
    notes: Array.isArray(data.notes) ? data.notes.map(String) : [],
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(shift.date)) throw new ShiftError("shift: date must be YYYY-MM-DD");
  return shift;
}

function loadShift(path) {
  return parseShift(JSON.parse(fs.readFileSync(path, "utf8")));
}

function sortIncidents(list) {
  return [...list].sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || a.time.localeCompare(b.time));
}

function summarize(shift) {
  const bySeverity = { high: 0, medium: 0, low: 0 };
  shift.incidents.forEach((i) => { bySeverity[i.severity] += 1; });
  return {
    incidents: shift.incidents.length,
    open: shift.incidents.filter((i) => i.status === "open").length,
    downtime_min: shift.incidents.reduce((sum, i) => sum + i.downtimeMin, 0),
    by_severity: bySeverity,
  };
}

function line(inc, bold) {
  const dt = inc.downtimeMin ? `${inc.downtimeMin} min downtime` : "no downtime";
  const head = `[${inc.severity.toUpperCase()}] ${inc.id} ${inc.title}`;
  const action = inc.action ? ` ${inc.action}` : "";
  return `- ${bold ? `**${head}**` : head} — ${inc.time}, ${dt}.${action}`;
}

function buildReport(shift) {
  const s = summarize(shift);
  const title = `# Shift report — ${shift.date}, ${shift.shift} shift${shift.line ? ` (${shift.line})` : ""}`;
  const out = [title, "", `**Operator:** ${shift.operator} · **Incidents:** ${s.incidents} (${s.open} open) · **Downtime:** ${s.downtime_min} min`, ""];
  const open = sortIncidents(shift.incidents.filter((i) => i.status === "open"));
  const resolved = sortIncidents(shift.incidents.filter((i) => i.status === "resolved"));
  out.push("## Open");
  out.push(open.length ? open.map((i) => line(i, true)).join("\n") : "- None");
  out.push("", "## Resolved");
  out.push(resolved.length ? resolved.map((i) => line(i, false)).join("\n") : "- None");
  if (shift.notes.length) {
    out.push("", "## Handover notes");
    out.push(shift.notes.map((n) => `- ${n}`).join("\n"));
  }
  return out.join("\n") + "\n";
}

module.exports = { ShiftError, parseShift, loadShift, summarize, buildReport };
