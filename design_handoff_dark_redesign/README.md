# Handoff: Joint Expenses — dark & playful redesign

## Overview
A full visual redesign of the Joint Expenses Tracker: a dark, "bold & playful" theme where
the **monthly balance is the hero**, each person has their own colour (Neil = green, Lou = violet),
and a **split bar** shows at a glance who has spent more this month. Same features as today
(add / edit / delete an expense, monthly summary, "who owes who", mark-as-paid → archive) — just
a modern dark UI.

## Ready-to-paste TSX (in `tsx/`)
Two of the trickiest pieces are provided as near-final components you can drop straight in:
- **`tsx/ExpensesSummary.tsx`** — the balance hero + split bar, plus a named `PersonSpendCards`
  export for the hero's right column. Keeps your existing totals/`archived` logic and `Modal`.
- **`tsx/EditableExpensesList.tsx`** — the expense feed with the ⋯ menu, edit sheet, and
  delete-confirm dialog, wired to your existing `updateExpense` / `deleteExpense` services.

They use Tailwind **arbitrary values** (e.g. `bg-[#141b18]`) so they compile before you add the
tokens to `tailwind.config.ts`, and expect a `--font-space-grotesk` CSS var for money figures
(set it up in `layout.tsx` via `next/font/google`). Treat the rest of the screens below as the spec.

## About the design files
`design-reference.html` in this folder is a **design reference created in HTML** — a prototype
showing the intended look and behaviour. It is **not** production code to copy.
Your task is to **recreate these designs inside the existing Next.js + Tailwind + Firebase app**,
reusing its established patterns (the Firebase services in `src/utils/expensesServices.ts`, the
`ExpensesItem` / `ExpensesList` types, the existing `Modal`, `Button`, `Card`, `DatePicker`
components, etc.). The data model does **not** change.

Open `design-reference.html` in a browser. It's a canvas — scroll to **turn 3** (top) for the final
direction. The options are labelled:
- **3a** — Desktop app (final)
- **3b** — Mobile app (final)
- **3c** — Edit sheet + delete-confirm dialog
- **3d** — Archive list
(Turns 1 & 2 below are earlier explorations — ignore for implementation.)

## Fidelity
**High-fidelity.** Colours, typography, spacing, and radii below are final — match them pixel-for-pixel
using Tailwind. Where a value isn't listed, read it off `design-reference.html`.

---

## Design tokens

### Colour
| Token | Hex / value | Use |
|---|---|---|
| `bg` (app background) | `#0c110f` | page background, mobile frame |
| `surface` | `#141b18` | cards |
| `surface-row` | `#111815` | expense rows inside a card |
| `surface-input` | `#0e1512` | inputs, date/who-paid fields |
| `surface-raised` | `#1a221e` | popover menu |
| `hairline` | `rgba(255,255,255,0.07)` | card borders |
| `hairline-input` | `rgba(255,255,255,0.09)` | input borders |
| `outline` | `rgba(255,255,255,0.12)` | ghost/secondary button borders |
| `text` | `#eef2f0` | primary text |
| `text-dim` | `#c3ccc7` | secondary text |
| `text-muted` | `#8a978f` | labels |
| `text-faint` | `#7c887f` | meta ("your half", dates) |
| **Neil / user1** | `#34d399` | avatar, dot, share, primary buttons |
| Neil tint bg | `rgba(52,211,153,0.15)` | avatar bg, active toggle |
| on-Neil (text on green) | `#06110c` | text on green buttons |
| **Lou / user2** | `#a78bfa` | avatar, dot, share, balance figure |
| Lou tint bg | `rgba(167,139,250,0.16)` | avatar bg |
| **danger** | `#fb7185` | delete |
| danger tint | `rgba(251,113,133,0.1)` | delete row / confirm icon bg |
| on-danger | `#1a0509` | text on the solid delete button |

> Neil is **always** green and Lou **always** violet across avatars, dots, the split bar, and
> summary figures. Map `user1Name`→green, `user2Name`→violet.

