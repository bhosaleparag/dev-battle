// constants/MenuRoutes.js
import { 
  Home, 
  Compass, 
  Swords, 
  Trophy, 
  Settings, 
  MessageSquare,
  Users,
  TrendingUp,
  Gamepad2,
  Search
} from 'lucide-react';

export const MenuRoutes = [
  { 
    href: "/", 
    name: "Home", 
    icon: Home,
    description: "Dashboard and overview"
  },
  { 
    href: "/explore", 
    name: "Explore", 
    icon: Compass,
    description: "Discover new quizzes and topics"
  },
  { 
    href: "/battles", 
    name: "Battles", 
    icon: Swords,
    description: "Challenge friends and compete",
    // badge: "Hot" // Optional badge
  },
  { 
    href: "/leaderboard", 
    name: "Leaderboard", 
    icon: TrendingUp,
    description: "See top players and rankings"
  },
  { 
    href: "/friends", 
    name: "Friends", 
    icon: Users,
    description: "Manage your friend list"
  },
  { 
    href: "/achievements", 
    name: "Achievements", 
    icon: Trophy,
    description: "View your accomplishments"
  }
];


export const SecondaryRoutes = [
  { 
    href: "/settings", 
    name: "Settings", 
    icon: Settings,
    description: "Account and app preferences"
  },
  { 
    href: "/feedback", 
    name: "Feedback", 
    icon: MessageSquare,
    description: "Share your thoughts with us"
  }
];

export const FAQS = [
  {
    id: 1,
    question: "How do I get started with the app?",
    answer: "To get started, simply create an account and follow our onboarding guide. You'll be up and running in just a few minutes with access to all core features."
  },
  {
    id: 2,
    question: "How can I reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a reset link. Follow the instructions in the email to create a new password."
  },
  {
    id: 3,
    question: "Is my data secure?",
    answer: "Yes, we use enterprise-grade encryption and security measures to protect your data. All information is encrypted both in transit and at rest, and we never share your personal data with third parties."
  },
  {
    id: 4,
    question: "Can I export my data?",
    answer: "Absolutely! You can export your data at any time from the Settings page. We support multiple formats including CSV, JSON, and PDF for different types of data."
  },
  {
    id: 5,
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your Account Settings. Go to Billing & Subscriptions, and click 'Cancel Subscription'. Your access will continue until the end of your current billing period."
  }
];

export const exploreSections = [
  { title: "Quiz", description: "Daily coding quizzes to test your skills." },
  { title: "Debugger", description: "Fix buggy code challenges in real-time." },
  { title: "Problem", description: "Solve algorithmic coding problems." },
];

export const debuggerMessages = {
  success: {
    title: "🎉 Bug Squashed!",
    message: "Great job! You successfully fixed the bug. Keep going to the next challenge!"
  },
  failure: {
    notFixed: {
      title: "❌ Bug Still There",
      message: "Your fix didn’t work this time. Review the code and try again!"
    },
    closeToFix: {
      title: "🛠️ Almost There!",
      message: "You’re close to fixing the bug! Double-check your changes and give it another shot."
    }
  }
}

export const MAX_LIMIT_PER_QUIZ_QUE = 15

export const MAX_LIMIT_DEBUGGER  = 1000 * 60 * 5