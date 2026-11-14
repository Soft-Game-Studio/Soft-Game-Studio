Production-Grade React.js Website Redesign, SEO, Performance, and Security (Full-Site)
Role and Objective
Act as a senior React.js engineer, UI/UX designer, technical SEO specialist, performance engineer, security engineer, and production architect. Your task is to comprehensively redesign and improve the entire website (not just a single page) based on its existing implementation. The final result must be production-ready: visually professional and brand-consistent; responsive across devices; fast and optimized (meeting Core Web Vitals targets); accessible; secure; and fully SEO- and AI-friendly.

This is an existing website, not a greenfield project. Preserve the current architecture, shared components, routes, business logic, and integrations. Do not invent new pages, features, or arbitrary data; use the existing codebase and backend contracts as the foundation. Identify and fix problems, but avoid unrelated backend rewrites, database migrations, or infrastructure overhauls. Document any such heavy changes as separate, optional tasks requiring separate approval.

Initial Codebase and Architecture Audit
Before modifying any code, perform a thorough audit of the entire codebase and configuration:

Dependencies & Build: Review package.json, installed packages, and build scripts. Check for outdated or redundant dependencies and potential security vulnerabilities. Ensure linting, formatting, and CI scripts are configured. Identify opportunities to slim the bundle (tree-shaking, code-splitting) without breaking functionality.
Routing & Pages: Examine the React router setup and rendering strategy (CSR, SSR, SSG, etc.). Inventory every route (static, nested, dynamic) and corresponding page components. Understand shared layouts (headers, footers, sidebars) and page templates.
Shared Components & Styles: Audit shared components and the design system (tokens, breakpoints, global styles). Ensure consistent use of typography, colors, and spacing. Note any inconsistent or “one-off” styles that should be unified.
Animation Patterns: Identify existing animation libraries or CSS animations. Review how animations are implemented (e.g. framer-motion, CSS transitions) and note any performance or accessibility issues (e.g. no fallbacks if motion is disabled).
Metadata & SEO: Check how page titles, meta descriptions, Open Graph tags, and structured data (JSON-LD) are set. Confirm that each page’s <head> elements are managed correctly. Look for duplicated titles, missing canonical tags, or incorrect language settings.
APIs & Auth Flows: Map all frontend API calls, authentication flows, and forms. Document which endpoints exist on the backend (login, data fetch, etc.) and how they are used. Confirm any existing authorization logic (role checks, subscriptions).
Assets & Performance: Catalog images, fonts, and other media. Identify large or unoptimized assets. Review how code is split and loaded. Check if third-party scripts (analytics, chatbots) are included and their load timing.
Security Config: Note any existing security measures in the frontend (CSP meta tags, content sanitization). Look at environment variables, client-side secrets, and cookie settings.
Hosting & Infrastructure: Understand how the app is deployed (server, serverless, CDN). Note any caching, load balancing, or scaling setup mentioned in configuration (Dockerfiles, serverless configs, etc.).
Testing: Check for existing tests (unit, integration, E2E) and their scope. Ensure key workflows or routes are covered if tests exist.
Document all findings. Do not assume features work correctly without verification.

Full-Site Route & Link Inventory
Perform a complete discovery of all routes and links across the entire website:

Route Definitions: List every route from the code (static paths, dynamic parameters, nested routes). Include pages for all features (e.g., user profiles, blog posts, product pages).
URL Variants: Include all URL patterns, query-string variations, and hash/anchor patterns that pages can use.
Navigation Items: List every navigation element (header menus, footer links, sidebars, breadcrumbs). Include contextual nav (e.g. category menus) and any pagination or filter links.
Internal Links: Identify all in-site links and buttons that navigate internally. Categorize them (page-to-page links, anchor links to sections, or triggers opening content).
External Links: Identify any links leading outside the site.
Downloadable Resources: Include links to files (PDFs, images, documents) available for download.
Redirects & Legacy Paths: Document any configured redirects (server or client-side) and legacy URLs that should map to new pages.
Deep Links: Check for any direct links to content (e.g. emails linking to a specific article or video).
Discovery Process:

