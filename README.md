# Expense Tracker - Frontend

React 18 + Vite app. The API address comes from `VITE_API_URL` in `.env` (default `http://localhost:8080/api`).

```powershell
cd "C:\path\to\expense-tracker\frontend"
npm install
```

```powershell
cd "C:\path\to\expense-tracker\frontend"
npm run dev
```

Runs on http://localhost:5173.

```powershell
cd "C:\path\to\expense-tracker\frontend"
npm test
```

Structure: `src/pages` (screens), `src/components` (shared UI), `src/services` (Axios API layer, one file per backend area),
`src/context` (auth state), `src/hooks`, `src/utils` (constants, formatting, validators).
