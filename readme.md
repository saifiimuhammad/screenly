# 💎 Screenly – AI-Powered Resume Analyzer

_Submission for the [KendoReact Free Components Challenge](https://dev.to/challenges/kendoreact-2025-09-10)_

👉 **Live Demo:** [screenly.ai](https://ai-resume-analyzer-na44.onrender.com/)

---

## ✨ What is Screenly?

Screenly is your **AI-powered career sidekick**. It helps job seekers and recruiters **analyze resumes in seconds** with:  
⚡ **ATS scoring** → See how recruiter software reads your resume  
⚡ **Skill insights** → Find gaps & strengths instantly  
⚡ **Job-fit recommendations** → Understand how well you match a role

Powered by **Google’s Gemini AI**, wrapped in a **React + KendoReact UI**, and backed by an **Express server**.  
This isn’t just another project—it’s a tool to **win interviews**.

---

## 🚀 Features at a Glance

- 📂 Upload resumes in **PDF/DOC**
- 🧠 Smart **ATS compatibility scoring**
- 🎯 Instant **job-fit score** with colorful progress bars
- 🔍 **Skill gap analysis** & actionable recommendations
- ⚛️ Powered by sleek **KendoReact components**
- 📱 Fully responsive, fast, and modern

---

## 🎥 Screenshots

| Resume Upload                                                                                | Export Options                                                                               | Job Fit                                                                                      | Resume Review                                                                                |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ![Demo 1](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cdx68lhfxs8e0dk76td5.png) | ![Demo 2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xpqd8j0p5fkzmk0rxue7.png) | ![Demo 3](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cx4z9y6pd94djw7tm8rx.png) | ![Demo 4](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3o55gqq9ab3y2ja6mh0z.png) |

---

## 🛠 Tech Stack

- **Frontend:** React + KendoReact
- **Backend:** Express.js
- **AI Engine:** Google Gemini API
- **Hosting:** Render

---

## 🎨 KendoReact Components Used

💠 Buttons • Icons • Animations • ProgressBar • Notifications • Typography • TextArea • Tabs • Badges • Card • Inputs

---

## ⚡ Quick Start (Run Locally)

Set up Screenly on your machine in **5 minutes**:

```bash
# 1️⃣ Clone the repo
git clone https://github.com/saifiimuhammad/screenly.git
cd screenly

# 2️⃣ Install dependencies
npm install
```

✏️ **Config tweak:** Update server binding in `/server/index.ts`

```ts
// Change this:
server.listen(port, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:5000");
});

// To this:
server.listen(port, "localhost", () => {
  console.log("Server running on http://localhost:5000");
});
```

```bash
# 3️⃣ Add your environment variables
# Create a .env file inside /server
GEMINI_API_KEY=your_google_gemini_api_key

# 4️⃣ Run the dev server (from project root)
npm run dev

# 5️⃣ Open in browser
http://localhost:5000
```

---

## 🤖 AI-Assisted Build

This project was built **faster, smarter, cleaner** with AI tools:

- 🧪 **ChatGPT** → research & brainstorming
- 🚧 **Replit** → created MVP 7 wireframe
- ⚡ **GitHub Copilot** → faster component integration with KendoReact
- 🎨 Iterated design → **production-ready UI without the fluff**

---

## 🔗 Links

- 📂 **GitHub Repo:** [github.com/saifiimuhammad/screenly](https://github.com/saifiimuhammad/screenly)
- 🌐 **Live Demo:** [screenly.ai](https://ai-resume-analyzer-na44.onrender.com/)

---

🔥 **Screenly helps job seekers land interviews & recruiters save time.**  
If you vibe with it → smash that ⭐ on the repo!