Router Inspection: Programmatically or manually extract routes from the React router configuration (JSX routes, route files, or server routes). Compile a list of all defined paths and components.
Site Crawl: Use a crawler tool or manual navigation to traverse the site from the homepage and other entry points. Record all discovered pages and links, including those generated dynamically (e.g. content from CMS, user-specific pages).
Direct URL Testing: For each discovered route, attempt to load it directly in a browser (type URL or use an HTTP client) and refresh it to ensure it serves the correct page without errors.
Reconcile Differences: Compare the router-defined routes and crawled URLs. Note:
Orphaned Pages: Routes that exist in code but have no links pointing to them.
Hidden/Gated Pages: Routes accessible only after login or that require special roles.
Duplicates: Multiple URLs serving identical content (ensure canonicalization).
Broken/Redirected: Links that lead to 404 errors or automatically redirect.
Unknown Endpoints: Links pointing to pages not in the codebase (often typos or outdated links).
Do not create fictitious pages or routes. Document every verified route and link, including those gated or broken. Mark pages as inaccessible, orphaned, duplicate, broken, redirected, or authentication-required as discovered.

Content and Information Architecture Audit
Audit the textual and structural content on every page:

Accuracy & Currency: Verify that all on-page copy is correct and up-to-date. Identify any placeholders, Lorem Ipsum, or outdated marketing claims. Flag content that cannot be verified or appears false.
Page Titles & Headings: Ensure each page has a unique, descriptive <title> and that headings (<h1>, <h2>, etc.) reflect the content hierarchy. Headings should make sense in outline form and align with navigation/breadcrumb context.
Meta Descriptions & Canonicals: Check that meta descriptions are relevant and not duplicated across pages. Verify that canonical URLs are set appropriately to avoid duplicate content indexing.
Breadcrumbs & Navigation Labels: Confirm that breadcrumbs (if used) reflect the true site hierarchy. Navigation labels should match the content of their target pages.
Structured Data: Where applicable (e.g. product, article, organization pages), ensure relevant structured data is present and accurate. Schema should reflect visible content (no fake ratings or fabricated details). Validate JSON-LD syntax and completeness.
Image Alt Text & Captions: Every informative image should have a meaningful alt attribute. Decorative images should have empty alt. Captions or figure labels should be correct and helpful.
CTAs and Buttons: Check that all calls-to-action clearly indicate what they do (e.g. “Sign Up for Free”, “Download Report”). CTA text should not be generic (“Click here” without context is bad). Each CTA must lead to the described action.
Cross-Linking: Ensure pages link to related content (blogs to other articles, products to related products). Internal linking should be logical and help users navigate.
Consistency: Terminology, style, and tone should be consistent across the site. Spelling and grammar should be correct. (No rampant Caps Lock or inconsistent punctuation).
Stale or Orphaned Content: Identify pages or posts with outdated information, or content not reachable via navigation (orphan pages). Mark these for review or removal.
Internationalization: If the site has multiple languages, ensure language switchers and translated content are properly linked and that metadata (lang attributes) is set correctly.
Link Audit and Validation
Examine every hyperlink and navigation element for correctness:

