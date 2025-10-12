import { client } from "@/lib/sanity";
import MultiplayerCodeEditor from "./MultiplayerCodeEditor";

export default async function page({params}) {
  const { id, roomId } = await params
  const data = await client.fetch(`*[_id == "${id}"][0]`);

  return (
    <MultiplayerCodeEditor data={data} roomId={roomId} />
  )
}
