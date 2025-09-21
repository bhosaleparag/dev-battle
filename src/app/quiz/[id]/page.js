import { client } from "@/lib/sanity";
import QuizApp from "./Quiz";

export default async function page({params}) {
  const { id } = await params
  const quizData = await client.fetch(`*[_id == "${id}"][0]`);

  return (
    <QuizApp quizData={quizData}/>
  )
}