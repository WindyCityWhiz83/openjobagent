# Free AI Job Search and Application Platform – Blueprint

## Phase 1 — Product Definition

**Product Name**: *OpenJobAgent* (tentative).  The name conveys openness and the role of an agent that autonomously handles the job search and application process.

**Core User Personas**:

1. **Early‑career job seekers** who need help prioritising job postings and building credible resumes.  They benefit from match scoring, ATS‑friendly resumes, and targeted outreach; Jobright identifies this group as a key audience【763165844011671†L124-L129】.
2. **Busy professionals** with limited time to fill repetitive forms.  They value one‑click form filling and tracking, features highlighted in Jobright’s Chrome extension【763165844011671†L150-L163】.
3. **International candidates seeking sponsorship**: many job seekers need H‑1B‑friendly roles; Jobright even offers a dedicated H‑1B discovery page【763165844011671†L306-L307】.
4. **Mid‑career professionals** exploring lateral moves or up‑skilling; they need resume tailoring and contact discovery to reach hiring managers.

**Primary Use Cases**:

* Discover and prioritise new job listings based on skills and preferences.
* Generate tailored, ATS‑optimised resumes and cover letters for each role.
* Find hiring managers or recruiters and compose personalised emails.
* Autofill job applications across major ATS platforms such as Workday, Greenhouse, Lever and iCIMS—Jobright claims support for “90 % of major ATS”【763165844011671†L150-L163】.
* Track application status and schedule follow‑ups within a CRM dashboard.

**Competitive Advantages over Jobright**:

* **Fully free and open‑source** – the platform relies on open models and free infrastructure; there is no subscription paywall.
* **Global coverage** – includes international job boards and company pages; Jobright’s geographic coverage outside the U.S. is unclear【763165844011671†L323-L331】.
* **Transparent resume tailoring** – users can review and edit AI‑generated content; tailoring quality may vary by industry, so user control is essential【763165844011671†L314-L317】.
* **Improved reliability** – open‑source code and test harness to validate form‑filling accuracy; Jobright’s real‑world autofill accuracy can vary by employer implementation【763165844011671†L323-L327】.
* **Clear pricing** – the core features are free with optional paid extras; avoids hidden or scattered pricing details (Jobright’s pricing is scattered across blogs【763165844011671†L332-L335】).
* **Enhanced privacy** – processing can occur locally using tools like Ollama; user data is encrypted and not sold.  Jobright directs users to its privacy policy but details are sparse【763165844011671†L229-L236】.

**Ethical & Legal Guardrails**:

* **Consent and transparency**: obtain explicit user consent before automatically applying or contacting employers.
* **No misrepresentation**: resumes and cover letters must reflect the applicant’s true skills and experience; avoid fabricating credentials.
* **Respect Terms of Service**: scraping and auto‑applying should follow website TOS and legal guidelines; do not circumvent CAPTCHAs illegally.
* **Privacy by design**: encrypt user data at rest and in transit; abide by GDPR/CCPA; do not store sensitive personal identifiers beyond what is necessary.
* **User override**: provide a manual review option before any application is submitted on the user’s behalf.

## Phase 2 — Tech Stack (100 % Free)

**Frontend**:

* **Next.js/React** with **Tailwind CSS** for responsive user interfaces.  Deploy via **Vercel** or **Cloudflare Pages** free tier.
* Use **shadcn/ui** or other open‑source component libraries for consistent design.

**Backend**:

* **FastAPI (Python)** for RESTful API; Python’s ecosystem supports scraping, NLP and automation well.
* **PostgreSQL** hosted on free tiers such as **Supabase** or **Neon**.
* **Upstash** or **RedisStack** (free tier) for caching and job queues.  Upstash provides a serverless key‑value store with automatic scaling and price scaling to zero【994445065100417†L31-L37】.
* **Celery** or **RQ** for background task queues and scheduling.

**AI**:

