# Numinous Path — Mobile Interface Design

## Product intent

Numinous Path is a private, contemplative mobile space for tarot and I Ching reflection. It guides a person from an honest question, through a quiet draw, toward an integrated reflection that privileges attention and discernment over prediction. The experience is local-first and does not require an account.

## Portrait interaction model

The application is designed for a 9:16 mobile portrait viewport and one-handed use. The primary action sits in the lower half of the home screen, the core reading flow advances through large thumb-reachable controls, and supportive navigation is limited to a native-style bottom tab bar. The visual direction is an editorial night garden rather than a mystical dashboard: ample dark space, soft paper surfaces, botanical linework, restrained gold accents, and clear hierarchy.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| **Home** | Presents a short invitation, a prominent “Begin a reading” action, the two reading paths, and the most recent saved reflection. |
| **Intention** | Collects an optional private question or focus, with quick intention prompts for work, relationships, decision-making, and the unknown. |
| **Draw** | Offers a tactile choice between tarot and I Ching, then reveals one symbol with a moment of stillness before advancing. |
| **Reading** | Shows the drawn symbol, an unbroken reflection, a dedicated discernment note for high-stakes wording, and actions to save or begin again. |
| **Journal** | Displays locally saved readings in chronological order, with title, method, date, and an excerpt. Selecting an entry reopens its reflection. |
| **Settings** | Provides a brief explanation of the app’s approach, a toggle for gentle motion, and a local-history reset action. |

## Key user flows

| Flow | Steps |
|---|---|
| **Create a reading** | Home → Begin a reading → enter or choose an intention → choose Tarot or I Ching → draw → view integrated reflection → save to Journal or begin again. |
| **Review a reflection** | Journal → select saved entry → read the full reflection → return to Journal or begin a fresh reading. |
| **High-stakes discernment** | User enters wording related to irreversible decisions → Reading displays a quiet “Discernment” reminder that invites pause, counsel, and attention to consequences rather than functioning as permission. |
| **Manage privacy** | Settings → review local-first note → clear locally saved readings when desired. |

## Color choices

| Role | Color | Rationale |
|---|---|---|
| Night ink | `#101321` | A deep blue-black base with enough warmth for extended reading. |
| Paper | `#F5F0E6` | A soft parchment surface that makes reflections feel held and readable. |
| Moss | `#7D9077` | A calm organic accent for I Ching and restorative states. |
| Ember gold | `#C6A86A` | A restrained highlight for selection, ritual moments, and key actions. |
| Rose clay | `#C98072` | A muted accent for emotional awareness and hard-card states. |
| Ink text | `#1D2230` | High-contrast editorial text for light surfaces. |

## Content and data model

The application stores readings only on the device. A reading includes an identifier, ISO date, method (`tarot` or `iching`), user intention, displayed symbol, a generated reflection, an optional discernment flag, and a short title. The first version uses a deliberately limited local symbol library and deterministic reflection templates so the entire experience works offline and never pretends to have an external oracle or a guaranteed outcome.

## Interaction and accessibility principles

The application uses familiar iOS patterns: a native bottom tab bar, large rounded primary controls, readable type, safe-area-aware layouts, low-amplitude press feedback, and minimum 44-point touch targets. It avoids strobing or aggressive animation. The reading text is always selectable visually through generous line spacing and contrast, while the decision-support language remains invitational rather than directive.
