import { Code2, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FeatureCard from './FeatureCard';
import StepCard from './StepCard';
import GameModeCard from './GameModeCard';
import { dashboardFeature, dashboardGameModes, dashboardSteps } from '@/lib/constants';
import { SoundButton } from '../ui/SoundButton';

function NonSignUser() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-08 text-white-99">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-60/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-purple-60/20 to-purple-60/10 border border-purple-60/30 rounded-full mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-purple-75" />
              <span className="text-sm text-purple-75 font-medium">Level up your coding skills</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white-99">
              Master Coding Through
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-70 to-purple-60"> Real Battles</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-60 mb-6 sm:mb-8 px-4 leading-relaxed">
              Challenge friends, solve problems in real-time, and climb the global leaderboard. 
              Join thousands of developers sharpening their skills daily.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <SoundButton 
                onClick={() => router.push('/login')}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-purple-60 hover:bg-purple-65 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-purple-60/20"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </SoundButton>
              <SoundButton className="px-6 sm:px-8 py-3 sm:py-4 border border-gray-15 hover:border-purple-60/30 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 bg-gradient-to-br from-gray-10 to-gray-08">
                Watch Demo
              </SoundButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">Everything You Need to Excel</h2>
          <p className="text-lg sm:text-xl text-gray-60">Comprehensive features designed for competitive coding</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Feature Cards */}
          {dashboardFeature.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={<feature.icon className="w-8 h-8 sm:w-10 sm:h-10" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">How It Works</h2>
          <p className="text-lg sm:text-xl text-gray-60">Get started in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {dashboardSteps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">Battle Modes</h2>
          <p className="text-lg sm:text-xl text-gray-60">Choose your preferred way to compete</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardGameModes.map((game, index) => (
            <GameModeCard
              key={index}
              icon={<game.icon className="w-12 h-12" />}
              title={game.title}
              description={game.description}
              features={game.features}
            />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="relative group bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl p-8 sm:p-12 lg:p-16 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-60/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white-99">Ready to Level Up?</h2>
            <p className="text-lg sm:text-xl text-gray-60 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
              Join thousands of developers improving their skills every day. Start your coding journey now.
            </p>
            <SoundButton 
              onClick={() => router.push('/login')}
              className="group px-8 sm:px-10 py-3 sm:py-4 bg-purple-60 hover:bg-purple-65 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-purple-60/20"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </SoundButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-15 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-purple-60" />
              <span className="text-lg font-bold text-white-99">Dev Battle</span>
            </div>
            <p className="text-gray-40 text-sm text-center sm:text-left">© 2025 Dev Battle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default NonSignUser