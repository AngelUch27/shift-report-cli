# shift-report-cli

Generates a Markdown shift handover report from a JSON list of incidents.
Zero dependencies: Node.js 18+ and nothing else.

```bash
node bin/shift-report.js examples/shift.json
```

```markdown
# Shift report — 2026-11-12, night shift (Line 2)

**Operator:** M. Torres · **Incidents:** 3 (1 open) · **Downtime:** 55 min

## Open
- **[HIGH] INC-0412 Coolant pump P-101 overheating** — 02:50, 40 min downtime. Pump switched to standby; vendor visit requested.

## Resolved
- [MEDIUM] INC-0413 Air compressor pressure dip — 04:10, 15 min downtime. Filter replaced.
- [LOW] INC-0414 Label printer jam — 05:30, no downtime. Cleared.

## Handover notes
- Keep P-101 on standby until the vendor confirms the bearing.
```

## Features

- Incidents grouped by **open / resolved**, sorted by severity then time.
- Total downtime and open-incident count in the header.
- `--out report.md` to write the file, `--json` to print the computed summary.
- Input validation with clear messages (unknown severity, bad time, missing fields).

## Install and test

```bash
git clone https://github.com/AngelUch27/shift-report-cli.git
cd shift-report-cli
node --test
```

## Documentation

- [Shift file format](docs/shift-format.md)
- [Report format](docs/report-format.md)

## License

MIT
