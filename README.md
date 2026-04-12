# LBCA Dashboard UI

React + Vite frontend for the LBCA monitoring dashboard.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create env file from example:

```bash
copy .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

## Connect to Django REST API

This frontend now supports loading dashboard data from your Django backend.

Environment variables:

- `VITE_API_BASE_URL`: your Django backend host URL.
  - Example: `http://127.0.0.1:8000`
- `VITE_DASHBOARD_ENDPOINT`: dashboard route under the API base URL.
  - Example: `/api/dashboard/` or leave blank when not implemented.
- `VITE_USE_MOCK_FALLBACK`: when `true`, UI uses mock data if API request fails.

Example request made by the dashboard hook:

```text
GET {VITE_API_BASE_URL}{VITE_DASHBOARD_ENDPOINT}?school_year=2025-2026&section=Section%20A&quarter=Q2&risk=High
```

Expected response shape:

```json
{
  "kpiData": {
    "totalStudents": 452,
    "avgPaceCompletion": 76.5,
    "behindPace": 38,
    "atRisk": 18,
    "quarter": "Q2"
  },
  "trendData": [
    { "name": "W1", "SectionA": 55, "SectionB": 48, "SectionC": 50 }
  ],
  "attendanceData": {
    "overallPercentage": 92.3,
    "chartData": [
      { "name": "Present", "value": 92, "color": "#10B981" },
      { "name": "Late", "value": 4, "color": "#F59E0B" },
      { "name": "Absent", "value": 4, "color": "#EF4444" }
    ]
  },
  "atRiskStudents": [
    {
      "id": "S001",
      "firstName": "Mateo",
      "middleName": "D",
      "lastName": "Alvarez",
      "section": "Section A",
      "pacePercent": 52,
      "riskLevel": "High",
      "factor": "Low PACE completion"
    }
  ],
  "activityFeed": [
    { "id": 1, "text": "New alert", "time": "10 mins ago" }
  ]
}
```

## Notes for Django setup

- Allow the frontend origin in CORS settings.
- This frontend uses DRF token auth and sends `Authorization: Token <token>` automatically.
- Token is stored in local storage key `auth_token`.

## Build

```bash
npm run build
```
