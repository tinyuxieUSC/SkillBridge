# SkillBridge AI — Gemini + browser AI hybrid

**This is the upgraded SkillBridge project.** It preserves the existing skill-gap scan, three curated business challenges, advisory evaluation, portfolio export, and prototype feedback form.

## How the AI works

1. **First choice: Google Gemini**, used from a Netlify serverless function. The AI key is kept on the server. This requires a Gemini free-tier API key, a private team access code, and a full Netlify deploy.
2. **Backup: WebLLM in the student's browser.** Click **Load local backup** once, choose a lightweight or balanced model, and allow the model download. Once loaded, if Gemini is unavailable or rate-limited, SkillBridge automatically uses the local model for skill scans and reviews. It also works as the main AI if no Gemini server has been configured.
3. **Last resort: rules demo.** If neither AI is available, the existing deterministic rules remain usable. The interface explicitly marks them **not AI**.

No remote Gemini charges are required to run browser inference. Browser inference uses the *visitor's device*; it is not free hosting of an unlimited remote service. Initial downloads can be large, and hardware/browser compatibility varies. The tiny local model is less accurate than Gemini. WebLLM may need Chrome/Edge with WebGPU and available GPU memory. All user information should be fictional/anonymized during a student demo.

## Quick deployment — complete hybrid (recommended)

1. Unzip this package. The top-level folder contains `netlify.toml`, a `public/` directory, and `netlify/functions/`. **Do not upload only `index.html`**.
2. Create a private GitHub repo and upload the **contents** of this folder (retain the paths). Do not add credentials to the repository.
3. In Netlify, create a new project by **Import an existing project → GitHub**, select the repo, and deploy. The supplied `netlify.toml` sets `publish=public` and `functions=netlify/functions`. No npm build is required.
4. In [Google AI Studio](https://aistudio.google.com/apikey), get a Gemini API key with free-tier access. Free quotas and model access depend on your account, region, and the provider's current policies.
5. In Netlify's project environment-variable settings, set:

   | Name | Example value | Required |
   | --- | --- | --- |
   | `GEMINI_API_KEY` | your private key from AI Studio | Yes for Gemini |
   | `SKILLBRIDGE_ACCESS_CODE` | a secret password only shared with your testers | Yes for Gemini |
   | `SKILLBRIDGE_MODEL` | `gemini-3.5-flash-lite` | Optional; this is the default |

6. Redeploy the site so the functions can read the environment variables. Open the HTTPS project URL, enter the team code in the left sidebar, and press **Connect Gemini**. The first successful skill scan should show **Gemini AI (server-side)**.
7. On a supported desktop browser, click **Load local backup**. The progress message shows model loading. Once it says **Local AI ready**, a failed Gemini request falls back to **WebLLM browser AI** automatically.

### Simpler: publish a local-AI-only website

You can drag the **entire `public/` folder** to [Netlify Drop](https://app.netlify.com/drop). The WebLLM fallback can work there with no backend and no Gemini credentials, subject to WebGPU. The **Gemini functions do not get installed via a static folder drag-and-drop**. You still need to click **Load local backup** and permit the model download.

## Test the three modes

- **Gemini primary:** Connect Gemini; analyze the prefilled Product Analyst resume/job; the scan method should say `Gemini AI (server-side)`.
- **Local backup:** Click `Load local backup`. Temporarily remove/disable the Gemini connection or let a real provider error occur. The scan method should say `WebLLM browser AI` after local generation. A retry must complete before the same result is shown.
- **Rules demonstration:** If both services are unavailable, scans are labeled `Rule-based keyword demo (not AI)` and reviews `Rule-based demo rubric (not AI)`.

The app does **not** automatically generate brand-new practice datasets or cases. It uses three curated synthetic case templates: experimentation, retention and pricing. Users can download the CSV, submit their own reasoning, get an advisory review and export a Markdown portfolio draft.

## What is and isn't tested

**Tested:** The browser UI's end-to-end skill scan, challenge submission and review in deterministic demo mode, a mocked Gemini success path, and a mocked Gemini-failure-to-WebLLM path. JavaScript parse checks were passed.

**Not yet validated here:** Real Gemini API responses using your personal key, WebLLM's initial model download and GPU inference on your actual device, real Netlify deployment, usage quotas, or response quality across many student inputs. Test these before presenting the app as fully live.

## Responsible testing

- Do not put API keys in `public/` or client-side JavaScript; put them only in Netlify environment variables.
- Do not publish your team's access code. It is a shared gate, *not* per-user authentication or a production anti-abuse system. Even with the code, free quotas apply.
- Free-tier Gemini input may be processed according to Google's free-tier data-use policies. Use sample resumes with **no phone, email, address, or sensitive details**.
- For the competition's Voice-of-Customer requirement, collect genuine student feedback, then change at least one feature based on the results. The app's local feedback isn't shared among browsers by default; export and combine the genuine records.
- **This app is custom-coded and therefore does not itself fulfill the prompt's no-code-platform criterion.** To fully satisfy that requirement, replicate a meaningful piece of the workflow in Make or Bubble and document it.

## Technical contents

```
SkillBridge_Hybrid_Gemini_WebLLM/
  netlify.toml
  .gitignore
  README_FIRST.md
  public/
    index.html              # front end + curated business challenges
    js/local-ai.js          # browser inference engine via WebLLM CDN
  netlify/functions/
    status.mjs              # reports server setup (no secrets exposed)
    skill-gap.mjs           # Gemini skill-gap endpoint
    review.mjs              # Gemini practice-review endpoint
    _shared/common.mjs     # auth, validation, Gemini API call
```

### Reference docs

- [WebLLM getting started](https://webllm.mlc.ai/docs/user/get_started.html)
- [WebLLM predefined models](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts)
- [Google Gemini API models](https://ai.google.dev/gemini-api/docs/models)
- [Google Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Netlify Functions docs](https://docs.netlify.com/build/functions/overview/)

No credentials are embedded in this package.
