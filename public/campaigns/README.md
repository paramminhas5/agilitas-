# Campaign imagery and film

Two slots per campaign. **Drop files in, nothing else.**

```
/public/campaigns/midnight-galli.jpg   key visual / poster
/public/campaigns/midnight-galli.mp4   the treatment, as a silent loop
```

| Asset | Filename | Spec |
|---|---|---|
| Poster | `<campaign-id>.jpg` | 16:9, ≥1920px wide |
| Film | `<campaign-id>.mp4` | 16:9, 8–15s, **silent**, seamless loop, H.264 |

Behaviour: if the film exists it plays muted and loops. If only the poster
exists, it shows with a play affordance. If neither exists, the slot renders
as a labelled frame naming the file it wants.

## Keep video out of this repo if you can

A handful of loops will bloat the repository, and Vercel caps a single file at
100 MB. Two workable routes:

1. **Streaming host** (recommended) — Cloudflare Stream or Mux. Tell me and
   I will point the film slot at a playback URL instead of a local path; the
   component takes either.
2. **In-repo** — only with heavy compression. Target **under 2 MB** per loop:
   `-c:v libx264 -crf 30 -vf scale=1280:-2 -an -movflags +faststart`, and
   track them with git-lfs.

**Campaign ids**

`the-trial` · `midnight-galli` · `take-them-off` · `10pm-league` ·
`beta-sessions` · `sunday-session` · `dry-by-morning` · `rain-locked-drop` ·
`thousand-riders` · `ball-maker-capsule`