### Typography
- **Body / UI:** `Instrument Sans` (Google Fonts), weights 400/500/600/700.
- **Numbers & display:** `Space Grotesk` (Google Fonts), weights 600/700 — used for **every money
  figure**, the big balance, and the month chip in the archive. This is what gives the playful feel;
  don't render amounts in the body font.
- Balance figure: Space Grotesk 700, 66px desktop / 52px mobile, `letter-spacing:-0.03em`, line-height 1.
- Card/section titles: Instrument Sans 700, 17px. Row titles: 600, 15px. Meta: 12–12.5px.

### Radius
- Cards / hero: `22px` · expense rows: `15px` · inputs: `13px` · avatar tiles: `12–13px`
- **All buttons are pills: `border-radius: 9999px`** (no rounded-rectangle buttons anywhere).
- Small icon buttons (⋯): `10px`.

### Shadow
- Card elevation (modals/mobile frame): `0 30px 80px rgba(0,0,0,0.28)`
- Popover menu: `0 18px 40px rgba(0,0,0,0.45)`

---

## Global setup (do first)

**`tailwind.config.ts`** — add the palette above under `theme.extend.colors` (e.g. `neil`, `lou`,
`danger`, `surface`, `surface-row`, `surface-input`, `ink`/text ramp). Set `borderRadius.pill: '9999px'`.

**`src/app/layout.tsx` / `globals.css`** — replace the current Geist fonts with `Instrument Sans`
+ `Space Grotesk` (use `next/font/google`). Set `body { background:#0c110f; color:#eef2f0 }`.
Expose a `.font-num { font-family: var(--font-space-grotesk) }` helper (or a Tailwind `fontFamily.num`)
and use it on all money figures. Remove the light `bg-gray` page background.

**`src/components/Card.tsx`** — dark surface: `bg-surface border border-white/[0.07] rounded-[22px]`.

**`src/components/Button.tsx`** — make it a pill (`rounded-full`). Variants:
`primary` = `bg-neil text-[#06110c] font-bold`; `ghost` = `border border-white/[0.12] text-text-dim`;
`danger` = `bg-danger text-[#1a0509] font-bold`.

---

## Screens / components

### Header — `src/components/Header.tsx`
- Left: **logo mark** = a 34px rounded square (`rounded-[11px]`) with a 50/50 split fill
  `linear-gradient(120deg,#34d399 0 50%,#a78bfa 50% 100%)`, then wordmark "**Joint** Expenses"
  ("Joint" bold `#eef2f0`, " Expenses" `#7f8c84` weight 500).
- Center/right: **segmented toggle** for `Expenses` / `Archive` — a pill container
  `bg-surface border border-white/[0.07] rounded-full p-1`; active item `bg-[#242e29] font-semibold`,
  inactive `text-muted`. Drive the active state from `usePathname()` (as today).
- Right: **Logout** as a ghost pill (`border border-white/[0.12] text-text-dim`).
- **Mobile:** drop the hamburger **and** the N/L avatars. Show the same Expenses/Archive toggle
  full-width under the logo row, and "Logout" as small text top-right. (See 3b.)

### Home layout — `src/app/page.tsx`
Replace the current 2-column grid. New structure (desktop, 3a):
1. **Hero balance** row: a 2-column grid `grid-cols-[1.15fr_1fr] gap-[22px]`.
   - Left: the **Balance card** (see ExpensesSummary below).
   - Right: two stacked **person-spend cards** (`grid-rows-2 gap-[14px]`).
2. **Content** row: `grid-cols-[1.15fr_1fr] gap-[22px]` — left = **This month** feed
   (EditableExpensesList), right = **Add an expense** form (NewExpensesForm).

Mobile (3b): single column, stacked in this order — nav toggle, balance card, two person cards
(`grid-cols-2 gap-[10px]`), "This month" feed, then a sticky/bottom **Add expense** pill.

