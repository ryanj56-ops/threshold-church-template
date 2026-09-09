# HANDOVER — Sam Website Opportunity

**Date:** 2026-09-09
**Prepared in:** Claude Code remote (cloud) session — no access to the Mac
**Status:** LIVE DEAL, awaiting prospect reply
**Blocking question:** What is Sam's business? (asked twice, not yet answered)

---

## 1. TL;DR

A member of a CFM church ("Sam") texted Ryan cold asking how much a simple
website would cost. He has **no website** and **no Google Business Profile**.
Ryan has quoted a positioning message and asked what the business is; Sam has
not yet answered. No number has been formally committed to yet.

This is the first inbound commercial (non-ministry) web enquiry the business has
received. It is being treated as the pilot for a new market segment, and as a
potential flagship portfolio piece.

**Nothing visual can be designed until Sam names the business.**

---

## 2. The Prospect

| Field | Value |
|---|---|
| Name | Sam (surname unknown) |
| Relationship | Member of a CFM church — **not a pastor** |
| Channel | SMS, direct to Ryan |
| Existing website | **None** |
| Existing Google Business Profile | **None** ("I dont have one yet") |
| Business type | **UNKNOWN — dodged twice** |
| Domain owned | Unknown |
| Logo / brand assets | Unknown |
| Budget signal | None given; opened by asking price |

### Critical classification

Sam is a **commercial client**, not a ministry client. The church connection is
how he found Ryan, not what he is buying. This distinction drives the entire
pricing decision (see §4).

---

## 3. Conversation Log

### 3.1 Sam's opener
> "Been good brother thank God. Wanted to ask you how much it would be to have
> a web page created something simple like this one"

Attached reference: **makereadydallas.com**

**Important:** makereadydallas.com is NOT Sam's business. It is an example he
sent of the *style* of site he wants. This was initially misread as the client's
own site — do not repeat that error.

The site could not be inspected: this session's org egress policy blocks the
host at the gateway (`connect_rejected`, gateway answered 403 to CONNECT).
A local session or a screenshot is needed to see it.

### 3.2 Ryan asked about Google Business Profile
> "Another thing I need to know is if you have a google business profile too?"
> "[I can he]lp you with that too"

### 3.3 Sam's reply — the DIY objection
> "I dont have one yet but It seems pretty straightforward to create or is
> there more to it"

**Read:** This refers to the **Google Business Profile**, not the website. Sam
is testing whether the work is worth paying for. This is the moment most
freelancers discount. Do not.

### 3.4 Ryan's response (SENT)
> "Yeah it is, I can wire your Google Business Profile straight into the site.
> Your reviews show up on the page and update themselves, same with your hours,
> phone and address"
>
> "That would be your main way of changing important details on the website"
>
> "What's the business? Once I know that I can give you a firm number."

**Current state: ball is in Sam's court. Do not double-text.**

---

## 4. Pricing — DECIDED

### 4.1 Do NOT quote church tier pricing

Existing CFM tiers are **subsidized ministry pricing**:

| Tier | Price |
|---|---|
| Seed | $29/mo or $249/yr |
| Plant | $49/mo |

Quoting these to a business owner sets the anchor for the entire CFM referral
network (437 churches). One discount, permanently applied to every future
commercial referral. **This is the most expensive mistake available in this deal.**

The reverse works in Ryan's favour: commercial pricing here makes the $249/yr
church rate read as the genuine favour it is.

### 4.2 The agreed structure — two options, identical year one

| Option | Terms | Year 1 |
|---|---|---|
| **A — pay for the build** | $1,200 up front, then $50/mo | $1,800 |
| **B — nothing down** | $150/mo for 12 months, then $50/mo | $1,800 |

Both land at $1,800 in year one. Sam chooses on cash flow, not on price. No
discount leaks out of either path. Option B is better for WranglR because it is
recurring revenue rather than a one-time check.

**Church-family discount (optional):** $1,000 build instead of $1,200 on
Option A only. Monthly unchanged. State it explicitly as a discount off
$1,200 so it survives arithmetic.

### 4.3 Math error that was caught and corrected — do not repeat

An earlier draft said: *"Sites like that run $1,200–$1,800 to build. Since
you're church family I'll do $1,000, plus $50/mo."*