* **Open‑source LLMs** hosted locally via **Ollama**.  Ollama runs large language models on the user’s machine and exposes an API for interaction【78397142437765†L95-L122】.  Models can be swapped easily.
* Models to include:
  * **Llama 3** – Meta’s open weights offer improved reasoning and instruction following【738563350071659†L61-L89】.
  * **Mixtral 8×7B (Mistral)** – a sparse mixture‑of‑experts model that outperforms Llama 2 70B while using only 12.9 B active parameters per token【676574330922511†L31-L57】.
  * **DeepSeek V3/R1** – open LLMs released in December 2024; they are freely available for use and modification and rival the best closed models, with hundreds of downstream variants【126923204268496†L150-L165】.
  * **Gemma 3** or similar small models for resource‑constrained devices【78397142437765†L95-L122】.
* **SpaCy** + **PDFPlumber** for resume parsing and text extraction.

**Scraping**:

* **Playwright** – a cross‑platform browser automation toolkit that navigates, clicks and executes JavaScript, ideal for scraping dynamic websites【792006826618497†L293-L325】.
* **Scrapy** & **BeautifulSoup** for static pages.

**Automation & Orchestration**:

* **LangChain** – chains together LLM calls and integrations, supporting agents and retrieval‑augmented generation【178187621937387†L314-L360】.
* **Celery Beat** or **APScheduler** for recurring tasks.

**Email**:

* **Gmail SMTP** through OAuth2 to send personalised emails; avoids storing passwords.
* **Mailgun free tier** for fallback if Gmail quotas are exceeded.
* **Hunter.io alternative using scraping**: implement email pattern guessing and SMTP verification; avoid paid APIs.

**Hosting/Infrastructure**:

* Deploy backend on **Render**, **Railway**, or **Heroku** free tiers.
* Containerise applications using **Docker** for reproducible deployments.
* Use **GitHub Actions** for continuous integration and deployment.

## Phase 3 — System Architecture

### End‑to‑end Data Flow

1. **User Interface** – user logs in (OAuth), uploads a master resume, sets preferences (titles, locations), and toggles automation settings.
2. **Job Ingestion Pipeline** – scheduled workers run Playwright/Scrapy spiders to fetch jobs from Indeed, LinkedIn Jobs, Google Jobs, company career pages and Wellfound.  Extract structured data and store in the database, de‑duplicating by URL or job ID.
3. **Resume Generation Pipeline** – parse each job description using spaCy; compare with the user’s master resume; identify missing skills; use an LLM to draft a tailored resume and cover letter with quantifiable achievements and ATS‑friendly phrasing; store the documents for later use.
4. **Email Discovery Logic** – use company domain heuristics to guess email patterns and scrape LinkedIn for recruiter names and roles; perform SMTP verification to assign confidence scores.
5. **Auto‑Apply Engine** – for each selected job, use Playwright to autofill forms, upload the tailored resume, answer screening questions via heuristics or an LLM, and submit the application.  Implement random delays and rotate user‑agents to reduce bot detection and abide by sites’ terms.
6. **Follow‑up Automation System** – schedule and send personalised follow‑up emails after submission (e.g., after 7 and 14 days) using Gmail SMTP; update CRM status when replies are received.
7. **Anti‑bot Detection & CAPTCHA Fallback** – use stealth settings in Playwright, randomised interactions and proxies; detect CAPTCHAs and require the user to complete them manually; do not use illegal CAPTCHA‑bypassing services.
8. **Tracking & Dashboard** – log each application and status change in the database; present analytics on success rates, time saved, and match scores.

## Phase 4 — Core Modules (Detailed Build Specs)

### 1. Job Scraper Engine

* **Sources**: Indeed, LinkedIn Jobs, Google Jobs, company career pages (Workday, Greenhouse, Lever, iCIMS), AngelList/Wellfound.
* **Implementation**:
  - Use **Scrapy** for static sites (e.g., Indeed) and **Playwright** for dynamic ones (LinkedIn, Workday).  Playwright navigates real browsers and handles JavaScript【792006826618497†L293-L325】.
  - Create spiders per source; parameterise search filters (keywords, location, remote, salary).  Schedule daily runs; randomise delays to respect robots.txt.
  - Extract fields: `job_id`, `title`, `company`, `location`, `salary`, `url`, `description`, `source`, `date_posted`, `ats_type`.  De‑duplicate by hashed `url` or `external_id`.
  - Provide API endpoint `GET /jobs` to query jobs by filters.

### 2. Resume Personalization Engine

