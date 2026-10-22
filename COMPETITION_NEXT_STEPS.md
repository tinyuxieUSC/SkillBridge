# USC Global MSBA Case Competition — what the app does and what the team still must do

**This package provides an actual demonstrable digital prototype**. It does **not** substitute for the user's research, prototype testing, iteration evidence, a no-code-platform build or final narrated demonstration.

| Official requirement | Current SkillBridge beta | Evidence still needed |
| --- | --- | --- |
| 1. Discovery and persona | Working hypothesis: students lack *demonstrated* skill evidence | Interviews/survey of real MSBA students, segmentation, root causes, documented persona |
| 2. User evidence | Skill scan and user feedback form | Real interview/survey results, student quotes used with permission, product hypothesis |
| 3. Ideation, Lean Canvas, PRD | Features and assumptions embodied in app | Record alternatives considered, first five Lean Canvas components, written PRD and acceptance criteria |
| 4. AI/NLP, no-code, MVP | Real Gemini/WebLLM integration in custom-coded beta, with 33 runnable cases | Demonstrate a genuine no-code product workflow, e.g. Bubble UI invoking Make scenario with AI extraction and feedback |
| 5. Voice of Customer | User testing form and CSV export | Have actual potential users test, analyze feedback, implement and show **at least one** user-driven modification |
| 6. Launch/pitch | Working end-to-end user journey and screenshots available | Launch/scale plan, **narrated video ≤ 60 s**, **8-minute presentation including video** |

## Suggested one-minute product video

- 00:00–00:10: Dashboard and 33-case library.
- 00:10–00:20: Load fictional resume/job requirements and show evidence gaps (label actual AI engine correctly).
- 00:20–00:36: Open the A/B testing case; reveal synthetic dataset; enter key calculations and a student-owned recommendation.
- 00:36–00:48: Show exact answer checks and optional advisory AI coaching.
- 00:48–01:00: Show saved progress and portfolio export, with synthetic practice disclosure.

## No-code implementation recommendation

To make a meaningful no-code proof for judges, don't merely display a Make logo. Build and demonstrate a real **Bubble → Make → AI → Bubble** process:
1. Bubble's UI collects fictional job-description and resume evidence.
2. Bubble sends the data to a Make webhook.
3. Make calls an AI model through an authorized HTTP connector and maps the JSON response to skill cards.
4. Bubble displays skill evidence gaps and routes the user to one of the catalog's cases.
5. Log the workflow on video / screenshots and include platform choice plus PRD match in the pitch.

Only claim this as completed once the actual Make/Bubble flow has been deployed and tested. Keep API keys in Make's private connector/credential system, not in the browser.

## Suggested measurable validation

- Challenge relevance: 1–5 user rating (collect genuine ratings, not target numbers as achieved outcomes).
- Task completion: count distinct real testers who finish a case.
- Correctness: rubric and answer-key check accuracy.
- Time to select an appropriate practice case: manual vs SkillBridge.
- Qualitative feedback: one improvement with before/after evidence.

## Honest demo language

'Our SkillBridge competition beta includes 33 curated cases and evaluates quantitative items automatically. When connected, Gemini or browser-based AI provides skill-evidence analysis and formative comments. This is a learning prototype, not a professional skill certification or a production multi-user SaaS.'
