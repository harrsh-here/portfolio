# Portfolio Design Guidelines

This document serves as the source of truth for creating new pages, components, and layouts in this portfolio project to ensure a cohesive and highly polished aesthetic.

## 1. Theme Engine & Colors
The entire site is powered by a dynamic CSS variable engine connected to React Context (`ThemeContext.jsx`).
- **Never use hardcoded hex codes** for accent colors (e.g. `#00f5ff`, `#a855f7`).
- Always use the semantic CSS variables provided in `index.css`:
  - `var(--bg-card)`: Opaque background for cards.
  - `var(--bg-surface)`: Slightly lighter surface for internal elements or gradients.
  - `var(--accent-cyan)`: The primary bright accent color for text, tags, and icons.
  - `var(--accent-glow)`: A low-opacity (10-15%) version of the accent color for shadows and subtle backgrounds.
  - `var(--border-accent)`: A 20-25% opacity version of the accent color for borders.

## 2. Card Layouts & Backgrounds
To avoid clipping errors and maintain a clean layout, do not use `::before` pseudo-elements for glowing card backgrounds.
- Instead, use **multiple backgrounds** directly on the card element.
- Example structure for a premium glowing card:
  ```css
  .new-card {
    border: 1px solid var(--border-accent);
    background: 
      linear-gradient(135deg, var(--accent-glow) 0%, transparent 40%, var(--accent-glow) 100%),
      var(--bg-card);
    background-size: 250% 250%, auto;
    animation: aurora 15s ease infinite;
    border-radius: 12px;
    padding: 32px 36px; /* Generous breathing space */
  }
  ```
- **Padding:** Always ensure cards have generous internal padding (`32px` or more for large cards, `24px-28px` for smaller tech cards) to allow the content to breathe. Do not crowd the glowing edges.

## 3. Dynamic Background Usage
The canvas-based background (`DynamicBackground.jsx`) runs globally.
- **Home Page**: Operates at full intensity, reacting to `scrollRatio` to reveal energy grids and waves as the user scrolls.
- **Projects List Page**: Operates at a ~30% reduced baseline grid opacity so as not to overwhelm the list of cards.
- **Individual Project Pages**: Operates at an "ultra-subtle" opacity (`0.012`) to provide a faint, premium texture without distracting from heavy text/content.
- **Handling New Routes**: If you create a new route, update the `location.pathname` logic inside `DynamicBackground.jsx` to assign an appropriate alpha/opacity profile.

## 4. Navigation & Layout Elements
- **Navbar**: The navbar uses a frosted glass effect (`backdrop-filter: blur(12px)`) combined with a solid dark fallback (`rgba(6, 8, 13, 0.85)`). It features a subtle glowing drop-shadow (`box-shadow: 0 4px 30px var(--accent-glow)`) and a bottom border to elegantly separate it from scrolling content.
- **Section Dividers**: Use the `<SectionDivider />` component to separate major vertical content blocks. It reads from the theme context to generate an animated sweeping gradient line.

## 5. Typography
- **Headings**: Use `var(--font-display)` for large impact headers (Hero section). Use `var(--font-mono)` for section titles and matrix/terminal aesthetic text.
- **Body Text**: Use `var(--font-sans)` with `var(--text-secondary)` for high legibility body paragraphs. Keep line heights generous (`1.6` or `1.7`).