* **Job Description Parsing** – use **spaCy** to extract required skills, responsibilities and keywords.  Identify differences between JD tokens and the user’s master resume.
* **Skill Matching & Bullet Optimization** – map the user’s achievements to the JD; rewrite bullets to emphasise quantifiable impact and align with keywords.  Use an LLM (via LangChain) to generate improved bullets.  Use heuristics to avoid repetition and maintain conciseness.
* **Quantification & ATS Scoring** – convert qualitative statements into quantitative metrics; implement an ATS scoring function that counts keyword overlap and readability.  Provide the score to the user.
* **Output** – generate Word/PDF using **python‑docx** or **reportlab**; save to `Resumes` table and present in the UI.  Allow manual edits before finalising.

### 3. Hiring Manager Finder

* **LinkedIn Role Detection** – use Playwright to search LinkedIn for “Company + Recruiter” or “Company + Hiring Manager” and filter by location.  Collect names, titles and URLs.
* **Email Guessing** – infer the company domain using MX records or website; test patterns like first.last@domain, firstlast@domain and first_initial+lastname@domain.  Verify deliverability via SMTP handshake.  Avoid sending actual messages during verification.
* **Confidence Scoring** – combine pattern match, role relevance, and SMTP verification results into a confidence score; expose this to the user.

### 4. Auto‑Apply System

* **Form Autofill** – use Playwright to fill out ATS forms; map fields to user data; handle file uploads; manage multi‑page forms; confirm successful submissions by parsing confirmation messages.
* **Resume Upload** – automatically upload the tailored resume; wait for completion and handle errors.
* **Screening Questions** – answer yes/no or multiple‑choice questions using heuristics; for open questions, use an LLM to draft a brief answer based on the user’s profile and JD.
* **CAPTCHA Detection & Retry Logic** – detect CAPTCHAs and pause for user input; if submission fails, retry with backoff up to a configured limit; log errors.

### 5. Job CRM Tracker

* **Status Columns**: `saved`, `applied`, `interview`, `offer`, `rejected`, `archived`.
* **Notes & Tags**: allow users to annotate applications with notes (e.g., recruiter name, interview feedback) and tags for organisation.
* **Reminders & Follow‑ups**: schedule follow‑up emails; track whether a follow‑up was sent and whether a response was received.
* **Analytics**: display charts (e.g., applications per week, response rate, success by keyword); provide filters by date range and job title.

## Phase 5 — Database Schema (Simplified ERD)

| Table | Key Fields | Description |
|---|---|---|
| **Users** | `id`, `email`, `name`, `hashed_password`, `preferences`, `created_at` | Registered users and their settings. |
| **Jobs** | `id`, `source`, `external_id`, `title`, `company`, `location`, `salary`, `description`, `url`, `ats_type`, `date_posted`, `fetched_at` | Stored job listings. |
| **Resumes** | `id`, `user_id`, `job_id` (nullable for master resume), `file_path`, `score`, `created_at` | Generated resumes and their ATS scores. |
| **Applications** | `id`, `user_id`, `job_id`, `resume_id`, `status`, `applied_at`, `notes` | Tracks each application and status changes. |
| **Contacts** | `id`, `job_id`, `name`, `title`, `email`, `linkedin_url`, `confidence_score`, `source` | Potential hiring managers/recruiters per job. |
| **FollowUps** | `id`, `application_id`, `sent_at`, `content`, `status` | Follow‑up emails and their responses. |
| **ActivityLog** | `id`, `user_id`, `activity_type`, `details`, `timestamp` | Logs actions (job scraped, resume generated, application submitted, email sent). |

## Phase 6 — MVP Feature List (30‑Day Build)

**Week 1**: Set up repository and CI/CD; implement user authentication; build job scraping pipelines for at least two sources (Indeed, LinkedIn) using Playwright/Scrapy; design database schema; implement job ingestion API; start resume parsing with SpaCy and PDFPlumber.

**Week 2**: Implement resume personalisation engine; integrate LLM via Ollama; build API endpoints to generate tailored resumes and cover letters; implement email discovery logic (LinkedIn scraping, email guessing) with confidence scoring; design simple UI pages (Dashboard, Job Feed).

**Week 3**: Build auto‑apply system using Playwright; implement form mapping; handle file uploads; implement retry and error logging; integrate CRM tracker in the database; create API endpoints for applications; build UI for application tracker.

