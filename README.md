# Prisim

**Know before you wear.**

Prisim is an open-source, editorial experience for understanding how AI wearables earn—or lose—trust over time. It does not repeat release notes. It connects meaningful product, privacy, and policy changes to the questions a potential wearer should actually ask.

## What is live today

The first release focuses on Meta AI glasses:

- Ray-Ban Meta (Gen 2)
- Oakley Meta HSTN
- Oakley Meta Vanguard

Visitors can select a device and follow a small set of source-linked privacy milestones. Each milestone translates the official change into a concise Prisim read: whether a protection was strengthened, a capability was added, or data use expanded.

The companion Trust Dashboard deliberately avoids publishing an unexplained number. It shows the categories that will eventually support a transparent score: privacy controls, bystander signals, data use, transparency, and incident response.

## Design approach

The visual direction takes inspiration from quiet editorial product sites: an ivory background, restrained indigo, generous whitespace, and precise type. Prisim uses physical devices—not abstract AI artwork—as the visual identity.

The landing page is structured as a scroll-driven privacy story:

1. A device is introduced with a subtle scan interaction.
2. The selected glasses stay visible while the timeline explains meaningful changes.
3. The device responds to the current subject, such as the camera, capture LED, or voice AI.
4. The reader reaches a simple buy-or-wait decision before moving to the Trust Dashboard.

The experience was first explored through design references and zero-shot prototyping, then implemented as a lightweight static HTML site and deployed with GitHub Pages.

## Sources and assets

Product images in `assets/` are the supplied Meta-glasses images. Timeline entries link directly to the relevant official Meta release notes or announcements, with clearly labelled independent reporting where useful. The future-facing cards use official Meta newsroom footage.

Prisim is independent and is not affiliated with Meta, Ray-Ban, or Oakley.

## Project structure

```text
index.html       # Scroll-driven privacy timeline
trust.html       # Trust Dashboard and scoring-method preview
assets/          # Product imagery used by the site
data/            # Public, generated queue of candidate news reports
scripts/         # News-watch refresh script
.github/         # Scheduled GitHub Actions workflow
README.md        # Product framing, design approach, and contribution guide
```

## Automated news watch

Prisim uses News API as a **candidate-report feed**, not a source of automatic editorial updates. A scheduled GitHub Action runs daily, searches recent coverage of Meta AI glasses, filters it to privacy-relevant terms, and publishes the resulting list to `data/news-candidates.json`. The homepage presents those reports as **awaiting review**.

This is deliberately separate from the source-linked privacy timeline. A report can only become a Prisim timeline entry after a person verifies the underlying source, distinguishes fact from interpretation, and writes the reader-facing summary.

To activate the workflow:

1. Create a News API account and obtain an API key.
2. In the GitHub repository, add it as an Actions secret named `NEWSAPI_KEY`.
3. Open the **Actions** tab and run **Refresh Prisim news watch** once, or wait for the daily scheduled run.

For a local dry run, set `NEWSAPI_KEY` in your shell and run `node scripts/refresh-news.mjs`. Never add the key to this repository or client-side JavaScript. News API's `/v2/everything` endpoint supports the query, date, language, and sort controls used by the workflow. [News API documentation](https://newsapi.org/docs/endpoints/everything)

## Contributing

Prisim is intended to grow beyond this initial collection. In time, contributors should be able to propose a wearable, a timeline entry, or a perspective on an existing change.

Before a contribution is accepted, it should:

- include a primary source where possible;
- distinguish confirmed facts from interpretation;
- explain why the change matters to a wearer or bystander;
- avoid overstating a privacy or security claim; and
- be reviewed for neutrality, clarity, and source quality.

The long-term goal is a community-reviewed record of consumer AI wearables that stays understandable even as devices and policies evolve.
