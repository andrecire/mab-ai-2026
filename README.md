# MAB October 2026: AI and the Management student experience

Six interactive Quarto slides for Prof. Andre Cire's ten-minute contribution to the UTSC Management Advisory Board meeting on October 14, 2026.

Source and rendered slides for the UTSC Management Advisory Board presentation.

Links:

- Repository: https://github.com/andrecire/mab-ai-2026

- Presentation: https://andrecire.github.io/mab-ai-2026/
- Reading view and program directory: https://andrecire.github.io/mab-ai-2026/explore.html

The certificate is a proposal for current and prospective UTSC Management students. Company/course combinations are illustrative. IBM's existing participation in MGOC15 is separate from any future certificate commitment.

## Build

Install [Quarto](https://quarto.org/docs/download/) and Python 3, then run:

```sh
quarto render
```

The pre-render script generates shared content from `data/programs.json` and `data/certificate.json`. It uses only the Python standard library. Generated files in `_includes/` and `scripts/content-data.js` should be regenerated rather than edited directly. The exceptions are `_includes/strengths.qmd` and `_includes/student-journey.qmd`, the hand-authored diagrams for Slides 4 and 5. The QR code on the closing slide points to the presentation URL above. If the repository name changes, update the QR code and printed URL before presenting.

Test locally with:

```sh
python3 -m http.server 8000 --directory docs
```

Open `http://localhost:8000`. Assets are local and use relative paths. The generated `docs` folder can also serve as the meeting's offline copy. Official program links require internet access.

## Present

Use the arrow keys or the on-screen controls. Press `S` for the presenter view and notes. The six slides allocate 6½ minutes to presenting, 2½ minutes to board feedback, and a one-minute navigation/closing buffer. Use at most two live detail clicks. The core story remains visible without interaction.

Slide 1 opens with “We need your help” on AI specialists and future program development. Allow 30 seconds for the introduction and 2½ minutes for the student journey, preserving the ten-minute total.

Slide 2 contains all 12 programs in three groups of four. Click a logo/title to populate the light panel on the right. Supporting facts and sources stay within the slide. The presentation has no background image or links to a separate detail page.

Slide 4 connects five strengths to the proposed AI certificate: Management expertise, Partners, industry partnerships, WIL and reimagined recruitment. Each box has a distinct illustrated symbol. Partners include Computer Science and other departments for software/hardware foundations; industry experiences span courses and activities across all courses; recruitment invites hiring organizations into courses, hackathons and events. Click any element to highlight its connection and show a short explanation below. The explanation fades in, with reduced-motion preferences respected. The complete diagram remains visible throughout. Curriculum development alongside Computer Science is a proposal. Keep the slide to one minute; any demonstration here counts toward the two-click budget.

Slide 5 follows a student from foundational courses through three illustrative industry course experiences (Google Agentic AI with Gemini; Microsoft agents and automation with Copilot Studio and Power Automate; SAS analytics and decisions with Viya), then recruiter events and entry into a company. The student marker moves left to right once on first entry, advancing every 7.2 seconds (three seconds longer per stage), then moves into the company illustration. Use Play/Pause/Replay, or click a stage heading for manual control. Opening a course pauses the animation. Reduced-motion preferences disable automatic playback and animated movement. The full route is always visible. The final stage represents the intended employment outcome.

The earlier `explore.html` reading view is retained as a reference file, including its filters and alternative project examples. The print control expands program and course details for a readable handout. No responses or personal data are collected.

## Update the content

- `index.qmd`: six-slide narrative and speaker notes.
- `_includes/strengths.qmd`: Slide 4 diagram, labels and click-through explanations.
- `_includes/student-journey.qmd`: Slide 5 route, stage cards and company/tool labels.
- `explore.qmd`: reading view and supporting context.
- `data/programs.json`: sourced program records, verification date and missing fields.
- `data/certificate.json`: proposed course areas and educational scenarios.
- `styles/`: source-deck styling and responsive reading-page styles.
- `scripts/interactions.js`: dialogs, filtering, pagination and scenario selection.

Missing program details are omitted rather than inferred. Recheck official sources before updating facts. This inventory is selected, not exhaustive.

## GitHub Pages

Publish from the `main` branch's `/docs` directory. Commit the complete rendered folder after running `quarto render`. Keep `docs/.nojekyll` so GitHub serves the generated output directly.

To publish updates:

1. Edit the Quarto sources, datasets or styles.
2. Run `quarto render` and review the local presentation.
3. Commit the source changes and complete `docs/` output.
4. Push to `main`; GitHub Pages deploys from `/docs`.
5. Check the presentation URL after deployment finishes.

The original PowerPoint remains outside this project and must not be uploaded with it. The personal homepage has not been changed.

The source PowerPoint is not part of this repository. The architectural background, Management logo and IBM course collage come from the supplied departmental presentation. They remain subject to their owners' rights. The website's public speaker notes contain only presentation guidance and claims shown in the website.


Institution logos are stored locally without modification. Original asset URLs are recorded in `assets/logos/sources.json`. They identify the existing program providers.

The fictional recruiter-event picture was created with the built-in image-generation tool. The saved asset is `assets/images/recruiter-event.png`; its final prompt and provenance are in `assets/images/recruiter-event-source.md`. It does not depict confirmed recruiters or an actual UTSC event. Official Google, Microsoft and SAS tool sources are linked inside the course details.
