import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (username),
      post_tags!inner (
        tags (id, name)
      )
    `)
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) {
    notFound()
  }

  // Increment view count
  await supabase.rpc('increment_view_count', { post_id: post.id })

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {post.cover_image && (
        <div className="aspect-video mb-8 overflow-hidden rounded-lg">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center gap-4 text-muted-foreground mb-8">
        <span>By {post.profiles.username}</span>
        <span>•</span>
        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
        <span>•</span>
        <span>{post.view_count} views</span>
      </div>

      <div className="flex gap-2 mb-8">
        {post.post_tags.map((pt: any) => (
          <Link key={pt.tags.id} href={`/blog?tag=${pt.tags.id}`}>
            <Badge variant="secondary">{pt.tags.name}</Badge>
          </Link>
        ))}
      </div>

      <div className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}