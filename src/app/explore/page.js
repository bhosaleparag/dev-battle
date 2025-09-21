import { client } from '@/lib/sanity';
import CodingChallengesPlatform from './CodingChallengesPlatform';


export default async function Page() {

  // Run them in parallel
  const [quizzes, debuggers, problems] = await Promise.all([
    client.fetch(`*[_type == "quiz"] | order(date desc){ _id, title, description, daily, date }`),
    client.fetch(`*[_type == "debuggerChallenge"] | order(date desc){ _id, title, description, difficulty, date }`),
    client.fetch(`*[_type == "challenge"] | order(date desc){ _id, title, description, difficulty, date }`),
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