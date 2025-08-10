# React Admin + Firestore Setup Guide

## Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Enable Firestore Database in your Firebase project

3. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon (</>) or create a new web app
   - Copy the configuration object

4. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit the .env file with your actual Firebase configuration
   nano .env  # or use your preferred editor
   ```

5. Update the `.env` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-actual-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-actual-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-actual-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-actual-app-id
   ```

**Important**: The `.env` file is automatically ignored by git (via `.gitignore`), so your Firebase credentials will not be committed to version control.

## Firestore Security Rules

Make sure your Firestore security rules allow read/write access for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Only for development!
    }
  }
}
```

**Important**: The above rules allow full access to anyone. For production, implement proper authentication and authorization rules.

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Next Steps

- Add resources to the Admin component in `src/App.tsx`
- Create list, create, edit, and show components for your data
- Implement proper authentication
- Add proper Firestore security rules for production

## Project Structure

- `src/firebase.ts` - Firebase configuration and initialization (uses environment variables)
- `src/dataProvider.ts` - Custom data provider for Firestore
- `src/App.tsx` - Main React Admin application
- `src/Layout.tsx` - Custom layout component
- `.env.example` - Template for environment variables
- `.env` - Your actual environment variables (gitignored)

