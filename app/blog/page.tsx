import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { PostCard } from '@/components/posts/post-card'
import { PostsFilter } from '@/components/posts/posts-filter'

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles (username),
      post_tags!inner (
        tags (id, name)
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (searchParams.tag) {
    query = query.eq('post_tags.tags.id', searchParams.tag)
  }

  const { data: posts } = await query

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="mb-8">
        <PostsFilter />
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              author: post.profiles.username,
              tags: post.post_tags.map((pt: any) => pt.tags),
            }}
          />
        ))}
      </div>
    </div>
  )
}