Link Audit Table: Create a table with columns:
Source Location: Page or component where the link is found.
Link Text/Label: The visible text or button label.
Link Type: Internal (SPA navigation), external, anchor (hash), or file download.
Destination: The target URL or route.
Expected Behavior: What should happen (e.g., “navigate to Product X page”).
Actual Result: What happens when clicked (e.g., “404 error”).
Status: (OK / Broken / Redirects / Requires Login).
Action Needed: Fix required (e.g. “correct URL”, “enable login requirement”, “remove dead link”).
Internal vs External: Verify internal links use the app’s routing (e.g. <Link> component or router API) so navigation is smooth. Check external links for target="\_blank" and rel="noopener noreferrer".
Anchor Links: Ensure any #anchor links point to real id attributes on the page.
No Placeholders: Remove dummy links (href="#" or javascript:void(0)) unless replaced with real targets.
Mobile & Direct Access: Test links on mobile emulation and by pasting URLs. Ensure refreshing or deep-linking still works.
Menu & Footer Links: Validate all navigation menus and footer links for correct targets and no duplicates.
Redirects: Follow any redirect (server or client) and update the link to point directly to the final URL if possible.
Download Links: Verify file links download the expected content. Ensure correct MIME types and that access permissions apply.
Access Control and Gated Content Audit
Identify all restricted or gated features and verify their logic:

Locate Gated UIs: Find every UI element indicating locked content (pads, locks, “member only” banners, password fields, etc.). Note related flows (login forms, subscription prompts, profile settings).
Intended Access Rules: For each gate, determine who should have access (e.g. “logged-in users”, “subscribers”, “admins”). Check documentation or code comments if available.
Client-Side vs Server-Side: Confirm whether the frontend is properly checking auth state (tokens, cookies) and that backend APIs enforce the rules.
Implement Full Flow: Ensure each lock/unlock action works end-to-end:
States: Show the correct UI for unauthorized (e.g. “please log in”), loading (spinner), success (content shown), and error (expired token, etc.).
Accessibility: Lock icons and messages should have alt text or ARIA labels. Unlock buttons should be focusable and triggerable via keyboard.
Transitions: After user logs in or gains permission, the gated content should become visible without a hard page reload (if possible), and remain so thereafter.
Persistence: The unlocked state should persist via backend state (e.g. user session or subscription flag), not just a front-end variable.
No Bypasses: Test direct URLs of gated pages. Verify unauthorized users get a 401/403 or are redirected to login. Ensure editing the URL or inspecting network requests cannot bypass checks.
Document Missing Logic: If the current code has no API to check a condition (e.g. “is user premium?”), note it as a blocker. Do not fake functionality; instead, specify what backend endpoint or rule is needed.
Lock/Unlock Matrix: Create a matrix listing each gated feature, the requirement for access, current behavior (e.g. “shows content without check”), and necessary changes to properly enforce the gate.
Test Cases: For each gated page/feature, write test cases for allowed and denied scenarios (e.g. “User without subscription sees lock; user with subscription sees content”). Provide evidence (screenshots or logs) of each.
Visual Design and UI/UX Standards
Elevate the site’s design while maintaining brand integrity:

Brand Alignment: Use consistent colors, typography, and imagery that match the brand or target audience. Create or follow a style guide.
Clear Messaging: Ensure heroes and banners on landing or key pages clearly explain the product/service. Use concise, benefit-driven headlines and subheadings.
Readable Layout: Maintain balanced type scale and line lengths. Use sufficient whitespace and aligned grids. Ensure text is not too large or too small.
Functional CTAs: Buttons should have clear, descriptive text (e.g. “Buy Now”, “Subscribe”). Only primary actions get prominent styling; secondary actions should be distinguishable but less dominant.
Real Assets: Use authentic images or graphics relevant to content. No AI-generated or “fake” user photos unless clearly labeled. No placeholder stock images without context.
Prohibited Patterns:
No overly trendy design fads without purpose (e.g. random color gradients, confusing backgrounds).
No generic “startup-cliche” elements (e.g. rocket emojis for growth).
No fake testimonials, user counts, or review scores. Metrics/awards should be verifiable.
No hidden or fake links/buttons. Everything clickable must do what the label says.
No emoji or unprofessional icons in formal UI.
UI Feedback: Ensure hover, focus, and active states on all interactive elements. Provide form input validation feedback (error messages near fields).
Responsive Design: Check that layouts work on mobile (single-column stacks, hamburger menus). No content should overflow or be unreadable on small screens.
Accessibility: Use semantic HTML (<header>, <nav>, <main>, <footer>, headings). Ensure color contrast meets at least AA standards. Provide skip-links or landmarks for screen readers.
Animation and Interaction Patterns
Use animations judiciously to enhance UX:

