# **App Name**: NED Buddies

## Core Features:

- Authentication: Secure signup/login using Firebase Authentication, restricted to @cloud.neduet.edu.pk email addresses with enforced email verification. Store user profiles (name, category, department, semester, gender, email, UID) in Firestore.
- Real-time Chat: Implement one-to-one real-time chat with Firestore listeners, displaying messages in a WhatsApp-like UI.
- File Sharing: Allow users to send images, PDFs, and documents. Store the files in Firebase Storage, along with the other contents of the messages.
- End-to-End Encryption: Apply AES encryption to messages before saving them to Firestore for enhanced security.
- User Discovery: Display a list of verified public users, filterable by department, semester, and gender, accessed via a floating action button.
- Chat Suggestions: An AI tool analyzes user profiles and suggests potential chat partners based on shared interests and departments using generative AI.
- UI Components: Include a splash screen, authentication forms (signup, login, forgot password), animated login button with loader, and a popup dialog for account not found.

## Style Guidelines:

- Primary color: Indigo (#4B0082) to represent intellect and trust. It is vivid without being overly stimulating.
- Background color: Light gray (#F0F0F0) for a clean, modern look. The background and the primary color are related through shared tonality and hue.
- Accent color: Orange (#FFA500) for a vibrant contrast, used in buttons and highlights.
- Body and headline font: 'Inter' (sans-serif) for a modern, neutral, and readable interface.
- Code font: 'Source Code Pro' for displaying any code snippets or technical information.
- Use flat, minimalist icons to maintain a clean and modern aesthetic.
- Design a responsive layout to ensure optimal viewing experience across different screen sizes.
- Incorporate subtle animations and transitions to enhance user experience and provide feedback.