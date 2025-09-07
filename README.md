<div align="center">

# 🎓 NED Buddies

### **End-to-End Encrypted Chatting App for NED University Students**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4.3-purple?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)

*Connecting NEDians, one chat at a time* ✨

 [📱 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📦 Installation](#-installation) • [📱 Mobile App](#-mobile-app) • [🔐 Security](#-security) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**NED Buddies** is a modern, secure, and feature-rich chatting application exclusively designed for students of NED University of Engineering and Technology, Karachi. Built with cutting-edge technologies, it provides a seamless communication platform with end-to-end encryption, real-time messaging, and cross-platform compatibility.

### 🎯 Mission
To create a safe, secure, and user-friendly communication platform that fosters academic collaboration and social connections within the NED University community.

---

## ✨ Features

### 🔐 **Security & Privacy**
- **End-to-End Encryption** - All messages are encrypted before transmission
- **Firebase Authentication** - Secure user authentication and session management
- **Email Verification** - Mandatory email verification for account activation
- **Privacy-First Design** - No data collection beyond necessary functionality

### 💬 **Real-Time Communication**
- **Instant Messaging** - Real-time message delivery and synchronization
- **Message Status** - Read receipts and delivery confirmations
- **Online Presence** - See when your friends are online
- **Message History** - Persistent chat history with Firebase Firestore

### 👥 **User Management**
- **Student Verification** - NED University student verification system
- **Department & Semester** - Connect with students from your department and semester
- **Profile Management** - Customizable user profiles with avatars
- **User Discovery** - Find and connect with other NED students

### 🎨 **Modern UI/UX**
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - Beautiful, customizable interface
- **Smooth Animations** - Framer Motion powered animations
- **Intuitive Navigation** - Clean, modern interface design

### 📱 **Cross-Platform**
- **Web Application** - Full-featured web app
- **Android App** - Native Android app via Capacitor
- **Progressive Web App** - Installable web app experience

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.3.3** - React framework with App Router
- **React 18.3.1** - UI library with hooks and context
- **TypeScript 5.0** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### **Backend & Database**
- **Firebase Authentication** - User authentication and management
- **Firebase Firestore** - NoSQL database for real-time data
- **Firebase Storage** - File and media storage
- **Firebase Hosting** - Web application hosting

### **Mobile Development**
- **Capacitor 7.4.3** - Cross-platform native runtime
- **Android SDK** - Native Android development

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Patch Package** - Package patching for customizations

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup
- Android Studio (for mobile development)

### 1. Clone the Repository
```bash
git clone https://github.com/MurShidM01/NED-Buddies-App-For-Ned-Students.git
cd NED-Buddies-App-For-Ned-Students
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Copy your Firebase configuration
4. Update `src/lib/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:9002` to see the application.

---

## 📱 Mobile App

### Building Android App

1. **Build the Web App**
```bash
npm run build
npm run export
```

2. **Add Android Platform**
```bash
npx cap add android
```

3. **Sync and Open in Android Studio**
```bash
npx cap sync
npx cap open android
```

4. **Build APK**
- Open Android Studio
- Build → Build Bundle(s) / APK(s) → Build APK(s)

### App Configuration
The app is configured with:
- **App ID**: `com.ned.buddies`
- **App Name**: `Ned Buddies`
- **Web Directory**: `out`

---

## 🔐 Security Features

### Authentication Security
- **Email Verification Required** - Users must verify their email before accessing the app
- **Secure Session Management** - Firebase handles secure session tokens
- **Automatic Logout** - Sessions expire after inactivity

### Data Protection
- **End-to-End Encryption** - Messages encrypted before transmission
- **Secure Database Rules** - Firestore security rules prevent unauthorized access
- **No Data Persistence** - Sensitive data not stored locally

### Privacy Measures
- **Minimal Data Collection** - Only necessary user information collected
- **User Control** - Users can manage their profile and data
- **Secure Communication** - All API calls use HTTPS

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── chat/              # Chat interface
│   ├── login/             # Authentication pages
│   ├── signup/            # User registration
│   └── profile/           # User profile management
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── chat-*.tsx        # Chat-specific components
│   └── user-*.tsx        # User management components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── firebase.ts       # Firebase configuration
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

---

## 🤝 Contributing

We welcome contributions from the NED University community! Here's how you can help:

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ali Khan** - NED University Student
- GitHub: [@MurShidM01](https://github.com/MurShidM01)
- Email: [alikhanjalbani@outlook.com](mailto:alikhanjalbani@outlook.com)

---

## 🙏 Acknowledgments

- **NED University** - For providing the platform and community
- **Firebase Team** - For excellent backend services
- **Next.js Team** - For the amazing React framework
- **Open Source Community** - For the incredible tools and libraries

---

<div align="center">

### 🌟 **Star this repository if you find it helpful!** 🌟

**Made with ❤️ for NED University Students**

[⬆ Back to Top](#-ned-buddies)

</div>
