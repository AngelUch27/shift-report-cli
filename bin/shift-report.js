#!/usr/bin/env node
"use strict";
const fs = require("fs");
const { loadShift, buildReport, summarize } = require("../lib/report");

function main(argv) {
  const args = argv.slice(2);
  if (!args.length || args.includes("--help")) {
    console.error("usage: shift-report <shift.json> [--out report.md] [--json]");
    return 2;
  }
  const file = args[0];
  const outIdx = args.indexOf("--out");
  const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
  let shift;
  try {
    shift = loadShift(file);
  } catch (err) {
    console.error(`error: ${err.message}`);
    return 2;
  }
  if (args.includes("--json")) {
    console.log(JSON.stringify(summarize(shift), null, 2));
    return 0;
  }
  const report = buildReport(shift);
  if (outPath) {
    fs.writeFileSync(outPath, report, "utf8");
    console.error(`written ${outPath}`);
  } else {
    process.stdout.write(report);
  }
  return 0;
}

process.exitCode = main(process.argv);