That is incoherent:
- $1,000 + ($50 × 12) = **$1,600 in year one**
- It passes the $1,200 "undiscounted" low end at **month 4**
- After that the "discount" is negative

The anchor must include the monthly, or it is not an anchor. Fixed by quoting
build + monthly together in both options above.

### 4.4 The monthly is the deal, not the build

| | Year 1 | 3-year total |
|---|---|---|
| $1,200 build + $50/mo | $1,800 | $3,000 |
| $1,000 build + $50/mo | $1,600 | $2,800 |

Over three years the recurring line is $1,800 — more than the build. WranglR has
**$234 in lifetime recorded Stripe revenue and effectively zero MRR**. The
recurring component is the entire strategic point of taking this client.

### 4.5 Extras to price in
- Domain registration (~$15/yr, bill through)
- Logo / wordmark — Sam likely has none. Either quote an hour or state plainly
  that branding is not included.
- Google Business Profile creation + verification (see §5.4)

---

## 5. Technical Findings — VERIFIED

Ryan's chosen sales angle is GBP → website integration. It was fact-checked at
his instruction ("only if it's true of course"). **It is true, with limits.**

### 5.1 The easy version — works day one

Google **Places API** returns, with a plain API key and no approval process:
- Star rating and total review count
- **Up to 5 reviews** (hard cap)
- Opening hours, phone number, formatted address
- Photos

Rendered live on page load. Sam edits Google, the site reflects it. This is
genuinely "reviews update themselves" and is exactly what Sam is picturing.

### 5.2 The full version — all reviews

Requires the **Google Business Profile API** (`mybusiness.googleapis.com/v4`,
still the live endpoint for reviews in 2026). Google gates it:

- Formal access request, reviewed in ~14 days (often longer in practice)
- Requires a **verified GBP active 60+ days**
- Requires a **valid business website**

**Strategic consequence:** the website is a *prerequisite* for the deeper
integration. That is Google's actual rule, not a sales line, and it sequences
the pitch perfectly — build the site now, apply for full review sync after.

### 5.3 Hard limits — do not over-promise
- The **5-review cap** on the free path has been unchanged since 2015. Do not
  promise "all your reviews" on day one.
- Promise **"your reviews on the site, auto-updating."** True, deliverable,
  and it is what he is imagining anyway.

### 5.4 GBP creation — the 60-day clock

Sam has no GBP. Creating one is straightforward, but:
- It must be **verified** (can take days to weeks depending on method)
- The **60-day active clock for API access starts at verification**

**ACTION: get Sam's GBP created and verified immediately, before or in parallel
with the build.** Every day of delay pushes out the date full review sync
becomes available. This is the single most time-sensitive technical item.

### 5.5 Google's caching terms — drives the architecture

Google Maps Platform terms prohibit pre-fetching, caching or storing Places API
content. Exceptions:
- `place_id` — exempt, may be stored **indefinitely**
- lat/lng — may be cached up to **30 consecutive days**
- Everything else (names, ratings, **reviews**, photos, phone numbers) must be
  requested live and displayed with Google attribution

---

## 6. Architecture — DECIDED: NO n8n for reviews

### 6.1 Why not

The natural n8n pattern would be: poll Google on a schedule → write reviews into
Supabase → site reads from Supabase.

**That pattern violates Google's terms** (§5.5 — it warehouses review content).
It also adds:
- A scheduled workflow that can break. There are currently **40 logged
  workflow_errors**, and `CFM_ADMIN_backup` has been failing since 8/30.
- A Supabase table to maintain
- Sync lag, for a feature that is inherently live

Ryan independently confirmed he did not want n8n here. Correct call.

### 6.2 What it actually is

A JavaScript call on page load:

```
page load → Maps JS API Places library
          → getDetails(placeId, [rating, reviews, opening_hours, ...])
          → render cards + "Reviews from Google" attribution
```

- One **referrer-restricted API key**
- No backend, no database, no cron, no n8n
- Only `place_id` is stored — explicitly permitted
- Always current, because it is read live; nothing to sync means nothing to break

**Optional hardening:** put the call behind a Netlify function to keep the API
key off the page. This matches the existing convention documented in
`citywolves-site` ("never expose service role key client-side").

### 6.3 Where n8n DOES belong

The lead form:

```
form submit → Supabase `leads` row → n8n webhook → SMS to Sam's phone
```

