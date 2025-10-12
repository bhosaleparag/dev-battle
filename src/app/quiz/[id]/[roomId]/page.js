import { client } from "@/lib/sanity";
import MultiplayerQuiz from "@/components/quiz/MultiplayerQuiz";

export default async function page({params}) {
  const { id, roomId } = await params
  const quizData = await client.fetch(`*[_id == "${id}"][0]`);

  return (
    <MultiplayerQuiz quizData={quizData} roomId={roomId} />
  )
}
