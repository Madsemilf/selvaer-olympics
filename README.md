# Selvær Olympics

FIFA Ultimate Team-inspirerte spillerkort + live ledertavle for Selvær-turen.

## Kom i gang lokalt

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

Resultater lagres lokalt i `data/results.json` (ignorert av git).

## Legg til ekte bilder

1. Legg bildefilen i `/public/players/` — f.eks. `sebastian.jpg`
2. Oppdater `"photo"` for den aktuelle spilleren i `data/participants.json`:
   ```json
   "photo": "/players/sebastian.jpg"
   ```
3. Anbefalt bildestørrelse: kvadratisk, minimum 300×300 px

## Oppdater stats og bio

Rediger `data/participants.json` direkte. Felter per spiller:

- `stats` — seks attributter på 0–100 (overall beregnes automatisk)
- `bio` — fritekst som vises på spillerkortet

## Legg til navn og beskrivelse for konkurranse 2–5

Rediger `data/events.json`. Bytt `"name"` og `"description"` for de aktuelle grenene.

## Deploy til Netlify

1. Push til GitHub
2. Koble repoet til Netlify (Import project → GitHub)
3. Build-kommando: `npm run build` — publish: `.next`
4. Netlify oppdager `netlify.toml` og bruker `@netlify/plugin-nextjs` automatisk
5. Resultater lagres i Netlify Blobs — delt mellom alle som har lenken

### Re-deploy etter endringer

```bash
git add .
git commit -m "oppdater bilder/stats/grener"
git push
```

Netlify bygger og deployer automatisk.
