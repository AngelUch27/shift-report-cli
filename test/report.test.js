"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadShift, buildReport, summarize, parseShift, ShiftError } = require("../lib/report");

test("the example shift is summarised and rendered", () => {
  const shift = loadShift("examples/shift.json");
  assert.deepEqual(summarize(shift), { incidents: 3, open: 1, downtime_min: 55, by_severity: { high: 1, medium: 1, low: 1 } });
  const report = buildReport(shift);
  assert.match(report, /^# Shift report — 2026-11-12, night shift \(Line 2\)/);
  assert.match(report, /\*\*Incidents:\*\* 3 \(1 open\) · \*\*Downtime:\*\* 55 min/);
  const openIdx = report.indexOf("## Open"), resolvedIdx = report.indexOf("## Resolved");
  assert.ok(openIdx < report.indexOf("INC-0412") && report.indexOf("INC-0412") < resolvedIdx, "open incident sits in the Open section");
  assert.ok(report.indexOf("INC-0413") < report.indexOf("INC-0414"), "resolved incidents sorted by severity");
  assert.match(report, /## Handover notes\n- Keep P-101/);
});

test("missing sections render 'None' and notes are optional", () => {
  const report = buildReport(parseShift({ date: "2026-01-01", shift: "day", operator: "A", incidents: [] }));
  assert.match(report, /## Open\n- None\n\n## Resolved\n- None\n$/);
});

test("invalid incidents are rejected with their id", () => {
  const base = { date: "2026-01-01", shift: "day", operator: "A" };
  assert.throws(() => parseShift({ ...base, incidents: [{ id: "X", title: "t", severity: "urgent", time: "01:00", status: "open" }] }), (e) => e instanceof ShiftError && /incident X: severity/.test(e.message));
  assert.throws(() => parseShift({ ...base, incidents: [{ id: "X", title: "t", severity: "low", time: "25:00", status: "open" }] }), /incident X: time/);
  assert.throws(() => parseShift({ ...base, date: "01/01/2026", incidents: [] }), /date must be/);
});
