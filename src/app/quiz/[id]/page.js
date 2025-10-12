import { client } from "@/lib/sanity";
import SinglePlayerQuiz from "@/components/quiz/SinglePlayerQuiz";

export default async function page({params}) {
  const { id } = await params
  const quizData = await client.fetch(`*[_id == "${id}"][0]`);

  return (
    <SinglePlayerQuiz quizData={quizData}/>
  )
}
