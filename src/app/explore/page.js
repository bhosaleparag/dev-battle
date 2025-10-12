import { client } from '@/lib/sanity';
import CodingChallengesPlatform from './CodingChallengesPlatform';


export default async function Page() {

  // Run them in parallel
  const [quizzes, debuggers, problems] = await Promise.all([
    client.fetch(`*[_type == "quiz" && mode == "single"] | order(date desc){ _id, title, description, daily, date, xp }`),
    client.fetch(`*[_type == "debuggerChallenge" && mode == "single"] | order(_updatedAt desc){ _id, title, description, difficulty, date, xp }`),
    client.fetch(`*[_type == "challenge" && mode == "single"] | order(_updatedAt desc){ _id, title, description, difficulty, date, xp }`),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <CodingChallengesPlatform
        quizzes={quizzes} 
        debuggers={debuggers} 
        problems={problems}
      />
    </div>
  );
}