# AGENTS.md

## Project

POC Dotz Loyalty — a fidelity/points program web app. **No code written yet.** This file captures decisions from `prd.md` so agents do not guess wrong.

## Tech Stack (from PRD)

- **Frontend:** Angular (SPA)
- **Backend:** Node.js REST API
- **Database:** PostgreSQL
- **Auth:** JWT (8h expiry) + bcrypt password hashing

## Implementation Order

1. **Backend first** — build all endpoints before frontend
2. **Frontend second** — consumes the real backend API, no mocks
3. Use DB migrations (not raw SQL in code)

## Key Constraints

- Redemption (`POST /api/resgates`) must be atomic: check saldo, check product active, check address ownership, then debit points + create order in a single transaction
- Only one default address (`padrao = true`) per user
- `saldo_pontos` starts at 0; gains are simulated via seed/admin
- Password min 6 chars, stored as bcrypt hash
- Email is the unique user identifier

## API Endpoints (all under `/api`)

| Method | Route | Auth? |
|--------|-------|-------|
| POST | `/usuarios` | No |
| POST | `/login` | No |
| GET | `/me` | Yes |
| GET | `/enderecos` | Yes |
| POST | `/enderecos` | Yes |
| PUT | `/enderecos/:id` | Yes |
| DELETE | `/enderecos/:id` | Yes |
| GET | `/saldo` | Yes |
| GET | `/extrato` | Yes |
| GET | `/produtos` | Yes |
| GET | `/produtos/:id` | Yes |
| POST | `/resgates` | Yes |
| GET | `/pedidos` | Yes |
| GET | `/pedidos/:id` | Yes |

## Env / Config

- `.env` files are gitignored; provide `.env.example` for DB credentials and JWT secret
- No lockfile, package.json, or CI config exists yet — these need to be created
