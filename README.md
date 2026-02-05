# 🏍️ Motorcycle Fleet Manager

A comprehensive fleet management application for motorcycle rental businesses. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **🏍️ Fleet Management** - Add, edit, and track motorcycles with Make/Model dropdowns (saved for reuse)
- **🔧 Service Records** - Detailed service tracking with cost analysis
- **📊 Analytics Dashboard** - Fleet statistics, brand breakdown, cost analysis
- **⚙️ Company Branding** - Customize with your logo, colors, and company info
- **📱 Mobile Responsive** - Works on all devices
- **☁️ Firebase Support** - Optional cloud sync across devices
- **💾 Offline First** - Works without internet, syncs when online

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - FREE)

#### Quick Deploy (Drag & Drop)
1. Go to https://app.netlify.com/drop
2. Drag the `dist` folder and drop it
3. Done! Get your URL like `random-name.netlify.app`
4. Rename in Site Settings → `yourcompany.netlify.app`

#### Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod
```

#### Connect GitHub (Auto-deploy on changes)
1. Push code to GitHub
2. Go to Netlify → Add new site → Import from Git
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy!

### Option 2: Vercel (FREE)
```bash
npm install -g vercel
vercel
```

### Option 3: GitHub Pages (FREE)
1. Add homepage to package.json: `"homepage": "https://username.github.io/repo-name"`
2. Install: `npm install gh-pages --save-dev`
3. Deploy: `npm run build && npx gh-pages -d dist`

### Option 4: Your Own Server
Upload the `dist` folder contents to any static hosting.

---

## 📱 Install as Mobile App

After deploying, users can install as a Progressive Web App:

| Device | How to Install |
|--------|----------------|
| **Android** | Open in Chrome → Menu (⋮) → "Add to Home Screen" |
| **iPhone** | Open in Safari → Share (↑) → "Add to Home Screen" |
| **Windows** | Open in Chrome/Edge → Address bar → Install icon (⊕) |
| **Mac** | Open in Chrome → Menu → "Install..." |

---

## 🔥 Cloud Database Setup (Firebase)

By default, data is stored locally in the browser. To sync across devices:

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Enter project name (e.g., `my-fleet-manager`)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Setup Realtime Database
1. In Firebase Console → Build → Realtime Database
2. Click "Create Database"
3. Select region (asia-southeast1 for India)
4. Start in **Test mode**
5. Copy the Database URL

### Step 3: Get Firebase Config
1. Go to Project Settings → General → Your apps
2. Click Web icon (</>) to add web app
3. Register app with any nickname
4. Copy the config values

### Step 4: Configure Environment Variables

**For Local Development:**
Create `.env` file in project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_APP_ID=your_app_id
```

**For Netlify:**
1. Go to Site Settings → Build & deploy → Environment variables
2. Add each variable with the VITE_ prefix

**For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable

### Step 5: Rebuild and Deploy
```bash
npm run build
netlify deploy --prod
```

---

## 👥 Distributing to Other Users

### Each user gets their own database:

**Option A: Single Company, Multiple Users**
1. Deploy once with your Firebase config
2. Share the URL with your team
3. All users share the same database

**Option B: Multiple Companies, Separate Databases**
For each company:
1. Create a new Firebase project for them
2. Fork/clone this repository
3. Configure their `.env` with their Firebase credentials
4. Deploy to Netlify/Vercel with their custom subdomain
5. They have their own isolated database

**Option C: Multi-tenant SaaS (Advanced)**
Requires backend modifications to:
- Add user authentication
- Partition data by tenant ID
- Use Firebase Auth + Firestore rules

---

## 🔒 Firebase Security Rules

For production, update your database rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Or for public access (not recommended for sensitive data):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure
```
src/
├── components/
│   ├── Analytics.tsx      # Fleet analytics dashboard
│   ├── BikeDetails.tsx    # Individual bike view
│   ├── BikeForm.tsx       # Add/Edit motorcycle form
│   ├── CompanySettings.tsx # Company branding settings
│   ├── Dashboard.tsx      # Main fleet dashboard
│   ├── ServiceHistory.tsx # Service records management
│   └── SetupWizard.tsx    # First-time setup
├── hooks/
│   ├── useDatabase.ts     # Firebase + localStorage hook
│   └── useLocalStorage.ts # localStorage persistence
├── lib/
│   └── firebase.ts        # Firebase configuration
├── types/
│   └── index.ts           # TypeScript definitions
├── utils/
│   └── helpers.ts         # Utility functions
└── App.tsx                # Main application
```

---

## 📋 Default Service Intervals

- **Time-based:** 5 months (configurable: 3, 4, 5, 6, 9, 12 months)
- **Distance-based:** 5,000 km (configurable: 3k, 4k, 5k, 6k, 8k, 10k km)

Service is due when **either** threshold is reached.

---

## 🎨 Customization

### Company Branding
Go to Settings tab to customize:
- Company logo (max 500KB)
- Company name and tagline
- Contact information
- Brand colors (primary/secondary)
- Business registration details

### Color Theme
The app uses your primary color for the header and accent elements.

---

## 📞 Support

For issues or feature requests, please create an issue on GitHub.

---

## 📄 License

MIT License - Free for personal and commercial use.

---

Made with ❤️ for motorcycle rental businesses worldwide
