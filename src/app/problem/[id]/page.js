import { client } from '@/lib/sanity';
import React from 'react'
import CodeEditor from './CodeEditor';

async function page({ params }) {
  const { id } = await params
  const data = await client.fetch(`*[_id == "${id}"][0]`);
  
  return (
    <CodeEditor data={data}/>
  )
}

export default page