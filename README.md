# FITTRACK — Production-Quality Android Fitness Application 🏃‍♂️💨

FitTrack is a **100% free-to-run, zero-subscription, local-first Android fitness application** built with **React Native, TypeScript, Android Health Connect, Firebase Authentication (Google Sign-In), FastAPI, and PostgreSQL**.

FitTrack does **NOT** require Google Play Store publishing, paid cloud builds, paid fitness APIs, or monthly hosting subscriptions. It reads **REAL** fitness activity directly from your phone's Android Health Connect sensor subsystem and builds directly into an installable **Android APK** on Windows.

> 📦 **READY-TO-INSTALL APK AVAILABLE NOW!**
> - APK File: `apk/FitTrack-debug.apk` (and `FitTrack/android/app/build/outputs/apk/debug/app-debug.apk`)
> - 1-Click Wi-Fi Mobile Download: Double-click `serve_apk.bat` and open `http://<laptop-ip>:8080/FitTrack-debug.apk` in your mobile browser!
> - Detailed Step-by-Step Guide: See [RUN_AND_APK_GUIDE.md](RUN_AND_APK_GUIDE.md) for full instructions on phone setup, backend launch, and tests.

---

## 📑 Table of Contents

1. [Project Overview & Core Architecture](#1-project-overview--core-architecture)
2. [Prerequisites & Software Setup on Windows](#2-prerequisites--software-setup-on-windows)
   - [Java / JDK 17](#java--jdk-17)
   - [Node.js & npm](#nodejs--npm)
   - [Android Studio & Android SDK](#android-studio--android-sdk)
   - [Windows Environment Variables](#windows-environment-variables)
3. [Android Phone Setup (Physical Device Testing)](#3-android-phone-setup-physical-device-testing)
4. [Android Health Connect Setup](#4-android-health-connect-setup)
5. [Firebase & Google Sign-In Setup (Zero-Cost)](#5-firebase--google-sign-in-setup-zero-cost)
6. [Local FastAPI Backend & PostgreSQL Setup](#6-local-fastapi-backend--postgresql-setup)
7. [Running FitTrack in Development Mode](#7-running-fittrack-in-development-mode)
8. [Building & Installing the APK Locally (Debug & Release)](#8-building--installing-the-apk-locally-debug--release)
9. [Release Keystore Signing Setup](#9-release-keystore-signing-setup)
10. [Troubleshooting & Common Errors](#10-troubleshooting--common-errors)
11. [Final Commands Quick Reference](#11-final-commands-quick-reference)

---

## 1. Project Overview & Core Architecture

### Architecture Flowchart
```
Physical Android Phone (Built-in Steps & Activity)
                     │
                     ▼
       Android Health Connect API
   (androidx.health.connect.client)
                     │
                     ▼
 react-native-health-connect Native Bridge
                     │
                     ▼
 HealthConnectService (src/services/health/)
 (isHealthConnectAvailable, checkPermissions,
  getTodaySteps, getWeeklySteps, etc.)
                     │
                     ▼
        Local Storage Cache (AsyncStorage)
      (Instant dashboard display offline)
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
FitTrack UI Dashboard         Offline Queue
 (Steps, Ring, Charts,       (Retries when
   Workouts, Goals)       laptop is reachable)
                                   │
                                   ▼
                    FastAPI Server (Optional Backend)
                      (http://192.168.X.X:8000)
                                   │
                                   ▼
                        PostgreSQL Database
```

### Key Technical Decisions
- **100% Real Health Data**: No mocked step counts, simulated steps, or fake numbers.
- **Offline-First Resilience**: If the backend is off or you are outside without Wi-Fi, FitTrack opens instantly, caches activity, and queues sync events.
- **Zero Cost**: Runs entirely on your physical phone, Windows laptop, local PostgreSQL, and free-tier Firebase Auth.

---

## 2. Prerequisites & Software Setup on Windows

### Java / JDK 17
FitTrack requires **OpenJDK 17**.
1. Verify if installed:
   ```powershell
   java -version
   ```
2. If missing, download and install **Microsoft Build of OpenJDK 17** or **Eclipse Temurin 17**:
   - Download: https://learn.microsoft.com/en-us/java/openjdk/download
3. Verify your `JAVA_HOME` environment variable points to your JDK directory:
   ```powershell
   echo $env:JAVA_HOME
   # Expected: C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot\ (or similar)
   ```

### Node.js & npm
FitTrack requires **Node >= 20** (tested and verified on Node v24.18.0 with npm 11.16.0).
1. Check versions:
   ```powershell
   node -v
   npm -v
   ```

### Android Studio & Android SDK
1. Download & Install [Android Studio Hedgehog or Ladybug](https://developer.android.com/studio).
2. During setup, choose **Standard Installation**.
3. Open Android Studio → **More Actions** → **SDK Manager**:
   - Under **SDK Platforms**:
     - Check **Android 14.0 ("UpsideDownCake") API 34** or higher (API 34/35/36/37)
   - Under **SDK Tools**:
     - Check **Android SDK Build-Tools** (e.g. 34.0.0 or 35.0.0)
     - Check **Android SDK Platform-Tools**
     - Check **Android SDK Command-line Tools (latest)**
4. Default Android SDK location on Windows:
   `C:\Users\<YourUsername>\AppData\Local\Android\Sdk`

### Windows Environment Variables
Ensure these variables are set in your Windows System Properties (`sysdm.cpl` → Advanced → Environment Variables):

| Variable Name | Typical Value |
|---|---|
| `JAVA_HOME` | `C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot\` |
| `ANDROID_HOME` | `C:\Users\<YourUsername>\AppData\Local\Android\Sdk` |

Add the following to your system `Path` variable:
```text
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\cmdline-tools\latest\bin
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

Test that ADB is recognized in PowerShell:
```powershell
adb --version
```

---

## 3. Android Phone Setup (Physical Device Testing)

To run and debug the app directly on your physical Android phone:
1. **Enable Developer Options**:
   - Open your phone's **Settings** → **About Phone**.
   - Tap **Build Number** 7 times rapidly until you see *"You are now a developer!"*.
2. **Enable USB Debugging**:
   - Go to **Settings** → **System** (or **Additional Settings**) → **Developer Options**.
   - Turn ON **USB Debugging**.
   - Turn ON **Install via USB** (if prompted).
3. **Connect to your Laptop**:
   - Plug your phone into your laptop via a USB cable.
   - On your phone screen, accept the popup: *"Allow USB debugging from this computer?"* Check **Always allow from this computer**.
4. **Verify ADB Connection**:
   ```powershell
   adb devices
   ```
   *Expected output:*
   ```text
   List of devices attached
   4b7d192e    device
   ```

---

## 4. Android Health Connect Setup

Health Connect is Android's unified health data framework.
- **Android 14 and newer**: Health Connect is built directly into Android System Settings (**Settings → Security & Privacy → Health Connect**).
- **Android 9 to Android 13**: Install **Health Connect by Google** from the [Google Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata).

### How FitTrack Connects:
1. On first app launch, Screen 10 of Onboarding or the Home dashboard banner will prompt you to **Connect Health Data**.
2. Pressing **Grant Permission** automatically triggers Android's official Health Connect permission contract.
3. Select **Allow all** or check **Steps**, **Distance**, **Calories**, and **Exercise**.
4. Real step counts will immediately populate the dashboard!

---

## 5. Firebase & Google Sign-In Setup (Zero-Cost)

FitTrack uses Firebase Authentication with Google Sign-In, which is **100% free with no credit card required**.

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** → Name it `FitTrack` → Disable Google Analytics (optional) → **Create**.

### Step 2: Enable Google Sign-In
1. In Firebase Console, go to **Build** → **Authentication** → **Get Started**.
2. Under **Sign-in method**, click **Google**.
3. Toggle **Enable**, set support email, and click **Save**.

### Step 3: Register the Android App
1. In Firebase Project Overview, click the **Android icon** to add an app.
2. Enter Android package name:
   ```text
   com.fittrack
   ```
3. Enter App Nickname: `FitTrack Android`
4. Add the Debug SHA-1 and SHA-256 Fingerprints.
   FitTrack's pre-configured debug keystore has these exact fingerprints:
   - **Debug SHA-1**:
     ```text
     5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
     ```
   - **Debug SHA-256**:
     ```text
     FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
     ```
5. Click **Register app**.
6. Download `google-services.json` and place it into:
   ```text
   FitTrack/android/app/google-services.json
   ```

### Step 4: Web Client ID for GoogleSignin
1. In Firebase Console → **Project Settings** → **General** → scroll down to your Android app or Web apps.
2. Copy the **Web Client ID** (e.g. `123456789-xxxx.apps.googleusercontent.com`).
3. Place it in `FitTrack/src/config/env.ts` or `FitTrack/.env`:
   ```ts
   googleWebClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com'
   ```

> 💡 **Offline / Demo Mode**: If you haven't set up Firebase yet, you can still test all app features, screens, workouts, goals, and local caching immediately by tapping **"Continue in Offline / Demo Mode"** on the login screen!

---

## 6. Local FastAPI Backend & PostgreSQL Setup

The backend is completely optional for basic step tracking, but provides multi-device sync, historical backups, and workout persistence.

### Step 1: Install Backend Dependencies
Open PowerShell and navigate to the backend directory:
```powershell
cd c:\MyFiles\Apps\Fitneess\backend
pip install -r requirements.txt
```

### Step 2: PostgreSQL Database
FitTrack works out-of-the-box with **SQLite** for instant zero-dependency testing, or **PostgreSQL**:
- If using PostgreSQL:
  1. Open `pgAdmin` or `psql` and create the database:
     ```sql
     CREATE DATABASE fittrack_db;
     ```
  2. Copy `backend/.env.example` to `backend/.env` and update:
     ```env
     DATABASE_URL=postgresql://postgres:your_password@localhost:5432/fittrack_db
     ```

### Step 3: Run the FastAPI Server
```powershell
cd c:\MyFiles\Apps\Fitneess\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Or simply:
# python run.py
```
Test in your browser:
- Swagger Interactive Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Step 4: Connecting Physical Phone to Laptop FastAPI
1. Ensure your phone and laptop are connected to the **same Wi-Fi network**.
2. Find your laptop's local IPv4 address in PowerShell:
   ```powershell
   ipconfig
   ```
   Look for `IPv4 Address. . . . . . . . . . . : 192.168.1.XX`
3. In FitTrack (Profile → Settings → Server API Base URL), set:
   `http://192.168.1.XX:8000`
4. Windows Firewall note: If your phone cannot connect, allow port 8000:
   ```powershell
   netsh advfirewall firewall add rule name="FitTrack FastAPI" dir=in action=allow protocol=TCP localport=8000
   ```

---

## 7. Running FitTrack in Development Mode

### Terminal 1: Start Metro Bundler
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack
npx react-native start
```

### Terminal 2: Run on Connected Android Device
Ensure your phone is connected with `adb devices`:
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack
npx react-native run-android
```
Metro will compile the JavaScript bundle and launch FitTrack on your physical phone!

---

## 8. Building & Installing the APK Locally (Debug & Release)

### What is the Difference Between APK & AAB?
- **APK (Android Package)**: The executable installer file that you can copy to your phone and install directly without Google Play Store! **This is what you need.**
- **AAB (Android App Bundle)**: An archive designed exclusively for uploading to the Google Play Store console. It cannot be installed directly on a phone.

---

### Method A: Build Local Debug APK (Fastest)
This compiles an APK signed with the debug keystore that installs immediately on any Android phone.

```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack\android
.\gradlew.bat assembleDebug
```
**Output APK location:**
```text
c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\debug\app-debug.apk
```

---

### Method B: Build Local Release APK (Standalone Production Build)
The release APK is fully optimized with Hermesc, minified, and does not require Metro running on your computer.

```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack\android
.\gradlew.bat assembleRelease
```
**Output APK location:**
```text
c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\release\app-release.apk
```

---

### How to Install the APK on Your Phone
#### Option 1: Via ADB (Fastest)
Connect phone via USB and run:
```powershell
adb install -r c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\release\app-release.apk
```

#### Option 2: Direct File Transfer (No Cable Required)
1. Copy `app-release.apk` to your phone via Google Drive, WhatsApp, Telegram, or USB cable.
2. On your phone, open your **Files** app and tap `app-release.apk`.
3. If prompted: *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **Allow from this source**.
4. Tap **Install** → Open **FitTrack**!

---

## 9. Release Keystore Signing Setup

To sign the release APK with your own private production certificate instead of the default debug key:

1. **Generate a Private Keystore** using `keytool`:
   ```powershell
   & "$env:JAVA_HOME\bin\keytool" -genkeypair -v -storetype PKCS12 -keystore c:\MyFiles\Apps\Fitneess\FitTrack\android\app\my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
   Enter a secure password when prompted.

2. **Configure `keystore.properties`**:
   Copy `FitTrack/android/keystore.properties.example` to `FitTrack/android/keystore.properties`:
   ```properties
   MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=your_password_here
   MYAPP_UPLOAD_KEY_PASSWORD=your_password_here
   ```

3. **Get the Release SHA-1 Fingerprint** (to add to Firebase):
   ```powershell
   & "$env:JAVA_HOME\bin\keytool" -list -v -keystore c:\MyFiles\Apps\Fitneess\FitTrack\android\app\my-release-key.keystore -alias my-key-alias
   ```
   Copy the SHA-1 into Firebase Console → Project Settings → Android App Fingerprints.

4. **Rebuild the Release APK**:
   ```powershell
   cd c:\MyFiles\Apps\Fitneess\FitTrack\android
   .\gradlew.bat assembleRelease
   ```
   Gradle will automatically sign the APK with your private key!

---

## 10. Troubleshooting & Common Errors

| Issue | Cause | Solution |
|---|---|---|
| `adb: command not found` | Android SDK platform-tools not in PATH | Add `%LOCALAPPDATA%\Android\Sdk\platform-tools` to Windows system Path. |
| `Cannot find Health Connect on phone` | Android version < 14 | Install **Health Connect by Google** from Google Play Store on your phone. |
| `Google Sign-In developer_error (10)` | SHA-1 mismatch in Firebase Console | Ensure the SHA-1 in Firebase Console matches your keystore fingerprint. For debug builds, use: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`. |
| `App shows 0 steps` | Permissions not granted | In FitTrack, tap **Grant Permission** or go to phone **Settings → Health Connect → App permissions → FitTrack** and turn on **Steps**. |
| `Network Error when syncing` | Phone cannot reach laptop | Ensure phone and laptop are on same Wi-Fi. Verify IP in FitTrack Settings (e.g. `http://192.168.1.X:8000`). Allow port 8000 in Windows Firewall. |
| `Release APK crashes on launch` | Missing bundle assets | Ensure `gradlew assembleRelease` was executed cleanly. Run `.\gradlew.bat clean` then `.\gradlew.bat assembleRelease`. |

---

## 11. Final Commands Quick Reference

### 1. Run Backend Server
```powershell
cd c:\MyFiles\Apps\Fitneess\backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Run React Native Development on Device
```powershell
# Terminal 1: Metro
cd c:\MyFiles\Apps\Fitneess\FitTrack
npx react-native start

# Terminal 2: Android
cd c:\MyFiles\Apps\Fitneess\FitTrack
npx react-native run-android
```

### 3. Run Core Unit Tests
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack
npm test -- fitnessCalculations
```

### 4. Create Local Release APK
```powershell
cd c:\MyFiles\Apps\Fitneess\FitTrack\android
.\gradlew.bat assembleRelease
```

### 5. Install Release APK to Phone via USB
```powershell
adb install -r c:\MyFiles\Apps\Fitneess\FitTrack\android\app\build\outputs\apk\release\app-release.apk
```