**Reviews are a read. Leads are an event. Use n8n for the events.**

---

## 7. Strategic Context

### 7.1 The new segment thesis

Existing sales motion targets **pastors** — nonprofits, tight budgets,
subsidized pricing, ~5% conversion (109 active sites, 6 with a Stripe sub).

Every one of the **437 CFM churches** contains congregation members who own
small businesses: contractors, landscapers, auto shops, salons. Same trust
relationship, same warm introduction, **real budgets**, no ministry-discount
expectation.

Sam is the first one who asked. He is not a one-off — he is customer #1 of a
segment that is plausibly worth more than the church line. Handling him well in
a church network produces referrals without cold outreach.

### 7.2 Build it as a template, not a one-off — CRITICAL

Ryan wants to "swing for the fences" and produce a flagship to display on
WranglR's own site. That is a legitimate investment, on three conditions:

1. **It must be built as `smallbiz-template`'s first instance, not as a
   snowflake.** Precedent: there are **131 site folders** in the `pastor-sites`
   bucket. Each PastorSite build forked. Same hours, same result on screen, but
   the second client then takes an afternoon and the fifth takes an hour.
   *(Caveat: the claim that no canonical template exists is UNVERIFIED — the
   generator may live in the local `cfm-websites` repo. Confirm before acting.)*

2. **Cap the over-delivery.** Flagship hours on a $1,000–$1,200 job is
   portfolio-driven scope creep. Decide the extra-hours budget up front, not at
   1am on the fourth revision.

3. **Get portfolio rights in writing.** One line in the agreement permitting
   display and reference. Otherwise the showcase cannot be shown.

### 7.3 Open strategic question

**Does WranglR have a website?** Nothing in GitHub or Supabase indicates one —
`WranglR-Automations` contains only a CLAUDE.md and one n8n workflow. If the
plan is "display the flagship on ours" and "ours" does not exist, the WranglR
site may be the more urgent build. **Needs confirming from the Mac.**

---

## 8. Reusable Assets Already On Hand

### 8.1 `citywolves-site` repo (private)
Stalled client project, but the scaffold is ~80% of the plumbing for a B2B
lead-gen site:
- `netlify.toml` — security headers, full CSP, HSTS, cache rules, redirects
- `supabase/migrations/001_initial_schema.sql` — `leads` table with RLS,
  service-role-only policy
- Documented n8n webhook env var convention (`N8N_WEBHOOK_LEADS`)
- `package.json` with `@supabase/supabase-js`, `netlify-cli`

**Warning:** that repo is also a dead client deliverable — `index.html` says
"Coming soon", `styles.css` and `main.js` are 0 bytes, the `functions/`
directory referenced by `netlify.toml` does not exist, and `leads`/`waivers`
have 0 rows. Untouched since 2026-03-14. Either finish it or formally close it
out before taking on a second outside client.

### 8.2 Hero treatments already built (Supabase `pastor-sites` bucket, April)
- `demos/demo1-particle-flame.html` (66 KB)
- `demos/demo2-scroll-orbit.html` (48 KB)
- `demos/demo3-webgl-flame.html` (125 KB)
- `demos/demo4-svg-breathe.html` (58 KB)
- `demos/preview-globe/` (globe.js + assets)

Already paid for in hours. Worth reviewing before starting a hero from zero.

---

## 9. Planned Build — Business-Agnostic Foundation

This can be built **before** Sam names the business:

- Live Google reviews + hours/phone/address via Places API, terms-compliant,
  no n8n, with required attribution
- Lead form → Supabase `leads` → n8n webhook → SMS notification
- `netlify.toml` with security headers, sitemap, robots
- schema.org `LocalBusiness` structured data
- Performance budget — must load fast on a phone on LTE
- Config-driven: business name, colors, services, copy all swappable

**Blocked until the business is known:** design language, photography, copy,
page structure, hero treatment.

---

## 10. Open Questions — BLOCKING

1. **What is Sam's business?** Trade and city. Asked twice, not answered.
   Everything visual waits on this.
2. **Does Sam own a domain?**
3. **Does Sam have a logo or any brand assets?**
4. **Who is "Daniel" and what is "Daniel's website"?** No Daniel client exists
   anywhere in Supabase. The only Daniel on record is the AV contact at The Door
   Church of Denver who never set up the overflow translation display. If there
   is a Daniel website project it is local-only on the Mac.
