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

[🚀 Live Demo](https://ned-buddies-app-for-ned-students.vercel.app/) • [📱 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [⚡ Quick Start](#-quick-start) • [📱 Mobile App](#-mobile-app) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Overview

**NED Buddies** is a comprehensive real-time chat application designed exclusively for NED University students. It provides a secure, modern, and feature-rich platform for students to connect, communicate, and build meaningful relationships within their academic community.

### 🎯 Key Highlights

| Feature | Description |
|---------|-------------|
| 🎓 **University-Specific** | Designed exclusively for NED University students |
| 📱 **Cross-Platform** | Web app + Native Android app via Capacitor |
| 🔒 **Secure** | Firebase Authentication with email verification |
| ⚡ **Real-time** | Instant messaging with Firebase Firestore |
| 🔔 **Smart Notifications** | Push notifications for web and mobile |
| 🎨 **Modern UI** | Beautiful, responsive design with Tailwind CSS |
| 📊 **Advanced Features** | Message management, user profiles, and more |

---

## ✨ Features

### 🔐 Authentication & Security

| Feature | Status | Description |
|---------|--------|-------------|
| Email Verification | ✅ | University email validation (@cloud.neduet.edu.pk) |
| Secure Login/Signup | ✅ | Firebase Authentication integration |
| Password Recovery | ✅ | Forgot password functionality |
| Profile Management | ✅ | Editable user profiles with department/semester info |
| Account Types | ✅ | Public/Private account options |

### 💬 Real-Time Chat

| Feature | Status | Description |
|---------|--------|-------------|
| Instant Messaging | ✅ | Real-time chat with Firebase Firestore |
| Message Status | ✅ | Sent/Read indicators |
| Message Management | ✅ | Delete for me/Delete for everyone |
| Auto-scroll | ✅ | Automatic scrolling to latest messages |
| Message Timestamps | ✅ | Time display for each message |
| Long Message Support | ✅ | Read more/less functionality |
| Link Detection | ✅ | Automatic URL detection and linking |

### 👥 User Discovery

| Feature | Status | Description |
|---------|--------|-------------|
| Student Directory | ✅ | Browse all verified students |
| Advanced Filtering | ✅ | Filter by department, semester, gender, account type |
| Search Functionality | ✅ | Search students by name |
| User Profiles | ✅ | Detailed user information and avatars |
| Online Status | ✅ | Visual online/offline indicators |
| Privacy Controls | ✅ | Private account protection |

### 🎨 User Interface

| Feature | Status | Description |
|---------|--------|-------------|
| Responsive Design | ✅ | Works on desktop, tablet, and mobile |
| Dark/Light Theme | ✅ | System preference support |
| Modern UI Components | ✅ | Radix UI + Tailwind CSS |
| Smooth Animations | ✅ | Framer Motion animations |
| Loading States | ✅ | Skeleton loaders and loading indicators |
| Error Handling | ✅ | User-friendly error messages |

### 🔔 Push Notifications

| Feature | Status | Description |
|---------|--------|-------------|
| Cross-Platform | ✅ | Web and native mobile notifications |
| Real-time Alerts | ✅ | Instant notification on new messages |
| Permission Management | ✅ | Smart permission handling |
| Background Sync | ✅ | Notifications work when app is closed |
| Debug Tools | ✅ | Built-in notification debugging |

### 📱 Mobile Features

| Feature | Status | Description |
|---------|--------|-------------|
| Native Android App | ✅ | Built with Capacitor |
| Push Notifications | ✅ | Native Android push notifications |
| Offline Support | ✅ | Basic offline functionality |
| App Store Ready | ✅ | Production-ready Android app |
| Performance Optimized | ✅ | Smooth native performance |

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | `14.2.5` | React framework with App Router |
| **React** | `18.3.1` | UI library |
| **TypeScript** | `5.0` | Type safety and development experience |
| **Tailwind CSS** | `3.4.1` | Utility-first CSS framework |
| **Radix UI** | `Latest` | Accessible component primitives |
| **Framer Motion** | `11.3.2` | Animation library |
| **React Hook Form** | `7.52.1` | Form handling |
| **Zod** | `3.23.8` | Schema validation |
| **Lucide React** | `0.408.0` | Icon library |

### Backend & Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Firebase Firestore** | Database | Real-time data synchronization |
| **Firebase Auth** | Authentication | User management and security |
| **Firebase Storage** | File Storage | Media and file handling |
| **Firebase Hosting** | Web Hosting | Static site deployment |
| **Firebase Cloud Messaging** | Push Notifications | Cross-platform notifications |

### Mobile Development

| Technology | Version | Purpose |
|------------|---------|---------|
| **Capacitor** | `6.2.1` | Cross-platform mobile development |
| **Android Studio** | Latest | Native Android development |
| **Gradle** | Latest | Build system |
| **Java/Kotlin** | Latest | Native Android code |

### Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package manager |
| **ESLint** | Code linting |
| **TypeScript** | Type checking |
| **Git** | Version control |
| **Vercel** | Deployment platform |

---

## ⚡ Quick Start

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | `18+` | JavaScript runtime |
| **npm** | `Latest` | Package manager |
| **Firebase Project** | - | Backend services |
| **Android Studio** | `Latest` | Mobile development |

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ned-buddies.git
cd ned-buddies
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Setup

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

#### 4. Firebase Setup

| Step | Action | Description |
|------|--------|-------------|
| 1 | Create Firebase Project | Visit [Firebase Console](https://console.firebase.google.com) |
| 2 | Enable Authentication | Set up Email/Password authentication |
| 3 | Enable Firestore | Create Firestore database |
| 4 | Enable Cloud Messaging | Configure push notifications |
| 5 | Add Authorized Domains | Add your domain to authorized domains |
| 6 | Download Config | Add Firebase config to `.env.local` |

#### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see the application.

#### 6. Build for Production

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

| Setting | Value | Purpose |
|---------|-------|---------|
| **Static Export** | `output: 'export'` | Static hosting compatibility |
| **Image Optimization** | Remote patterns configured | External image support |
| **TypeScript** | Build errors ignored | Development flexibility |
| **ESLint** | Build-time linting disabled | Faster builds |

---

## 📱 Mobile App

### Android Development Setup

| Step | Command | Description |
|------|---------|-------------|
| 1 | `npm install -g @capacitor/cli` | Install Capacitor CLI |
| 2 | `npx cap add android` | Add Android platform |
| 3 | `npm run build` | Build the application |
| 4 | `npx cap sync android` | Sync with Android project |
| 5 | `npx cap open android` | Open in Android Studio |

### Building APK

| Step | Action | Description |
|------|--------|-------------|
| 1 | Open Android Studio | Launch the IDE |
| 2 | Build → Generate Signed Bundle/APK | Start build process |
| 3 | Follow the wizard | Configure signing |
| 4 | Test on device/emulator | Verify functionality |

### Push Notifications Setup

| Platform | Configuration | Description |
|----------|---------------|-------------|
| **Firebase Console** | Project Settings → Cloud Messaging | Generate Server Key |
| **Android App** | Package name: `com.ned.buddies` | Configure Android app |
| **google-services.json** | Add to `android/app/` | Firebase configuration |
| **MainActivity.java** | Configure Firebase | Native integration |

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

| Step | Action | Description |
|------|--------|-------------|
| 1 | **Email Validation** | Only `@cloud.neduet.edu.pk` emails allowed |
| 2 | **Profile Creation** | Department, semester, and personal info |
| 3 | **Email Verification** | Required before account activation |
| 4 | **Firestore Integration** | User data stored in Firestore |

### Security Features

| Feature | Description |
|---------|-------------|
| **Email Verification** | Mandatory email verification |
| **Password Requirements** | Minimum 8 characters |
| **Account Types** | Public/Private account options |
| **Session Management** | Automatic session handling |
| **Error Handling** | Comprehensive error messages |

---

## 💬 Chat Features

### Real-Time Messaging

| Feature | Description |
|---------|-------------|
| **Instant Delivery** | Messages appear instantly |
| **Status Indicators** | Sent/Read status for each message |
| **Message Persistence** | All messages stored in Firestore |
| **Auto-scroll** | Automatic scrolling to new messages |

### Message Management

| Feature | Description |
|---------|-------------|
| **Delete Options** | Delete for me or delete for everyone |
| **Long Messages** | Read more/less for long messages |
| **Link Detection** | Automatic URL detection and linking |
| **Message Timestamps** | Time display for each message |

---

## 🔔 Push Notifications

### Web Notifications

| Feature | Description |
|---------|-------------|
| **Service Worker** | Firebase messaging service worker |
| **Permission Handling** | Smart permission requests |
| **Foreground Messages** | Toast notifications for active users |
| **Background Sync** | Notifications when app is closed |

### Mobile Notifications

| Feature | Description |
|---------|-------------|
| **Native Integration** | Capacitor push notifications |
| **Android Support** | Full Android push notification support |
| **Permission Management** | Native permission handling |
| **Background Processing** | Notifications work when app is closed |

### Debug Tools

| Tool | Purpose |
|------|--------|
| **Debug Page** | Built-in notification debugging |
| **Permission Testing** | Test notification permissions |
| **Token Management** | FCM token management |
| **Listener Testing** | Test notification listeners |

---

## 🎨 UI/UX Design

### Design System

| Element | Specification |
|---------|---------------|
| **Color Palette** | Modern, accessible color scheme |
| **Typography** | Poppins font family |
| **Spacing** | Consistent spacing system |
| **Components** | Reusable component library |

### Responsive Design

| Breakpoint | Description |
|------------|-------------|
| **Mobile First** | Designed for mobile devices |
| **Tablet Support** | Optimized for tablet screens |
| **Desktop Support** | Full desktop functionality |
| **Touch Friendly** | Touch-optimized interactions |

### Accessibility

| Feature | Implementation |
|---------|----------------|
| **Keyboard Navigation** | Full keyboard support |
| **Screen Readers** | ARIA labels and descriptions |
| **Color Contrast** | WCAG compliant color contrast |
| **Focus Management** | Proper focus management |

---

## 📊 Performance

### Optimization Features

| Feature | Implementation |
|---------|----------------|
| **Static Export** | Fast loading with static files |
| **Image Optimization** | Next.js image optimization |
| **Code Splitting** | Automatic code splitting |
| **Lazy Loading** | Component lazy loading |
| **Caching** | Firebase caching strategies |

### Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **First Contentful Paint** | < 1.5s | ✅ |
| **Largest Contentful Paint** | < 2.5s | ✅ |
| **Cumulative Layout Shift** | < 0.1 | ✅ |
| **First Input Delay** | < 100ms | ✅ |

---

## 🚀 Deployment

### Web Deployment

| Platform | Command | Description |
|----------|---------|-------------|
| **Build** | `npm run build` | Create production build |
| **Firebase Hosting** | `firebase deploy` | Deploy to Firebase |
| **Vercel** | `vercel --prod` | Deploy to Vercel |

### Mobile Deployment

| Step | Action | Description |
|------|--------|-------------|
| 1 | Build Android APK | `npx cap build android` |
| 2 | Create Developer Account | Google Play Console |
| 3 | Upload APK/AAB | Upload to Play Store |
| 4 | Configure Store Listing | Add metadata and screenshots |
| 5 | Submit for Review | Submit for Google review |

---

## 🤝 Contributing

### Contribution Process

| Step | Action | Description |
|------|--------|-------------|
| 1 | Fork Repository | Create your fork |
| 2 | Create Branch | `git checkout -b feature/amazing-feature` |
| 3 | Commit Changes | `git commit -m 'Add amazing feature'` |
| 4 | Push Branch | `git push origin feature/amazing-feature` |
| 5 | Open Pull Request | Submit for review |

### Development Guidelines

| Guideline | Description |
|-----------|-------------|
| **TypeScript Best Practices** | Follow TypeScript conventions |
| **Meaningful Commit Messages** | Clear and descriptive commits |
| **Thorough Testing** | Test all changes thoroughly |
| **Update Documentation** | Keep docs up to date |
| **Follow Code Style** | Maintain consistent code style |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

| Organization | Contribution |
|--------------|--------------|
| **NED University** | Providing the platform |
| **Firebase** | Backend services |
| **Next.js Team** | Amazing framework |
| **Radix UI** | Accessible components |
| **Tailwind CSS** | Styling utilities |
| **Capacitor** | Mobile development |

---

<div align="center">

**Made with ❤️ for NED University Students**

[⭐ Star this repo](https://github.com/your-username/ned-buddies) • [🐛 Report Bug](https://github.com/your-username/ned-buddies/issues) • [💡 Request Feature](https://github.com/your-username/ned-buddies/issues)

</div>