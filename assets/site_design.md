# Site Design Blueprint

How this repository is structured so that **one set of Markdown files works two ways at once**:

1. **Browsable on GitHub** — every folder has a branded `README.md`, links resolve, badges render.
2. **Published as a polished site** — the same files build into a [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) site, auto-deployed to GitHub Pages at [ijk37.com/reinforcement-learning](https://ijk37.com/reinforcement-learning/).

This mirrors the setup documented for [`network-systems`](https://github.com/ijk37/network-systems); the differences here are the **cyberpunk color theme**, the math (MathJax) support the RL notes need, and an RL-specific quiz bank. The section layout matches: notes / exercises / quiz / projects / resources.

> [!NOTE]
> This file lives in `assets/` and is excluded from the built site (internal documentation, not a course page).

---

## 1. The core idea

A normal MkDocs project keeps docs in a `docs/` subfolder, which makes GitHub browsing ugly. Instead this repo builds **from the repository root** (`docs_dir: .`) so the folders you see on GitHub (`01-notes/`, `02-exercises/`, …) **are** the site's content, and each folder's `README.md` is both the GitHub landing page **and** the site section index.

Two settings make links behave identically in both places:

| Setting | Value | Why |
| --- | --- | --- |
| `docs_dir` | `.` | Build from repo root, not `docs/` |
| `use_directory_urls` | `false` | URLs mirror file paths, so relative `.md` links map 1:1 to `.html` |

---

## 2. Repository structure

```
reinforcement-learning/
├── .github/workflows/deploy.yml   # CI: build + deploy to GitHub Pages
├── 01-notes/            # 60 chapter notes → site section (README.md = index)
├── 02-exercises/        # 17 chapter exercise sets
├── 03-quiz/             # Static quiz app (own index.html, owns this URL path)
├── 04-projects/         # 8 runnable numpy projects (each is NN-*/README.md + .py)
│   └── requirements.txt # deps to RUN the code (numpy, matplotlib)
├── 05-resources/        # only README.md is published; the book PDF stays local
│   ├── .gitignore       # ignores *.pdf (freely available, kept local-only)
│   └── README.md
├── assets/
│   ├── banner.svg       # hero banner embedded on every section README
│   ├── images/          # favicon.svg, rl-logo.svg
│   ├── stylesheets/extra.css     # cyberpunk theme (cyan + green + purple)
│   ├── javascripts/extra.js, mathjax.js
│   └── site_design.md   # ← this file (excluded from build)
├── overrides/           # MkDocs theme custom_dir
├── tools/finalize.py    # idempotent pre-build fixer
├── index.md             # site home page (docs_dir=.)
├── README.md            # GitHub landing page (excluded from build)
├── 01-notes.md … 05-resources.md   # root shortcut pages → live site (GitHub-only)
├── mkdocs.yml           # site config
└── requirements.txt     # SITE build deps (MkDocs) — not the project deps
```

**Load-bearing files** (the live site builds from this repo, so they must exist): `.github/`, `mkdocs.yml`, `index.md`, `requirements.txt`, `assets/`, `overrides/`, `tools/`, and the content folders.

> Note the two `requirements.txt`: the **root** one holds MkDocs build deps (CI installs it); `04-projects/requirements.txt` holds the runtime deps for the Python projects.

---

## 3. Branding & theme

The palette is defined once as CSS variables in `assets/stylesheets/extra.css` and wired into Material's own variables. Design goal: **cyberpunk energy that stays eye-soothing** — deep, desaturated tones in light mode; true neon glow reserved for the dark (slate) scheme.

```css
:root {
  --rl-cyan:  #0c93a8;  --rl-cyan-deep:  #076576;  --rl-cyan-bright:  #22d3ee;
  --rl-green: #10b981;  --rl-green-deep: #0a8f68;   --rl-green-bright: #34e5a1;
  --rl-purple:#7c6cf0;  --rl-purple-deep:#5b4bd6;   --rl-purple-bright:#a78bfa;

  --md-primary-fg-color: #0c93a8;   /* deep cyan header/nav */
  --md-accent-fg-color:  #0a8f68;   /* deep green links/hover (light) */
}
[data-md-color-scheme="slate"] {
  --md-default-bg-color: #0b1220;   /* cyberpunk night */
  --md-accent-fg-color:  #34e5a1;   /* neon green (dark) */
  --md-typeset-a-color:  #22d3ee;   /* neon cyan links (dark) */
}
```

Reusable brand elements:
- **Hero banner** — `assets/banner.svg`, an agent ⇄ environment loop motif, embedded as a Markdown image at the top of every section README.
- **Home-page cards** — `attr_list` links with `.rl-card .rl-card-<name>` classes; each card gets a colored left border cycling cyan → green → purple.
- **Live-site badge** — a `for-the-badge` shield in neon cyan on purple that deep-links to the live site; it sits under the banner on every README (re-inserted by `finalize.py` if a pass strips it).
- Green H2 underlines, cyan table headers, purple blockquote rules — small `extra.css` touches that make plain Markdown look designed.

---

## 4. MkDocs specifics

- **`same-dir`** plugin — required for `docs_dir: .`.
- **`callouts`** plugin — renders GitHub `> [!NOTE]` / `> [!TIP]` as styled admonitions on the site (one syntax, both platforms).
- **`md_in_html` + `<div markdown>`** — MkDocs rewrites Markdown links to `.html`, but **not** raw `<a href="x.md">`. All navigation must be Markdown links inside a `markdown`-enabled div.
- **`attr_list`** — powers the home-page cards.
- **`navigation.indexes`** — each `README.md` becomes its folder's index (`/01-notes/`, `/05-resources/`, …).
- **`pymdownx.arithmatex` (generic) + MathJax** — RL is math-heavy; `assets/javascripts/mathjax.js` configures MathJax and re-typesets on instant navigation. **This is the main addition over `network-systems`.**

`exclude_docs` keeps `mkdocs.yml`, `requirements.txt`, `tools/**`, `**/*.py`, `__pycache__`, the root shortcut pages, and `05-resources/**` out of the build — with `!05-resources/README.md` re-included so the Resources page still publishes.

---

## 5. Two-way navigation pattern

Every section `README.md` starts with the same block:

```markdown
# 📚 Section Title

<div align="center" markdown>

![Reinforcement Learning](../assets/banner.svg)

[![View the live site — ijk37.com](…badge…)](https://ijk37.com/reinforcement-learning/)

<img src="…section badge…" alt="Section">

[Home](../index.md) | [Notes](../01-notes/README.md) | [Exercises](../02-exercises/README.md) | [Quiz Hub](../03-quiz/) | [Projects](../04-projects/README.md) | [Resources](../05-resources/README.md)

</div>
```

Rules that keep it working in **both** GitHub and the site:
- `<div align="center" markdown>` — the `markdown` attribute lets MkDocs process the links inside.
- Banner and nav are **Markdown**, not raw HTML `<a>`/`<img>` — raw HTML links are not rewritten and would 404 on the site.
- Links use relative paths; with `use_directory_urls: false` they map straight to the built `.html`.

---

## 6. `tools/finalize.py` — the idempotent fixer

Runs before each build (locally and in CI) and self-corrects; safe to run repeatedly. It:

1. Converts raw-HTML nav into Markdown links/images.
2. Adds the `markdown` attribute to centered nav divs.
3. Retargets root-home links to `index.md` (depth-aware: `../README.md` for section pages, `../../README.md` for project sub-pages), since `README.md` is excluded from the build.
4. Fixes bare note image refs to `../assets/images/…`.
5. Re-inserts the live-site badge under the banner in every README.

Run `python tools/finalize.py`, then `python -m mkdocs build`.

---

## 7. Deployment (GitHub Actions → Pages → custom domain)

`.github/workflows/deploy.yml`: on push to `main`, it checks out, `pip install -r requirements.txt`, runs `python tools/finalize.py`, `mkdocs build --site-dir _site`, then `upload-pages-artifact` + `deploy-pages`.

**One-time setup:**
1. GitHub → **Settings → Pages → Build and deployment → Source = "GitHub Actions"** (not "Deploy from a branch").
2. `_site/` and `/site/` are in `.gitignore` (never commit build output).

**Custom domain.** `ijk37.com` is set on the user site repo (`ijk37.github.io`), and GitHub Pages cascades the apex/user domain to every project site — so this repo is automatically served at `https://ijk37.com/reinforcement-learning/` with **no per-repo `CNAME`**. `site_url` in `mkdocs.yml` is set to that URL so sitemaps/canonical links are correct.

**Discoverability:** set the repo's **About → Website** field to the live URL, and keep the live-site badge at the top of `README.md`.

---

## 8. Replicate / maintain — checklist

1. Keep a `README.md` in each content folder and `index.md` as the site home.
2. Every section README uses the `<div align="center" markdown>` block with Markdown links + banner + live-site badge.
3. Brand via `assets/` — banner, `extra.css` variables, favicon/logo.
4. Run `python tools/finalize.py` before building.
5. Verify `python tools/finalize.py && python -m mkdocs build` with **zero warnings**, then check the deployed nav and links.
### Cross-site hub navigation

Each course homepage starts with a right-aligned `.resource-hub-nav` button group immediately below the intro copy and before the course card grid:

```markdown
<div class="resource-hub-nav" markdown>

[:octicons-home-16: Home](https://ijk37.com/){ .hub-nav-button .hub-nav-home }

[:octicons-graph-16: Data Science & AI](https://ijk37.com/data-science-ai/){ .hub-nav-button .hub-nav-dsai }

[:octicons-shield-lock-16: Cyber Security](https://ijk37.com/cyber-security/){ .hub-nav-button .hub-nav-cyber }

</div>
```

The button styling lives in `assets/stylesheets/extra.css`. Keep the buttons as Markdown links inside a `markdown`-enabled div so MkDocs Material processes the Octicons and `attr_list` classes consistently. The Home button uses the local course theme color; the two hub buttons use the portfolio hub colors: Data Science & AI `#34526b`, Cyber Security `#b4122e`.