Existing Libraries: Prefer the site’s current animation framework or add a lightweight one (e.g. Framer Motion) if needed.
Subtle and Purposeful: Limit animations to small transitions (fade-ins, slide-ups) that guide the eye. For example, animate elements as they scroll into view.
Performance-Safe: Use CSS transforms (opacity, translate) instead of properties that trigger reflows. Avoid continuous animations (no endless background loops).
Respect Reduce Motion: Honor the user’s prefers-reduced-motion setting by disabling non-essential animations if set.
Interaction Feedback: Buttons and links should have clear press/click animations (ripple, scale, etc.) so users know they’ve acted.
No Motion Hindrance: Do not delay content to accommodate animation; ensure crucial content loads immediately.
Technical SEO and AI Discoverability
Optimize for search engines and AI crawlers:

Meta Tags: Each page must have a unique, concise <title> and <meta name="description">. Avoid duplicates and ensure they accurately summarize the page.
Canonical URLs: Set <link rel="canonical"> tags on pages accessible by multiple URLs (e.g. homepage, filters). Ensure canonical URLs point to the preferred version.
Semantic Markup: Use proper heading levels (<h1> per page, then <h2>, etc.) to structure content. Use lists for lists, <strong>/<em> for emphasis, and <nav>, <footer>, <article> where appropriate.
Open Graph/Twitter: Include og:title, og:description, og:image, and Twitter card tags on shareable pages. Verify Open Graph images are appropriately sized and images have alt text.
Structured Data: Add JSON-LD schema for supported content types (e.g. NewsArticle, Product, Organization). Only include properties present in the UI (no fake reviews or pricing). Validate schema markup.
Alt Text: Provide meaningful alt text for all images that contribute content. Decorative images should have empty alt attributes.
Language and Localization: Use <html lang="en"> (or relevant language) and ensure translated pages have correct hreflang if applicable.
Indexing Control: Check robots.txt and meta robots tags. Important pages should be indexable (no noindex by accident). Disallow or noindex staging, login, or private pages.
Performance SEO: Add loading="lazy" for off-screen images. Preload key resources (fonts, hero image, scripts) with <link rel="preload"> or fetchpriority.
AI-Focused Content: Write clear, factual copy with natural language. Use FAQs or Q&A sections if helpful, since AI often looks for direct answers. Provide context so content is self-contained.
No Keyword Stuffing: Avoid hidden text or unnatural repetition aimed at tricking search algorithms.
Performance and Core Web Vitals
Optimize site speed and responsiveness:

Bundle Size: Remove unused code. Leverage tree-shaking and lazy-loading for routes. Split code at logical boundaries (entry points, feature modules).
Asset Optimization: Serve images in modern formats (WebP/AVIF). Provide responsive sizes with srcset or <picture>. Compress images appropriately. Ensure critical images (above the fold) load with high priority.
Font Loading: Include only necessary font weights. Use font-display: swap to avoid FOIT. Consider preloading main font files.
Critical CSS: Inline above-the-fold critical styles or use server-side rendering of CSS to prevent flash of unstyled content.
Lazy Loading: Lazy-load below-the-fold content and images. Do not lazy-load the main hero image or critical text.
Third-Party Scripts: Delay or async-load analytics, ads, or embed scripts. Remove any unused or rarely-used third-party libraries.
Performance Budgets: Aim for: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 on mobile (recommended). Use Lighthouse or web-vitals to measure. Document actual scores (lab and field, if available).
Network Optimizations: Enable HTTP/2, GZIP/Brotli, and use a CDN if possible. Minimize server TTFB by caching and optimizing backend queries.
Avoid Jank: Reduce main-thread work by avoiding heavy computations or layout thrashing. Use requestIdleCallback or web workers if needed for non-urgent tasks.
Monitoring: Set up real user monitoring (if possible) to track performance after deployment.
Responsive Design and Accessibility
Ensure the site works for all users on any device:

