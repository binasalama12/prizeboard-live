[![make.fun · makefun-frontend-01](https://make.fun/badge/makefun-frontend-01.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![rank](https://make.fun/badge/makefun-frontend-01/binasalama12/prizeboard-live/rank.svg)](https://make.fun/bounty/makefun-frontend-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)
[![reward](https://make.fun/badge/makefun-frontend-01/binasalama12/prizeboard-live/reward.svg)](https://make.fun/bounty/makefun-frontend-01?utm_source=github&utm_medium=readme&utm_campaign=makefun-frontend-01)

# PrizeBoard

PrizeBoard is an editorial-style live frontend for browsing open make.fun competitions. It reads public competition, leaderboard, and builder profile data from the read-only make.fun API. The board highlights each prize pool, entry fee, deadline, and submission count so builders can quickly compare opportunities.

## Run locally

Use Node.js 22 or newer. There are no dependencies and no build step.

- `node serve.ts` starts the local viewer at <http://localhost:8080>.
- `node main.ts` builds the judge dossier in `/output`. To choose a local output directory, run `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

The browser needs an internet connection to load current API data. If the API request fails, PrizeBoard displays the request error and a retry control.

## Routes

- `#/` — all open competitions, with title search and sorting by prize pool or deadline.
- `#/bounty/<slug>` — competition brief, payout breakdown, deadline, entry fee, rules summary, and the make.fun listing.
- `#/leaderboard` — ranked entries for the open competition with the largest prize pool. Use the selector to switch competitions.
- `#/profile/<handle>` — public builder information, competition record, and submitted solutions.

Entrant names in leaderboard rows link to their public PrizeBoard profile. Competition cards and solution titles link to their bounty detail routes.
