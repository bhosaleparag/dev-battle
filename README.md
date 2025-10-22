# 🚀 Dev Battle - Competitive Coding Platform

A real-time multiplayer coding platform where developers can challenge each other, solve problems, and climb the global leaderboard. Built with Next.js 15, Firebase, and Socket.io for seamless real-time experiences.

![Dev Battle](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12.1.0-orange?style=for-the-badge&logo=firebase)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-black?style=for-the-badge&logo=socket.io)
![Sanity](https://img.shields.io/badge/Sanity-3.67.2-ff2d20?style=for-the-badge&logo=sanity)

## ✨ Features

### 🎯 Core Gameplay
- **Real-time Multiplayer Battles**: Challenge friends or random opponents in live coding duels
- **Multiple Game Modes**: 
  - Quick Match (automatic matchmaking)
  - Custom Rooms (invite friends with custom settings)
  - Daily Challenges (fresh problems every day)
- **Code Execution**: Built-in JavaScript code editor with real-time execution
- **Timed Challenges**: Race against the clock to solve problems faster

### 🏆 Competitive Features
- **Global Leaderboard**: Compete with developers worldwide
- **XP & Leveling System**: Gain experience points and level up
- **Achievement System**: Unlock badges and rewards for milestones
- **Streak Tracking**: Build daily coding streaks for bonus rewards
- **Ranking System**: Climb the ranks based on your performance

### 👥 Social Features
- **Friend System**: Add friends and see their online status
- **Profile Management**: Customize your profile with avatar, bio, and stats
- **Real-time Chat**: Communicate with opponents during battles
- **Invitation System**: Invite friends to custom battles

### 🎮 Game Types
- **Coding Challenges**: Solve algorithmic problems with test cases
- **Debugging Challenges**: Find and fix bugs in provided code
- **Quiz Battles**: Answer technical questions in real-time
- **Multiplayer Code Editor**: Collaborative coding sessions

### 🎨 User Experience
- **Modern UI**: Beautiful, responsive design with dark theme
- **Sound Effects**: Immersive audio feedback for actions
- **Real-time Updates**: Live score updates and game state synchronization
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **CodeMirror** - Code editor with syntax highlighting

### Backend & Services
- **Firebase 12.1.0** - Authentication, Firestore database, and real-time database
- **Socket.io 4.8.1** - Real-time bidirectional communication
- **Sanity CMS** - Content management for challenges and quizzes
- **Cloudinary** - Image and media management
- **Piston API** - Code execution engine

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Canvas Confetti** - Celebration animations
- **Sonner** - Toast notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Firebase project
- Sanity project (for content management)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dev-battle
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production

   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── challenges/
│   │   ├── daily-quiz/
│   │   └── run-code/
│   ├── components/             # Reusable components
│   │   ├── Auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── nav/               # Navigation components
│   │   ├── quiz/              # Quiz components
│   │   ├── realtime/          # Real-time features
│   │   └── ui/                # UI components
│   ├── context/               # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utility libraries
│   ├── battles/               # Battle system
│   ├── explore/               # Challenge exploration
│   ├── friends/               # Friend management
│   ├── leaderboard/           # Rankings
│   ├── achievements/          # Achievement system
│   └── settings/                # User settings
```

## 🎮 Game Modes

### 1. Quick Match
- Automatic matchmaking based on skill level
- 5-10 minute matches
- Random opponents
- Ranked progression

### 2. Custom Rooms
- Create private battle rooms
- Invite specific friends
- Custom difficulty settings
- Flexible timing options

### 3. Daily Challenges
- Fresh problems every day
- Single-player mode
- XP rewards
- Streak tracking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/session` - Create/delete user session
- `POST /api/actions/firebaseAuth` - Handle Firebase authentication

### Game Features
- `GET /api/challenges/random` - Get random challenges
- `GET /api/daily-quiz` - Get daily quiz
- `POST /api/run-code` - Execute user code
- `GET /api/firebase/users` - User management
- `GET /api/firebase/userProgress` - Progress tracking

## 🎯 Key Features Implementation

### Real-time Multiplayer
- Socket.io for real-time communication
- Room-based game sessions
- Live score updates
- Real-time chat

### Code Execution
- Piston API integration for safe code execution
- Queue system to respect rate limits
- Multiple test case validation
- Error handling and debugging

### User Management
- Firebase Authentication
- Google OAuth integration
- User profiles with avatars
- Progress tracking and statistics

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: VPS deployment with Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Firebase** - For authentication and database services
- **Socket.io** - For real-time communication
- **Sanity** - For content management
- **Piston API** - For code execution
- **Lucide** - For beautiful icons

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community Discord

---

**Happy Coding! 🎉**

*Master coding through real battles and climb the global leaderboard!*