5. **Does WranglR have a live website to display a flagship on?**
6. **Is there a canonical site template in `cfm-websites`?** (§7.2 caveat)

---

## 11. Immediate Next Actions

| # | Action | Owner | Notes |
|---|---|---|---|
| 1 | Wait for Sam's reply naming the business | Sam | Do not double-text |
| 2 | Once known, quote Option A / Option B (§4.2) | Ryan | Do not use church pricing |
| 3 | Get Sam's GBP created + verified | Ryan | Starts the 60-day API clock |
| 4 | Confirm domain + logo status | Ryan | Affects price |
| 5 | Build business-agnostic foundation as `smallbiz-template` | Claude | Unblocked now |
| 6 | Put portfolio rights in the agreement | Ryan | Before work starts |

---

## 12. Related Open Items (not this deal, but on fire)

Surfaced from Supabase during this session. Included because a handover that
omits them would be negligent.

1. **Orphaned live Stripe checkout, 2026-08-31.** `CFM_ONBOARD_stripe` errored
   on session `cs_live_a1ICyfuR9iXsAipJj6XHevNrw0vBuohcUwApbGhFDmaboCnYR7fGD1BBS4`:
   *"Unknown product prod_Uy8L4QyK2k0URP (price price_1TyC4iJj3SLl5Z9JFjWM38xe).
   Cannot derive tier. Possibly a Grow/Harvest product that should not be sold
   yet."* Status still `new`. **Someone may have paid and received nothing.**
2. **Backups failing.** `CFM_ADMIN_backup` errored 8/30 and 9/06 —
   `CFM_BACKUP_ExportSiteSignups` never executed. Unresolved.
3. **20 overdue pipeline follow-ups**, oldest due 2026-08-15. Includes one
   flagged in Ryan's own notes as *"OPEN LOOP — he invited a follow-up and never
   got one."*
4. **7 edit_requests stuck at `needs_manual`**, five of them for
   `door-eastsidecfc`.
5. **Core IP is unversioned.** The `cfm-websites` repo (prospector,
   generator, `send-texts.mjs`, `live-translate/scripts/enroll.mjs`,
   `cfm-dateprune` cron) exists only on one Mac and is not on GitHub.
   Combined with #2, **both copies of the business are currently unprotected.**

---

## 13. Environment Notes for the Next Session

This handover was written in a **Claude Code remote cloud session** — an
ephemeral Linux container, not the Mac.

**Not visible from the cloud session:**
- Anything on the Mac: `cfm-websites`, its CLAUDE.md, the prospector,
  `texts_sent.csv`, `fresh_prospects_*.csv`, Messages threads, local n8n, `.env`
- `makereadydallas.com` — blocked by org egress policy at the gateway

**Visible from the cloud session:**
- GitHub: `threshold-church-template`, `WranglR-Automations`, `citywolves-site`
  (`cfm-websites` returned "you don't have access" — it is not on GitHub)
- Supabase project `uetawcmedfzrrsjiehzq` — the actual system of record
- Gmail, and the web minus blocked hosts

**Recommendation:** run local sessions for anything touching the Mac; use cloud
sessions for Supabase, GitHub and web work. Pushing `cfm-websites` to a private
GitHub repo would fix both the visibility gap and the backup risk in one move.

---

## 14. Message Drafts

### 14.1 Already sent (§3.4) — no action needed

### 14.2 When Sam names the business — quote

> Appreciate it. Here's how I price it, two ways — pick whichever is easier on
> cash flow:
>
> • $1,200 to build it, then $50/mo for hosting, updates, and a contact form
>   that texts you when someone reaches out.
> • Nothing down, $150/mo for the first year, then it drops to $50/mo.
>
> Since you're church family I'll knock the build down to $1,000 if you go the
> first route.
>
> Either way I'll get your Google Business Profile set up and verified first —
> that's what feeds the reviews and hours onto the site, and the sooner it's
> live the better.

### 14.3 If Sam pushes back on price again

Do not discount below the structure in §4.2. The honest fallback is to offer
the DIY comparison openly — being the person who told him the truth is worth
more in a church network than any single job, and most people, once shown the
actual list of work, would rather hand it over.

---

*End of handover.*