**Week 4**: Finalise dashboard UI; implement follow‑up automation; integrate email sending via Gmail SMTP or Mailgun; polish job filters and match scoring; add analytics; deploy to Vercel/Heroku; run manual tests; prepare documentation; launch.

## Phase 7 — Full User Flow

1. **Onboarding** – user signs up, connects Gmail (OAuth), uploads a master resume and sets preferences (job titles, locations, salary range, remote/hybrid).  They can choose automation settings (manual, semi‑automatic, fully automatic).
2. **Discovery** – daily, the job scraper fetches new listings; match scores are computed; user receives a curated job feed in the Dashboard/Job Feed.
3. **Resume & Cover Letter Generation** – for each job the user selects, the system generates a tailored resume and cover letter; the user can edit them in the Resume Studio.
4. **Contact Discovery** – the platform finds relevant recruiters or hiring managers; displays them with confidence scores and contact information.
5. **Auto‑Apply** – user reviews application details and toggles auto‑apply; the engine fills forms, uploads documents and submits the application.  If a CAPTCHA appears, the user is prompted to solve it.
6. **Tracking & Follow‑up** – once an application is submitted, it appears in the CRM tracker; status updates automatically based on confirmation emails or scraping; follow‑up emails are scheduled and sent using Gmail SMTP or Mailgun.
7. **Dashboard & Insights** – the user sees progress metrics (applications sent, interviews obtained, offers), follow‑up reminders and upcoming tasks.

## Phase 8 — UI Screens (Text Wireframes)

* **Dashboard** – overview of total applications, success rates, upcoming tasks and quick links to active job matches.
* **Job Feed** – list of recommended jobs with match scores, company logos and quick preview; buttons: “Save”, “Generate Resume”, “Auto‑apply”.
* **Resume Studio** – editor showing the master resume on one side and the tailored version on the other; includes ATS score meter and suggestions.
* **Application Tracker** – Kanban‑style board with columns (Saved, Applied, Interview, Offer, Rejected, Archived).  Each card shows job details, resume version, contact info and notes.
* **Recruiter Contacts** – table listing hiring managers with names, titles, emails, confidence scores and action buttons to send email or add notes.
* **Follow‑up Automation** – scheduling interface to set follow‑up intervals; templates preview; list of sent follow‑ups.

## Phase 9 — Monetisation (Optional)

While the core platform is free and open source, optional revenue streams include:

* **Premium Automations** – access to additional job boards and advanced filtering; higher concurrency for scraping and auto‑apply.
* **White‑label SaaS** – custom branding and features for universities or recruitment agencies.
* **Recruiter Access** – allow recruiters to search candidate profiles (with candidate opt‑in) and pay for targeted outreach.
* **Resume Optimisation Upsell** – offer professional human review or advanced analytics as a paid add‑on.

## Phase 10 — Execution Commands

### Technical Blueprint & API Specifications

**API Endpoints (examples)**:

* `POST /users/register` – create a new user account.
* `POST /auth/login` – authenticate and issue a JWT.
* `GET /jobs` – retrieve job listings with filters; query parameters: `title`, `location`, `date_posted`.
* `POST /jobs/scrape` – (admin) trigger scraping job manually.
* `POST /resume/generate` – body: `{ user_id, job_id }`; returns tailored resume file and ATS score.
* `POST /cover/generate` – generate a cover letter using a similar pattern.
* `POST /contacts/discover` – body: `{ job_id }`; returns a list of potential contacts with confidence scores.
* `POST /applications/apply` – body: `{ user_id, job_id, resume_id, auto_apply: bool }`; triggers the auto‑apply process.
* `GET /applications` – query a user’s applications; filter by status.
* `POST /followups/send` – body: `{ application_id, template_id }`; send a follow‑up email.

**Background Worker Logic**:

* **Job Scraper Worker** – runs on a cron schedule (e.g., daily); executes spiders; updates the Jobs table.
* **Resume Generator Worker** – triggered on demand when a user requests a tailored resume; stores the file and notifies the user.
* **Contact Discovery Worker** – triggered on demand; scrapes LinkedIn; verifies emails; caches results.
* **Auto‑Apply Worker** – consumes tasks from a queue; uses Playwright to fill forms; updates the Applications table.
* **Follow‑up Worker** – scheduled; checks pending follow‑ups; sends emails using Gmail SMTP or Mailgun; logs results.
* **Cleanup Worker** – periodic; removes stale jobs, expired sessions and old data.

