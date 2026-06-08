# Sunil Kumar Yadav - Interactive Developer Portfolio

A fully interactive, premium, high-performance developer portfolio website engineered using **React**, **TypeScript**, and **Tailwind CSS**. 

## 🌟 Key Highlights & Features

### 📁 1. Secure Live Content Controller (Visual Editor)
This portfolio features a built-in visual admin editor panel, allowing you to instantly modify your live content directly from your browser without editing a single line of code!
- **Secure Access**: Verification layer protected by a customizable security PIN (**Default Code: `6393`**).
- **Direct Live Modifications**: Modify your profile picture URL, biography, social links, location, expertise, or direct contact methods instantly.
- **Dynamic Collection Management**: Add, update, or remove projects, skills percentage, certificates, and hobbies on the fly.
- **Durable Backup System**: Export your custom portfolio setup to a JSON file or restore a previous state instantly.

### 🐠 2. Interactive Physics Tools Aquarium
A custom-engineered HTML5 interactive bouncing playground depicting featured tools and frameworks:
- **Elastic 2D Collisions**: Solves pairwise circle-to-circle collision vectors preventing logos from overlapping or clipping.
- **Fluid Wall Bouncing**: Boundaries bounce automatically with dynamic scaling and high-performance rendering under a custom `requestFrame` animation loop.
- **Dynamic Interaction**: Hovering or touching items triggers smooth hover transitions.

### 📊 3. Live Visitors Counter
An eye-catching, custom-style real-time visitor counter that increments dynamically every 2 seconds, restarting seamlessly to mimic real-time activity metrics.

### 🌓 4. Dual Color Modes
A seamless, stateful Light/Dark style engine. Standardizes colors, glassmorphism card properties, borders, and typography instantly.

---

## 🛠️ Technology Stack
- **Library**: React (v19)
- **Language**: TypeScript (v5)
- **Build System**: Vite (v6)
- **Styling**: Tailwind CSS (v4)
- **Vector Icons**: Lucide React + FontAwesome v6
- **Animations**: Custom `requestAnimationFrame` Vector Physics Loop

---

## 🏃 Getting Started & Local Development

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Dev Mode
```bash
npm run dev
```
The dev server will boot up instantly. Access the live interface in your web browser.

### 3. Compile Production Build
To export fully optimized, minified static HTML/CSS/JS assets suitable for seamless deployment on Github Pages, Vercel, Netlify, or Cloud Run:
```bash
npm run build
```
The compiled files will reside ready in the `/dist` directory.

---

## 📂 Configuration & Project Schema
- `src/App.tsx`: The core container layout, modal control layers, and form managers.
- `src/components/ToolsAquarium.tsx`: Custom-coded fluid collision physics loop engine.
- `src/types.ts`: TypeScript configurations for structured interface state safety.
- `src/defaultData.ts`: Holds initial default values for Sunil's biography, project lists, and certifications.