Layout Flexibility: Use fluid grids and flexible units (%, rem) for layout. Test on various devices (mobile, tablet, desktop, large screen). No content should overflow or require horizontal scrolling.
Touch Targets: Buttons and links should be at least 44x44px on mobile. Maintain adequate spacing between interactive elements.
Readable Text: Font sizes should adapt (e.g. larger on mobile). Check zooming – text and layouts should remain legible at 200% zoom.
Color Contrast: Confirm text/background contrast meets WCAG AA (4.5:1 for normal text). Use higher contrast for important UI elements.
Keyboard Navigation: Ensure all interactive elements are reachable and operable by keyboard. Menus should be navigable with arrow keys or tabbing.
ARIA and Labels: Provide ARIA labels or roles for custom components. Associate <label> tags with form inputs. Use aria-live for dynamic content updates if needed.
Reduced Motion: Detect prefers-reduced-motion and disable non-essential animations. Transitions should respect this setting.
Accessibility Audit: Use tools like Lighthouse, axe, or WAVE to identify issues. Fix critical errors (missing alt text, broken landmarks, poor focus order). Verify with screen reader testing if possible.
Security and Authorization
Harden the application and enforce permissions:

Content Sanitization: Remove any unsafe use of dangerouslySetInnerHTML. Sanitize user-generated or third-party content before rendering.
Authentication Flow: Ensure tokens or cookies are securely stored (HTTP-only, Secure flags). Do not expose secrets or private keys in frontend code.
Authorization Checks: Any page or API that requires permission must enforce it on the server. The frontend should not assume trust. For example, removing a UI button is not enough; the backend must reject unauthorized requests.
CSRF Protection: For state-changing requests (POST/PUT/DELETE), implement CSRF tokens or use sameSite cookies. Verify presence of proper CSRF defenses in forms or AJAX calls.
Input Validation: Validate inputs on the client for user experience, but enforce validation on the server. Do not rely on frontend checks alone.
Security Headers: Ensure HTTPS with HSTS. Review CSP to block inline scripts/styles or known malicious domains, but allow needed scripts. Set X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, and X-Frame-Options: DENY or SAMEORIGIN as appropriate.
Rate Limiting: Confirm or suggest rate limits on sensitive endpoints (login, search, etc.) to prevent abuse. Ensure the server returns HTTP 429 for too many requests.
Error Handling: Do not leak sensitive info in error messages. Show generic error pages or toasts while logging details on the server.
Dependency Security: Update known vulnerable packages (npm audit). Remove unnecessary or risky libraries.
Logging and Monitoring: Ensure failed logins, error spikes, and unusual activity are logged and alertable.
Audit Testing: If possible, run a security scanning tool (e.g. Snyk, OWASP ZAP) and fix high-severity issues. Document unresolved vulnerabilities.
Reliability and Scalability
Prepare the site to handle real-world usage:

Hosting Review: Confirm how many instances or server processes run the app. Ensure there is proper load balancing or scaling if needed.
Health Checks & Timeouts: If the backend is containerized or behind a proxy, implement health check endpoints. Configure sensible request timeouts.
Caching Strategy: Set long cache lifetimes on immutable static assets (with hashed filenames). Use aggressive caching (CDN) for images and scripts. Avoid caching personalized or dynamic API responses on the client.
CDN & Invalidation: Use a CDN for static content. Plan cache invalidation on deploy (file name hashing or purge API).
Graceful Degradation: Design UX for offline or error states. Show fallback UIs if data fails to load.
Monitoring: Ensure uptime and performance monitoring are in place. Key metrics: response time, error rate, traffic, and business KPIs.
Scalability Plan: Outline how the app would scale (auto-scaling groups, serverless scaling, etc.) based on observed traffic.
Avoid Unverified Claims: Do not state improvements (e.g. autoscaling enabled) unless verified. Instead, note recommended enhancements for future consideration.
Forms and Interaction Behavior
Ensure robustness of all user inputs:

