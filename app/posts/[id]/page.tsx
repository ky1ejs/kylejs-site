import * as runtime from "react/jsx-runtime"
import { getAllPostIds, getPostData } from '@/lib/posts'
import {compile, evaluate, run} from "@mdx-js/mdx"
import { ReactNode } from "react"


type Params = {
  id: string
}

type Props = {
  params: Params
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostData(params.id)

  return {
    title: "blog",
  }
}

const H1 = ({children}: {children: ReactNode}) => <h1 className="text-lg text-red-500">{children}</h1>
const Test = () => (
  <div className="text-center">
    This is a centerd Div rendered from mdx
  </div> 
)


// -< Post >-
export default async function Post({ params }: Props) {
  const file = await getPostData(params.id)
  const compiled = await compile(file.fileContents, {outputFormat: "function-body", development: false}) 
  console.log(`compiled: ${compile}`)
  // const {default: Content} = await run(compiled, runtime) 
  const result = await run(compiled, runtime) 
  const Content = result.default as JSX.ElementType
  return (<Content components={{h2: H1, Test}}/>)
}

export async function generateStaticParams(): Promise<Props[]> {
  return getAllPostIds()
}