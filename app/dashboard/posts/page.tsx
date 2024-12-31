import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

export default async function PostsPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">New Post</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="ghost" size="sm">
                  {post.published ? 'Unpublish' : 'Publish'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}