**Scraping Strategies**:

* **Respect site policies** – moderate concurrency; abide by robots.txt; use official APIs when available; randomise delays to mimic human behaviour.
* **Data quality** – de‑duplicate jobs; filter expired listings; store `fetched_at` timestamps; cross‑reference across sources to reduce duplicates.
* **Rotation and stealth** – rotate user‑agents and proxies to avoid detection; use Playwright’s stealth plugin if available; always stay within legal and ethical boundaries.

### Example Resume Prompt Template (for LLM)

```
You are a professional resume writer.  Given the job description (JD) and the candidate’s master resume, rewrite the resume bullets to match the JD while maintaining truthfulness.
– Emphasise quantifiable achievements.
– Include relevant keywords from the JD.
– Maintain clear, concise language and avoid jargon.
Return the tailored resume in markdown bullet format.
JD: {job_description}
Master Resume: {candidate_resume}
```

### Example Cover Letter Prompt Template

```
You are an expert career coach writing a personalised cover letter.  Use the job title, company name and job description to craft a concise letter (250–350 words).
– Address the hiring manager by name if provided; otherwise use “Hiring Manager”.
– Highlight the candidate’s most relevant accomplishments.
– Convey enthusiasm and cultural fit.
JD: {job_description}
Candidate Experience: {summary_of_experience}
```

### Example Recruiter Email Template

```
Subject: Inquiry about {Job Title} at {Company}

Hello {Recruiter Name},

I hope you’re doing well.  I recently applied for the {Job Title} position at {Company}.  With {X years} of experience in {field}, including {relevant achievement}, I’m excited about the opportunity to contribute to your team.

I’d welcome the chance to discuss how my skills align with {Company}’s goals.

Thank you for your time and consideration.

Best regards,
{Your Name}
{LinkedIn Profile or Portfolio Link}
```

### Step‑by‑Step Launch Playbook

1. **Project Setup** – create a Git repository and set up CI/CD with GitHub Actions; configure Vercel (or equivalent) for Next.js deployment and Heroku/Render for FastAPI.
2. **Data & Model Preparation** – install and configure Ollama; pull open‑source LLMs (e.g., Llama 3, Mixtral, DeepSeek); prepare spaCy models and dictionaries.
3. **Build Core Infrastructure** – implement database schema and migration scripts; set up Redis/Upstash for queues; integrate Celery; implement user authentication with JWT and hashed passwords.
4. **Develop Job Scraping Module** – build spiders for initial job sources; integrate scheduler; test on sample queries; store results in the Jobs table.
5. **Develop Resume Personalization Module** – implement resume parser; create LLM prompts; design resume template; build API endpoint; store generated resumes.
6. **Develop Hiring Manager Finder** – write LinkedIn scraping script; implement email pattern generator and SMTP verification; create API endpoint.
7. **Develop Auto‑Apply Module** – use Playwright to fill forms; handle file uploads; parse confirmation pages; implement logging and error handling.
8. **Develop Frontend Features** – build Job Feed, Resume Studio, Application Tracker, Contacts page and Dashboard; integrate with backend APIs; implement real‑time updates via WebSockets or polling.
9. **Testing & QA** – test scraping reliability across multiple job boards; validate resume and cover letter quality with sample JDs; test auto‑apply across major ATS forms; measure accuracy; refine selectors.
10. **Privacy & Security Review** – conduct a security audit; implement encryption for sensitive data; review third‑party dependencies; draft privacy policy and terms of use.
11. **Soft Launch & Feedback** – invite beta testers; gather feedback; iterate on UX and features; monitor system performance; optimise scraping and background tasks.
12. **Official Launch** – publish the open‑source repository; deploy the stable version; announce the launch via social media and relevant communities; continue to collect feedback and contributions from users.

By following this comprehensive blueprint and using exclusively free and open‑source tools, a solo developer can build a robust, privacy‑focused job search and application platform that rivals and exceeds the offerings of paid solutions like Jobright.ai.  The blueprint emphasises transparency, global coverage, ethical scraping and data handling, and user empowerment, addressing many of the shortcomings observed in existing products【763165844011671†L297-L335】.