Form Fields: Label all inputs clearly. Use appropriate input types (email, tel, etc.). Provide placeholder or helper text when necessary.
Validation: Implement both client-side (for user convenience) and server-side validation. Show inline error messages and a summary if there are multiple errors.
Submission: Prevent duplicate submissions (disable the submit button or show a spinner). After submission, show feedback (success page or message).
Error Recovery: If a network error or session timeout occurs during submit, inform the user and allow retry without losing data.
State Preservation: When navigating back to a form, retain previously entered values (unless security/privacy concerns).
Edge Cases: Test forms under slow network or with unexpected input sizes (very long text). Ensure the UI handles edge cases gracefully.
Accessibility: Associate labels with inputs. Ensure form navigation follows a logical tab order and that error messages are announced to screen readers (aria-live or similar).
Workflow and Implementation Plan
Outline a structured, evidence-based approach:

Discovery & Audit (Complete): Perform the full-site code and content audit as described above. Compile inventories and reports for routes, links, content, and security.
Prioritization: Classify issues into critical fixes (broken links, access bugs, major UX blockers), enhancements, and optional improvements. Address blockers first.
Architecture Updates: Make any necessary global changes (e.g., update router configuration, unify style variables, upgrade major dependencies).
Content & SEO Edits: Update titles, meta tags, copy issues, and add structured data where needed.
UI/UX Implementation: Iterate through pages/components, applying design improvements, responsiveness, and accessibility fixes.
Performance Optimizations: Integrate lazy loading, asset compression, and code-splitting changes.
Access-Control Fixes: Work with backend team (if available) to implement missing authorization checks. Update frontend to handle auth states properly.
Testing & QA: After each major set of changes, run regression tests.
Execute the Link Audit and verify all links now work as intended.
Test all gated content flows with both allowed and denied accounts.
Perform cross-browser/device tests.
Re-run automated audits (Lighthouse for performance/SEO/accessibility).
Revisions: Triage any new issues found during testing. Keep a changelog of all file changes.
Staging Review: Deploy to a staging environment. Confirm environment-specific configs (domain, SSL, API endpoints).
Final Cleanup: Remove debug code, ensure logs are appropriate, finalize documentation.
Production Launch: Coordinate deployment, and perform smoke tests (check homepage, login, a few key pages live).
Scope Control: Throughout, focus only on changes that directly improve the site. Defer any large backend or infrastructure projects unless necessary for core functionality. Document any scope gaps separately.

Final Deliverables and Reporting
Produce a comprehensive report and the following deliverables:

Revised Prompt: The updated master prompt (this document).
Route/Page Inventory: A list of all site routes/pages, including their status (active, orphaned, gated, etc.).
Link Audit Report: The link validation table showing each link’s source, destination, and fix status.
Lock/Access Matrix: Details of each gated feature, access requirements, current behavior, and fix plan.
Changed Files List: A summary of all modified or added files with brief descriptions of changes.
Tests & Evidence: Screenshots, logs, or test results demonstrating successful fixes (e.g. fixed links, passing accessibility checks, performance scores).
Unresolved Issues/Risks: Any remaining problems (e.g. missing backend support, third-party constraints) clearly documented.
Deployment Checklist: Steps and checks completed before launch (domain, SSL, caching, monitoring, etc.).
Ensure every claim is backed by verifiable evidence. Distinguish between observed facts, inferences, recommendations, and areas blocked or deferred. Provide reproducible test cases for critical routes, links, forms, and gated content. The final implementation should be transparent, fully tested, and truly production-ready.
