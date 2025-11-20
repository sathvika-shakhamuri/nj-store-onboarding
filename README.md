# RepRally Store Onboarding Experience

**Live Demo:** [nj-store-onboarding-alpha.vercel.app](https://nj-store-onboarding-alpha.vercel.app/)

A value-first onboarding flow designed to help New Jersey store owners instantly understand their local market, while giving RepRally high-quality behavioral and product-signal data from minute one.

---

##  Screenshots

### 📍 Step 1 — Local Market Map
![Map Screenshot](/map.png)

### 📊 Step 3 — Personalized Insights
![Insights](/instant-insights.png)

---

## 🎯 Product Approach

### The Problem

Most B2B onboarding is form-heavy and value-light. Store owners give information but get nothing meaningful until a sales rep follows up. This creates friction, abandonment, and low intent.

### The Goal

Make onboarding feel like a personalized market report, not a form. Deliver immediate value that proves:

- RepRally understands their store
- RepRally understands their neighborhood
- RepRally understands what sells locally
- RepRally can help them grow right now

---

## My Approach

I designed an onboarding experience that:

1. **Delivers instant value before asking for commitment** — The map appears immediately after ZIP entry
2. **Shows the user their ecosystem** — Competitors, trends, and opportunities they didn't know about
3. **Adapts dynamically based on what the store owner shares** — Metrics change based on ZIP + store type
4. **Collects high-quality data without feeling like a form** — Progressive disclosure keeps it conversational

---

## Alternate Paths Considered

| Approach | Why I Didn't Choose It |
|----------|------------------------|
| **Simple 1-page form** | Fast, but delivers no value upfront → poor conversion |
| **Product-first landing page** | Nice UI, but no personalization → generic experience |
| **Data dump "report"** | Informative but overwhelming → low completion |

**Why the experiential, insight-driven flow wins:**
- Best balance between data collection + value delivery
- Creates emotional engagement immediately ("Wow, 47 stores near me!")
- Reduces perceived effort through progressive disclosure
- Lets analytics fuel compounding improvements over time

### The Strategy: Value First → Personalization → Insights → CTA

| Step | What Happens |
|------|--------------|
| **Step 1 – Your Store** | Enter ZIP → Instantly see an interactive 5-mile competitive landscape map |
| **Step 2 – Your Needs** | Select product categories → Real-time preview of personalized insights you'll get |
| **Step 3 – Insights** | Full market intelligence generated from location + store type + category inputs |

The experience is designed to feel alive, localized, data-driven, and immediately useful.

---

## Insight Engine — How Insights Are Generated

Although the dataset includes only store metadata (name, type, rating, location, ZIP), the onboarding creates a realistic, actionable insights experience by deriving context and layering category-specific intelligence.

### 1. Competitive Landscape (Real Data)

Data is computed dynamically from the NJ store dataset:

- Stores within a 5-mile radius
- Store-type mix (convenience, liquor, grocery, gas, etc.)
- Average rating
- Density indicators ("highly competitive area")

**Value:** Establishes trust and makes insights feel personalized.

### 2. Trending Product Insights (Template-Driven)

Each product category has predefined growth templates tuned to ZIP-level context:

> Example: "Energy drinks trending in Jersey City urban ZIPs"

**Value:** Positions RepRally as a source of local market intelligence.

### 3. Personalized Recommendations

Each product includes:
- Base orders
- Growth indicators
- Avg order size
- Insight copy

Metrics are lightly adjusted based on the user's selected categories to keep recommendations feeling relevant.

**Value:** Provides a credible preview of what RepRally could recommend with real SKU-level data.

### 4. Sales-Relevance Insights

From Step 2:
- Preferred contact channel
- Best time to reach them
- Product interests
- Market density

**Value:** Mirrors how a real sales CRM would qualify and score leads.

---

## Key Features

**Interactive Store Map**
- Leaflet-based with color-coded markers
- Hover + click store details
- 5-mile radius visualization
- Pulsing user marker

**Real-Time Insight Preview**
- Updates instantly as categories are selected
- Unlock counter ("3 insights unlocked")
- Category-specific trend statements

**Personalized Insights**
- Local competitive landscape
- ZIP-specific trending categories
- Store-type contextualization
- Contact preference–based CTA logic

**Mobile Friendly**
- Single-column layouts
- Large touch targets
- Mobile map gesture support

---

## Analytics Architecture (PostHog)

I instrumented events tied directly to actionable product questions.

### Funnel Events
```
onboarding_started          → Entry
onboarding_step_viewed      → Where users drop off
step1_completed             → Time spent, store type, nearby count
step2_completed             → Product selection, preferences
onboarding_completed        → Final conversion
onboarding_abandoned        → Recovery insights
```

### Engagement Events
```
map_interacted              → Pin clicks, zoom, pan
store_type_selected         → Early segmentation
field_focused               → UX friction indicators
validation_error            → Form issues
insights_viewed             → Scroll depth on Step 3
```

### Why This Matters

This enables:
- Drop-off analysis by step
- Lead qualification scoring
- Product interest clustering
- Sales handoff intelligence
- A/B test readiness

---

### Strategic Questions This Enables

Beyond funnel metrics, this instrumentation answers:

- Do liquor stores convert differently than convenience stores?
- Does higher competitive density correlate with drop-off or motivation?
- Are faster completions higher-quality leads?
- Do users who see similar stores nearby convert better?
- If they see a product they already carry, does familiarity increase trust and conversion?

---

## 🎯 Future: Rep-Facing Dashboard

With this data, I would build a **sales intelligence dashboard** showing:

| Data Point | Why It Matters |
|------------|----------------|
| **Products selected** | Lead with what they care about |
| **ZIP insights** | "52 stores in your area — competition is heating up" |
| **Friction points** | If they hesitated on contact info, approach softer |
| **Predicted product interest** | Cross-sell based on similar store profiles |

**Impact:** Sales can prioritize highest-intent stores and personalize outreach based on behavior, not just form fields.


##  How I'd Iterate With Real User Behavior

### If Step 1 drop-off is high
- **Hypothesis:** Users don't see value early enough
- **Experiment:** Show map preview before asking ZIP

### If Step 2 selection is low
- **Hypothesis:** Too many categories or unclear value
- **Experiment:** Pre-select categories based on store type

### If Step 3 CTA isn't converting
- **Hypothesis:** Insights feel static
- **Experiment:** Add SKU-level examples + "estimated savings"

### If mobile drop-off is higher
- **Hypothesis:** Map experience is too heavy
- **Experiment:** Replace map with simplified heatmap on mobile

---

## What I'd Build Next

### With More Time (1-2 weeks)

**AI-Powered Product Recommendations**
- Use store type, location, and selected categories to generate specific SKU recommendations
- Show *why* each product fits: "This sells well in similar convenience stores in Hudson County"
- Surface products the owner might not have considered based on what's working at similar stores

**Detailed Store Action Plan**
A downloadable or emailable summary including:
- **Gap analysis:** What nearby stores stock that you might be missing
- **Savings projections:** Estimated cost savings based on RepRally pricing
- **Trend alerts:** Category-specific opportunities for their ZIP
- **Suggested first order:** Curated starter list with reasoning

**Smarter Insights Engine**
- Cross-reference store type with ZIP demographics for hyper-relevant opportunities
- Seasonal trend detection (category performance by time of year)
- Competitive benchmarking against similar stores in the area

### With More Time (1 month+)

**Partial Progress Recovery**
- Auto-save after each step
- Email nurture for abandoned onboardings
- "Continue where you left off" functionality

**Lead Scoring**
- Score leads based on: store type, engagement level (map clicks, time spent), market density
- Route high-intent leads to senior reps immediately
- Nurture lower-intent leads with automated content

**Referral Loop**
- Post-completion: "Know another store owner? Share your market report"
- Track referral attribution in analytics

---

## Tech Stack

- **React + TypeScript** — Component architecture
- **Vite** — Build + dev speed
- **Tailwind CSS**  UI styling
- **Leaflet** — Interactive maps
- **PostHog** — Product analytics
- **Vercel** — Hosting and deployment

---


## Running Locally

```bash
git clone <repo-url>
cd nj-store-onboarding
npm install
npm run dev
```

---

## Note on Data

The competitive landscape data (nearby stores, ratings, store types) is computed from the real NJ stores dataset provided. Growth percentages and trending product insights shown in the UI are illustrative/template-driven to demonstrate the intended user experience, as permitted by the challenge brief ("feel free to create light fictional or AI-generated insights to make the experience richer and more realistic").

---