### Balance card + split bar — `src/components/ExpensesSummary.tsx`
This becomes the **hero**. Keep the existing calc (`user1Sum`, `user2Sum`, `totalSpent`,
`equalShare = total/2`, `owes = equalShare - sum`) — only the presentation changes.
- Card: radial-tinted dark panel `radial-gradient(120% 140% at 0% 0%,#16211c,#0e1613 60%)`,
  `border border-white/[0.08] rounded-[22px] p-[28px_30px]`, with a soft green glow blob top-right
  (`radial-gradient(circle,rgba(52,211,153,.22),transparent 70%)`, 180px, `overflow:hidden`).
- Content: label "Balance · June 2026" (`text-muted 13px`), then "`{ower} owes {owed}`" (`text-dim 15px`),
  then the **big figure** in Space Grotesk 700 66px coloured with the **owed** person's colour
  (violet when Neil owes Lou, green when Lou owes Neil). If settled, show "All square" instead.
- **Split bar** (directly under the figure):
  - Track: `height:14px; border-radius:9999px; overflow:hidden; display:flex`.
  - Segment 1 width = `user1Sum / totalSpent * 100%`, `bg #34d399` (Neil).
  - Segment 2 width = `user2Sum / totalSpent * 100%`, `bg #a78bfa` (Lou).
  - A 2px vertical marker at `left:50%`, `background:#eef2f0; opacity:.5`, extending 4px above/below —
    this is the "even split" line.
  - Legend row under it (12px): `Neil · £{user1Sum}` (green) · center `even split at £{equalShare}`
    (faint) · `Lou · £{user2Sum}` (violet).
- **Settle up** = primary pill. (This replaces "Mark as paid"; keep the existing archive action —
  it opens the same confirm Modal and calls `updateDoc(...,{archived:true})`.) **Remove** the old
  "View breakdown" idea — there is no second button.

