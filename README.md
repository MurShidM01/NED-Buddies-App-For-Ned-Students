# 🎓 NED Buddies - University Chat Application

<div align="center">

![NED Buddies Logo](https://img.shields.io/badge/NED-Buddies-blue?style=for-the-badge&logo=message-circle)
![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.12.3-orange?style=for-the-badge&logo=firebase)
![Capacitor](https://img.shields.io/badge/Capacitor-6.2.1-blue?style=for-the-badge&logo=capacitor)

**Connecting NEDians, one chat at a time.**

A modern, real-time chat application built specifically for NED University students with cross-platform support.

[🚀 Live Demo](#-live-demo) • [📱 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [⚡ Quick Start](#-quick-start) • [📱 Mobile App](#-mobile-app) • [🤝 Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start](#-quick-start)
- [🔧 Configuration](#-configuration)
- [📱 Mobile App](#-mobile-app)
- [🏗️ Project Structure](#️-project-structure)
- [🔐 Authentication](#-authentication)
- [💬 Chat Features](#-chat-features)
- [🔔 Push Notifications](#-push-notifications)
- [🎨 UI/UX Design](#-uiux-design)
- [📊 Performance](#-performance)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

**NED Buddies** is a comprehensive real-time chat application designed exclusively for NED University students. It provides a secure, modern, and feature-rich platform for students to connect, communicate, and build meaningful relationships within their academic community.

### 🎯 Key Highlights

- **🎓 University-Specific**: Designed exclusively for NED University students
- **📱 Cross-Platform**: Web app + Native Android app via Capacitor
- **🔒 Secure**: Firebase Authentication with email verification
- **⚡ Real-time**: Instant messaging with Firebase Firestore
- **🔔 Smart Notifications**: Push notifications for web and mobile
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **📊 Advanced Features**: Message management, user profiles, and more

---

## ✨ Features

### 🔐 Authentication & Security
- **Email Verification**: University email validation (@cloud.neduet.edu.pk)
- **Secure Login/Signup**: Firebase Authentication integration
- **Password Recovery**: Forgot password functionality
- **Profile Management**: Editable user profiles with department/semester info
- **Account Types**: Public/Private account options

### 💬 Real-Time Chat
- **Instant Messaging**: Real-time chat with Firebase Firestore
- **Message Status**: Sent/Read indicators
- **Message Management**: Delete for me/Delete for everyone
- **Auto-scroll**: Automatic scrolling to latest messages
- **Message Timestamps**: Time display for each message
- **Long Message Support**: Read more/less functionality
- **Link Detection**: Automatic URL detection and linking

### 👥 User Discovery
- **Student Directory**: Browse all verified students
- **Advanced Filtering**: Filter by department, semester, gender, account type
- **Search Functionality**: Search students by name
- **User Profiles**: Detailed user information and avatars
- **Online Status**: Visual online/offline indicators
- **Privacy Controls**: Private account protection

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: System preference support
- **Modern UI Components**: Radix UI + Tailwind CSS
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages

### 🔔 Push Notifications
- **Cross-Platform**: Web and native mobile notifications
- **Real-time Alerts**: Instant notification on new messages
- **Permission Management**: Smart permission handling
- **Background Sync**: Notifications work when app is closed
- **Debug Tools**: Built-in notification debugging

### 📱 Mobile Features
- **Native Android App**: Built with Capacitor
- **Push Notifications**: Native Android push notifications
- **Offline Support**: Basic offline functionality
- **App Store Ready**: Production-ready Android app
- **Performance Optimized**: Smooth native performance

### 🛠️ Developer Features
- **TypeScript**: Full type safety
- **Modern React**: Hooks, Context, and modern patterns
- **Component Library**: Reusable UI components
- **Error Boundaries**: Graceful error handling
- **Debug Tools**: Built-in debugging utilities
- **Hot Reload**: Fast development experience

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5.0
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1
- **Components**: Radix UI + Custom Components
- **Animations**: Framer Motion 11.3.2
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend & Services
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting
- **Push Notifications**: Firebase Cloud Messaging (FCM)

### Mobile Development
- **Framework**: Capacitor 6.2.1
- **Platform**: Android (Native)
- **Push Notifications**: Capacitor Push Notifications
- **Build**: Android Studio + Gradle

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js
- **Version Control**: Git

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Android Studio (for mobile development)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ned-buddies.git
cd ned-buddies
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Cloud Messaging
5. Add your domain to authorized domains
6. Download the Firebase config and add to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see the application.

### 6. Build for Production

```bash
npm run build
npm run start
```

---

## 🔧 Configuration

### Firebase Security Rules

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages subcollection
    match /conversations/{conversationId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
    }
  }
}
```

### Next.js Configuration

The app is configured for static export with the following features:

- **Static Export**: `output: 'export'` for static hosting
- **Image Optimization**: Remote image patterns configured
- **TypeScript**: Build errors ignored for development
- **ESLint**: Build-time linting disabled for faster builds

---

## 📱 Mobile App

### Android Development Setup

1. **Install Capacitor CLI**:
```bash
npm install -g @capacitor/cli
```

2. **Add Android Platform**:
```bash
npx cap add android
```

3. **Build and Sync**:
```bash
npm run build
npx cap sync android
```

4. **Open in Android Studio**:
```bash
npx cap open android
```

### Building APK

1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Follow the wizard to create your APK
4. Test on device or emulator

### Push Notifications Setup

1. **Firebase Console**:
   - Go to Project Settings → Cloud Messaging
   - Generate Server Key
   - Add Android app with package name: `com.ned.buddies`

2. **Android Configuration**:
   - Add `google-services.json` to `android/app/`
   - Configure Firebase in `MainActivity.java`

---

## 🏗️ Project Structure

```
ned-buddies/
├── 📁 public/                 # Static assets
│   └── firebase-messaging-sw.js
├── 📁 src/
│   ├── 📁 app/                # Next.js App Router
│   │   ├── 📁 chat/           # Chat page
│   │   ├── 📁 login/          # Authentication pages
│   │   ├── 📁 signup/
│   │   ├── 📁 profile/
│   │   ├── 📁 debug/          # Debug tools
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── 📁 components/         # React components
│   │   ├── 📁 ui/             # Reusable UI components
│   │   ├── chat-view.tsx      # Main chat interface
│   │   ├── message-input.tsx  # Message input component
│   │   ├── chat-messages.tsx  # Messages display
│   │   └── user-list-dialog.tsx
│   ├── 📁 hooks/              # Custom React hooks
│   │   ├── use-auth.tsx       # Authentication hook
│   │   └── use-toast.ts       # Toast notifications
│   └── 📁 lib/                # Utilities and configurations
│       ├── firebase.ts        # Firebase configuration
│       ├── firebase-messaging.ts
│       ├── constants.ts       # App constants
│       └── data.ts           # TypeScript types
├── 📁 android/                # Android native code
├── capacitor.config.ts        # Capacitor configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS config
└── package.json              # Dependencies and scripts
```

---

## 🔐 Authentication

### User Registration Process

1. **Email Validation**: Only `@cloud.neduet.edu.pk` emails allowed
2. **Profile Creation**: Department, semester, and personal info
3. **Email Verification**: Required before account activation
4. **Firestore Integration**: User data stored in Firestore

### Security Features

- **Email Verification**: Mandatory email verification
- **Password Requirements**: Minimum 8 characters
- **Account Types**: Public/Private account options
- **Session Management**: Automatic session handling
- **Error Handling**: Comprehensive error messages

---

## 💬 Chat Features

### Real-Time Messaging

- **Instant Delivery**: Messages appear instantly
- **Status Indicators**: Sent/Read status for each message
- **Message Persistence**: All messages stored in Firestore
- **Auto-scroll**: Automatic scrolling to new messages

### Message Management

- **Delete Options**: Delete for me or delete for everyone
- **Long Messages**: Read more/less for long messages
- **Link Detection**: Automatic URL detection and linking
- **Message Timestamps**: Time display for each message

### User Interface

- **Responsive Design**: Works on all screen sizes
- **Modern UI**: Clean, modern interface
- **Loading States**: Skeleton loaders during loading
- **Error Handling**: User-friendly error messages

---

## 🔔 Push Notifications

### Web Notifications

- **Service Worker**: Firebase messaging service worker
- **Permission Handling**: Smart permission requests
- **Foreground Messages**: Toast notifications for active users
- **Background Sync**: Notifications when app is closed

### Mobile Notifications

- **Native Integration**: Capacitor push notifications
- **Android Support**: Full Android push notification support
- **Permission Management**: Native permission handling
- **Background Processing**: Notifications work when app is closed

### Debug Tools

- **Debug Page**: Built-in notification debugging
- **Permission Testing**: Test notification permissions
- **Token Management**: FCM token management
- **Listener Testing**: Test notification listeners

---

## 🎨 UI/UX Design

### Design System

- **Color Palette**: Modern, accessible color scheme
- **Typography**: Poppins font family
- **Spacing**: Consistent spacing system
- **Components**: Reusable component library

### Responsive Design

- **Mobile First**: Designed for mobile devices
- **Tablet Support**: Optimized for tablet screens
- **Desktop Support**: Full desktop functionality
- **Touch Friendly**: Touch-optimized interactions

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color contrast
- **Focus Management**: Proper focus management

---

## 📊 Performance

### Optimization Features

- **Static Export**: Fast loading with static files
- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Component lazy loading
- **Caching**: Firebase caching strategies

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

## 🚀 Deployment

### Web Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Deploy to Firebase Hosting**:
```bash
firebase deploy
```

3. **Deploy to Vercel**:
```bash
vercel --prod
```

### Mobile Deployment

1. **Build Android APK**:
```bash
npx cap build android
```

2. **Upload to Google Play Store**:
   - Create developer account
   - Upload APK/AAB
   - Configure store listing
   - Submit for review

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Follow the existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NED University** for providing the platform
- **Firebase** for backend services
- **Next.js** team for the amazing framework
- **Radix UI** for accessible components
- **Tailwind CSS** for styling utilities
- **Capacitor** for mobile development

---

<div align="center">

**Made with ❤️ for NED University Students**

[⭐ Star this repo](https://github.com/your-username/ned-buddies) • [🐛 Report Bug](https://github.com/your-username/ned-buddies/issues) • [💡 Request Feature](https://github.com/your-username/ned-buddies/issues)

</div>
