# SkillBridge — Glass Edition

An expressive, rounded, liquid-glass redesign of SkillBridge Studio PRO, inspired by high-energy editorial websites. It is **an original design**, not an asset or code copy of any third-party website.

## What's changed

- Replaced the fixed sidebar with a floating, responsive **top navigation** and mobile menu.
- Rebuilt the home page: editorial hero, translucent floating preview, animated bubble decoration, quick topic tiles, featured challenges, step-by-step journey, learning-path glass card, and a product CTA.
- Reskinned the challenge cards, practice workspace, tabs, buttons, modals, fields, portfolio, progress, feedback, and settings with one consistent visual system.
- Added softer transitions, keyboard-visible focus styles, responsive layouts and `prefers-reduced-motion` handling.
- Preserved the **33 synthetic challenges across 11 subjects**, six learning paths, skill evidence scan, guided cases and answer checking, progress, bookmarks, portfolio export, optional Gemini AI, optional WebLLM fallback, and static practice mode.
- Fixed a subtle UX issue where using the live case search and immediately clicking a result could fail after the search input's blur event.

## Easiest way to try it

Open `public/index.html` in a browser, or use the separate static-only package to upload the website folder to Netlify Drop.

## Replace your existing Netlify deployment (with Gemini)

1. Unzip this project.
2. Copy **all files inside** `SkillBridge_Glass_Edition/` into the root of your existing GitHub repository. The root must contain `netlify.toml`, a `public/` folder, and a `netlify/functions/` folder. Do not upload only `index.html`.
3. Commit/push the changes. Netlify should deploy the new version automatically. If not, trigger a deploy.
4. Keep these **Netlify server-side environment variables** (already set if Gemini previously worked):
   - `GEMINI_API_KEY`: your confidential Gemini API key
   - `SKILLBRIDGE_ACCESS_CODE`: a unique access code for your team
   - `SKILLBRIDGE_MODEL` (optional): model you have enabled in your Gemini API project
5. Redeploy after changing environment variables, and verify `https://YOUR-SITE.netlify.app/api/status` is returning JSON with `configured:true`. Then go to the app's **Settings** and connect with your team access code, and test a real Skill Scan. The status endpoint alone does **not** verify a live Gemini response.
6. Test on a desktop and on a phone.

**Alternative static-only deploy:** Use `SkillBridge_Glass_Static_Drop.zip`, unzip it and drag the extracted *folder* into [Netlify Drop](https://app.netlify.com/drop). This gives you the full practice library, progress, portfolio, and skill-scan *rule-based fallback*, but no server-side Gemini function. WebLLM can still be attempted on compatible browser hardware over HTTPS.

## Product limitations (important for your competition)

- This is a polished, working **competition beta**, not production-hardened SaaS. Learner progress is saved in each browser's local storage, not synchronized to an account.
- Existing saved progress from the prior **Studio PRO** release uses the same local-storage key and should remain on the *same site origin* unless browser data has been cleared.
- The optional Gemini backend requires a valid API key, model permissions, correct environment variables and available provider quota. Live provider calls cannot be validated without your configured deployment.
- WebLLM requires WebGPU-capable hardware, HTTPS and an initial large model download. The app always keeps a deterministic practice fallback, labeled honestly.
- The structured practice score checks calculations, selected decisions, and writing **completeness**; it is not a certification of reasoning quality or job proficiency.
- Cases are synthetic, not real employer/client projects. The portfolio output discloses this.
- The official competition prompt explicitly calls for an AI/NLP and **no-code** platform, genuine potential-user research, testing, at least one documented user-driven modification, a one-minute narrated demo and an eight-minute total briefing. This coded deployment does **not by itself** establish no-code compliance. A real Bubble/Make or equivalent workflow must still be demonstrated.
- Use fictionalized or redacted resumes and job descriptions when testing free-tier AI services. Never put API keys inside the web page or your repository.

## QA

- UI exercised in Chromium at desktop (1440 px) and mobile (390 px): top navigation, mobile menu, case topics and search, challenge opening, guided A/B case submission, structured review, portfolio record, skill-scan fallback, settings, theme. No JavaScript page errors in the simulated offline session.
- Backend mock tests: `node tests/test_api.mjs`.
- AI provider connections and production authentication must be verified in your deployed Netlify environment.

© SkillBridge student prototype.
