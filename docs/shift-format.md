# Shift file format

```json
{
  "date": "2026-11-12",
  "shift": "night",
  "line": "Line 2",
  "operator": "M. Torres",
  "incidents": [
    {"id": "INC-0412", "title": "Coolant pump P-101 overheating", "severity": "high",
     "time": "02:50", "downtime_min": 40, "status": "open",
     "action": "Pump switched to standby; vendor visit requested."}
  ],
  "notes": ["Keep P-101 on standby until the vendor confirms the bearing."]
}
```

| Field | Required | Notes |
|---|---|---|
| `date` | yes | `YYYY-MM-DD` |
| `shift` | yes | free text (`day`, `night`, `A`…) |
| `line` | no | shown in the title when present |
| `operator` | yes | |
| `incidents[].id` | yes | |
| `incidents[].title` | yes | |
| `incidents[].severity` | yes | `low`, `medium` or `high` |
| `incidents[].time` | yes | `HH:MM` (24 h) |
| `incidents[].downtime_min` | no | defaults to `0` |
| `incidents[].status` | yes | `open` or `resolved` |
| `incidents[].action` | no | what was done |
| `notes` | no | list of strings for the handover section |
