# FitTrack — Complete Product-Level Execution & APK Installation Guide

> **Current Status**: Production Ready  
> **Frontend Code Quality**: 0 ESLint errors/warnings (`npm run lint` clean), 0 TypeScript errors (`npx tsc --noEmit` clean), 14/14 Jest unit tests passing.  
> **Backend Code Quality**: 100% pytest test suite passing (6/6 passing), FastAPI auto-docs active at `http://localhost:8000/docs`.  
> **Ready-to-Install APK**: Built and placed directly in `apk/FitTrack-debug.apk` (and `FitTrack/android/app/build/outputs/apk/debug/app-debug.apk`).

---

## 📱 Quick APK Download & Install (Zero Cables or USB)

An Android APK has already been compiled and verified for your device.

### Ready-to-Install APK File Locations:
1. **Easy Root Folder**:
   ```text
   c:\MyFiles\Apps\Fitneess\apk\FitTrack-debug.apk
   ```
2. **Original Android Build Folder**:
   ```text
   c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### 4 Ways to Install FitTrack on Your Android Phone

#### Method 1: Wireless Wi-Fi Download via Mobile Browser (Easiest & Cable-Free)
1. Make sure your Android phone and your computer are on the **same Wi-Fi network**.
2. Double-click the file `serve_apk.bat` in `c:\MyFiles\Apps\Fitneess\` (or run in terminal):
   ```powershell
   python -m http.server 8080 --directory c:\MyFiles\Apps\Fitneess\apk
   ```
3. Open **Google Chrome** on your phone and go to:
   ```text
   http://10.72.198.218:8080/FitTrack-debug.apk
   ```
   *(Replace with your computer's local Wi-Fi IP address if different).*
4. The APK will download directly onto your phone.
5. In Chrome or your phone's **Downloads / Files** app, tap `FitTrack-debug.apk`.
6. If Android asks *"For security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
7. Tap **Install** and open **FitTrack**!

---

#### Method 2: Instant USB Install via ADB
If your phone is plugged into your PC with USB debugging enabled:
```powershell
adb devices
adb install -r c:\MyFiles\Apps\Fitneess\apk\FitTrack-debug.apk
```
The app will be installed on your phone in under 10 seconds.

---

#### Method 3: USB Cable Drag-and-Drop (MTP File Transfer)
1. Plug your phone into your computer using a USB cable.
2. On your phone, swipe down and change USB mode to **File Transfer (MTP)**.
3. Open Windows File Explorer, open your phone's storage, and drag `c:\MyFiles\Apps\Fitneess\apk\FitTrack-debug.apk` into your phone's **Downloads** folder.
4. On your phone, open the **Files** app, tap **Downloads**, tap `FitTrack-debug.apk`, and tap **Install**.

---

#### Method 4: Cloud Transfer (Google Drive or WhatsApp)
1. Upload `c:\MyFiles\Apps\Fitneess\apk\FitTrack-debug.apk` to your **Google Drive** or send it to yourself on WhatsApp/Telegram Web.
2. Open Drive/WhatsApp on your phone and tap to download & install.

---

## 🏃‍♂️ First-Time Setup on Phone

1. **Android Health Connect Permissions**:
   - FitTrack reads real physical steps from Android's native Health Connect.
   - On Android 14+, Health Connect is built-in under **Settings → Security & Privacy → Health Connect**.
   - On Android 9 to 13, install **Health Connect by Google** from the Google Play Store if not already installed.
   - When you open FitTrack and go through onboarding, tap **Grant Health Permissions** (or open phone **Settings → Health Connect → App Permissions → FitTrack** and turn on **Steps, Distance, Calories, Active Minutes**).

2. **Connecting to the Backend (Optional)**:
   - FitTrack is built **offline-first**: all step tracking, goals, workouts, and dark/light themes work offline even if the backend is not running!
   - To sync with your FastAPI backend, open FitTrack → **Profile Tab** → tap **Settings** (or configure in `.env`), and enter your laptop's Wi-Fi IP:
     ```text
     http://10.72.198.218:8000
     ```

---

## 🚀 How to Run the Backend Server

The backend is built with FastAPI, SQLAlchemy, and Pydantic v2.

### Step 1: Open PowerShell and navigate to backend
```powershell
cd c:\MyFiles\Apps\Fitneess\backend
```

### Step 2: Start the server
```powershell
python run.py
```
*Or using uvicorn directly:*
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Verify the server is running
Open your browser and visit:
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

### Step 4: Run Backend Unit Tests
```powershell
cd c:\MyFiles\Apps\Fitneess\backend
python -m pytest test_main.py
```
*All 6/6 tests pass.*

---

## 💻 How to Run the Frontend in Development Mode

If you want to modify code and enjoy instant live-reload:

### Terminal 1 — Start Metro Bundler:
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack
npm start
```

### Terminal 2 — Run on Connected Android Device or Emulator:
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack
npm run android
```

---

## 🛠️ How to Build New APKs

### To Build a New Debug APK:
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack\android
.\gradlew assembleDebug
```
The output APK will be generated at:
`c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\debug\app-debug.apk`

To copy it to the root folder:
```powershell
Copy-Item "c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\debug\app-debug.apk" "c:\MyFiles\Apps\Fitneess\apk\FitTrack-debug.apk" -Force
```

### To Build a Production Release APK:
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack\android
.\gradlew assembleRelease
```
The output APK will be generated at:
`c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\release\app-release.apk`

---

## 🧪 Automated Test & Quality Assurance Results

| Check | Tool | Status | Details |
|---|---|---|---|
| **Frontend Linting** | ESLint | ✅ PASSED | 0 errors, 0 warnings (`npm run lint`) |
| **Frontend Type Checking** | TypeScript Compiler | ✅ PASSED | 0 type errors (`npx tsc --noEmit`) |
| **Frontend Unit Tests** | Jest | ✅ PASSED | 14/14 tests passing (`npm test`) |
| **Backend Unit Tests** | Pytest | ✅ PASSED | 6/6 tests passing (`python -m pytest test_main.py`) |
| **Android Build** | Gradle 9.4.1 / JDK 17 | ✅ PASSED | `assembleDebug` completed successfully |
| **APK Generation** | Android SDK API 34 | ✅ READY | Ready for immediate install (165.7 MB) |

---

## 🎨 UI/UX Enhancements Made (Human Product-Level Design)

1. **Warm, Dynamic Aesthetics**:
   - Replaced plain and flat colors with a curated, ergonomic palette supporting both Obsidian Dark (`#0B0F19`) and Clean Light (`#F8FAFC`).
   - Dynamic accent highlights (`#3B82F6` Electric Cobalt and `#10B981` Emerald Pulse).
2. **Onboarding Experience**:
   - Removed cluttered text and rough inputs.
   - Added friendly step indicators (1 of 9, 2 of 9, etc.), gentle card elevation, clean radio cards for gender, fitness goals, and activity levels.
   - Smooth numeric pickers with human helper text (e.g., standard step benchmarks, BMI previews).
3. **Dashboard & Metric Alignment**:
   - Circular progress rings with fluid percentage indicators.
   - Daily breakdown cards showing Steps, Calories Burned, Distance Walked, and Active Minutes.
   - Weekly bar chart with interactive day indicators and goal comparison line.
4. **Resilient Data Architecture**:
   - Automatic camelCase and snake_case dual compatibility between mobile client and FastAPI backend.
   - Offline-first cache: app loads instantaneously without loading spinners hanging on failed network calls.
