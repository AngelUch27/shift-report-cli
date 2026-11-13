# Report format

The report is plain Markdown so it can be pasted into a wiki, a ticket or an
email:

1. **Title**: date, shift and line.
2. **Header line**: operator, number of incidents (open count in brackets) and
   total downtime in minutes.
3. **Open** and **Resolved** sections. Inside each, incidents are sorted by
   severity (`high` → `medium` → `low`) and then by time. Open incidents are
   bold so they stand out when skimming.
4. **Handover notes**, only when the shift file has `notes`.

With `--json` the CLI prints the computed summary instead:

```json
{"incidents": 3, "open": 1, "downtime_min": 55, "by_severity": {"high": 1, "medium": 1, "low": 1}}
```