### Person-spend cards (right of hero, 3a) / stat chips (3b)
Two cards, one per person. Each: coloured avatar tile (initial, person colour on tint bg,
`rounded-[13px]`), label "`{name} spent`", amount in Space Grotesk 600 24px, and a thin progress bar
(`bg #232b27` track, fill = that person's share %, in their colour) with "`{n}% of spend`".
On mobile these collapse to two compact chips (dot + "spent" label + amount).

### Expense feed — `src/components/EditableExpensesList.tsx`
Replace the table with a **feed of rows** (`flex-col gap-2`). Each row (`bg-surface-row rounded-[15px]
p-[14px_16px] flex items-center gap-[15px]`):
- Left: **payer avatar** — 38px `rounded-[12px]`, the initial of whoever paid, in that person's
  colour on their tint bg. "Who paid" = whichever of `user1Spent`/`user2Spent` is non-zero.
- Middle: expense **name** (600 15px) + meta "`{Sat 28 Jun} · {name} paid`" (`text-faint 12.5px`).
- Right: **amount** (Space Grotesk 600 16px) + "`your half £{amount/2}`" (`text-faint 11.5px`).
- Far right: a **⋯ button** (32px `rounded-[10px]`, `bg #1b231f`, `text-muted`) that opens a small
  popover menu (`bg #1a221e border border-white/10 rounded-[14px]`, shadow above) with:
  **✎ Edit expense** and **✕ Delete** (danger-tinted). Header row of the feed card:
  "This month" + "`{n} expenses · £{total} total`".
- Preserve the existing edit/save/validation logic; only the trigger moves into the ⋯ menu and the
  fields render in the edit sheet below.

### Edit sheet + delete confirm — `src/components/Modal.tsx` (restyle) + list/summary
See **3c**.
- **Edit sheet** (opens from ⋯ → Edit): dark `Modal` `bg-surface rounded-[22px] p-6`, title "Edit expense"
  + ✕ close. Fields pre-filled from the item: **name** input, **Date** (existing `DatePicker`, restyled
  dark), **Who paid?** = a 2-option segmented toggle (Neil green-active / Lou), **Amount** input with a
  green "£" affordance and a green focus border `border-[rgba(52,211,153,.35)]`. Footer: **Save changes**
  primary pill + **Cancel** ghost pill, and a red text link "Delete this expense" at the bottom.
  Wire Save → existing `updateExpense`.
- **Delete confirm** (from the menu's Delete, or the sheet's red link): centered dark dialog, red-tinted
  ✕ icon tile, "Delete this expense?", body "`"{name} · £{amount}"` will be removed for both of you.
  This can't be undone.", then **Delete expense** (danger pill) + **Keep it** (ghost pill).
  Wire → existing `deleteExpense`.

### Add-expense form — `src/components/NewExpensesForm.tsx`
Card titled "Add an expense". Fields (all dark, `bg-surface-input border border-white/[0.09]
rounded-[13px] h-[46px]`): **What was it for?** text, a `grid-cols-2` row of **Date** (DatePicker) +
**Who paid?** (Neil/Lou segmented toggle), then **Amount** with the green "£" + green focus border,
a faint helper "Split 50 / 50 — each pays £{amount/2}", and a full-width **Add expense** primary pill.
Keep existing validation & `addExpense`. On mobile, the button is a bottom pill (no "+" icon).

### Archive — `src/app/(routes)/archive/…`
See **3d**. Header uses the toggle with **Archive** active. Page title "Archive" + subtitle
"Months you've settled up" + a right-aligned "`{n} settled · £{total} total`".
List of cards (`flex-col gap-3`), one per archived `ExpensesList`, each row:
- Month chip: 52px `rounded-[14px] bg-surface-input border`, "May" (Space Grotesk 700 18px) over "2026" (10px faint).
- Month name (600 16px) + "`{n} expenses · £{total} total`" meta.
- "Settled" label + "`{ower} owed {owed} £{amt}`" (figure in the ower's colour).
- Green "Paid {date}" pill (dot + text, `bg rgba(52,211,153,.12) text-neil`).
- **View** ghost pill → opens that month's read-only list.
(Your model may need a `settledAt`/`paidDate` field on `ExpensesList` for "Paid {date}"; if absent,
derive from the archive timestamp or omit that pill.)

---

## Interactions & behaviour
- ⋯ opens the row menu (click-outside to close). Edit → opens the pre-filled sheet. Delete → confirm dialog.
- Settle up → existing mark-as-paid confirm → `archived:true`; the list then appears under Archive.
- Segmented toggles (Who paid, nav) animate the active pill background.
- Split-bar widths and all figures are derived live from `listItems` — no new data required.
- Responsive: the two hero columns and the feed/form columns stack under `lg`; feed rows keep the
  avatar + amount and hide the ⋯ label into a tap target; add-expense becomes a bottom pill.

## State
No new global state. Reuse existing hooks in `EditableExpensesList` (`editingItemId`, `editedItem`,
`modalOpen`, `deletingItemId`) and `NewExpensesForm`. Add only local `menuOpenId` for the ⋯ popover.

## Assets
- Fonts: **Instrument Sans** + **Space Grotesk** via `next/font/google`.
- Logo mark is pure CSS (gradient split square) — no image needed; you can retire `logo.svg`.
- No icon library required: ⋯ (U+22EF), ✎ (U+270E), ✕ (U+2715), › (U+203A), and coloured dots/CSS.

## Files to touch
- `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- `src/components/Card.tsx`, `Button.tsx`, `Header.tsx`, `Modal.tsx`, `DatePicker.tsx`
- `src/components/ExpensesSummary.tsx` (→ hero balance + split bar)
- `src/components/EditableExpensesList.tsx` (→ feed + ⋯ menu + edit sheet)
- `src/components/NewExpensesForm.tsx`
- `src/app/page.tsx` (layout)
- `src/app/(routes)/archive/…` (archive list)

## Suggested branch
`git checkout -b redesign/dark-playful`
