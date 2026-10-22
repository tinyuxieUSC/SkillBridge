# SkillBridge Live AI — Netlify deployment

This project upgrades the offline SkillBridge prototype with **real AI** for (1) job/resume skill-evidence comparison and (2) feedback on student challenge submissions. The existing cases and practice data remain curated and synthetic. It does NOT automatically generate arbitrary new business cases.

## What is inside

- `public/index.html` — the working website, including an access-code input.
- `netlify/functions/status.mjs` — verifies that your team's live-AI backend is available.
- `netlify/functions/skill-gap.mjs` — safely sends job/resume text to the model.
- `netlify/functions/review.mjs` — sends a synthetic case and student answers for rubric feedback.
- `netlify/functions/_shared/common.mjs` — shared backend utilities.
- `netlify.toml` — instructs Netlify which files are public and which are server-side functions.

## Before you start

1. You need a **Netlify account** and an **OpenAI API account/key with appropriate billing/credits**. ChatGPT Plus is not the same as API credits.
2. Choose a strong, private **team access code** (e.g. a randomly generated password). Don't put that code or your OpenAI key into any project file or Git repository.
3. Use **sample/anonymized resumes** for the demonstration. Text submitted to the AI endpoints is sent to OpenAI for analysis. The frontend saves student inputs on that device's browser only; it does not use shared accounts or a central database.

## Option A: Deploy using GitHub + Netlify (no terminal)

1. Create a new private GitHub repository named `skillbridge-live`.
2. Upload the CONTENTS of this folder so the repository ROOT contains `netlify.toml`, a `public` folder, and a `netlify` folder **with their internal directory structure preserved**. Don't upload the `.zip` as your repository's only file.
3. In Netlify, **Add new project → Import an existing project → GitHub**, select that repository and deploy it. The included `netlify.toml` sets the publish folder and function paths; leave the auto-detected defaults if they match.
4. In Netlify **Project configuration → Environment variables**, add:
   - `OPENAI_API_KEY`: your PRIVATE OpenAI API key
   - `SKILLBRIDGE_ACCESS_CODE`: your PRIVATE team access code
   - `SKILLBRIDGE_MODEL`: `gpt-4o-mini` (optional; this is the default)
   Enable the **Functions** scope if Netlify asks about variable scopes.
5. **Trigger a new deployment** so the functions can see newly configured environment variables.
6. Open your published URL. The top should read **AI ready · enter code**. Type the team access code into the sidebar and click **Connect live AI**. It should change to **Live AI connected**.
7. Test **Skill Scan** with the prefilled sample, and **Review & Portfolio** with a worked example. The scan's method should read **AI text comparison** and the review's method should read **AI rubric review**.

Git-backed deployment also makes updates straightforward: commit changed files and Netlify redeploys.

## Option B: Deploy through Netlify CLI (if you already have Node.js)

Run these commands from the FOLDER that contains `netlify.toml`:

```sh
npx netlify-cli login
npx netlify-cli link
npx netlify-cli deploy --prod
```

Select your existing SkillBridge Netlify project during `link`. Add the environment variables through the Netlify project dashboard as described in Option A, and redeploy. You must deploy the **whole project**, not just `public/index.html`.

## Quick troubleshooting

| What you see | Meaning / fix |
|---|---|
| Demo mode | The backend is missing or its environment variables are not configured. Check the Netlify Functions deploy log. |
| AI ready · enter code | Backend is configured; unlock with your private team access code. |
| Incorrect team access code | The entered code must exactly match `SKILLBRIDGE_ACCESS_CODE`. |
| AI rate limit or quota reached | Confirm API billing, rate limits, and available budget. |
| AI scan error; using demo scan | Backend failed; browser falls back to local rules. Check Netlify function logs and API key. |
| Double-clicked `index.html` directly | Static HTML alone cannot run a Netlify backend; test on the deployed URL. |

**Responsible demo:** Don't publicly post the team code; consider an OpenAI project spending cap and rotate the code when done. The password is only a simple team demo gate, not secure authentication for a production app. AI-generated assessments may be wrong and should be checked by humans.

**Competition compliance:** The Netlify backend is custom code. Putting it online and using AI does NOT, by itself, satisfy the contest's *no-code platform* requirement. For the final submission, document an actual Bubble/Make no-code workflow or migrate core functions there, plus collect real student research, prototype feedback, and at least one feedback-driven revision. Do not present uncollected data as actual findings.
