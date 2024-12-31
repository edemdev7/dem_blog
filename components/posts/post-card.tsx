import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface PostCardProps {
  post: {
    slug: string
    title: string
    cover_image?: string | null
    created_at: string
    author: string
    tags: Array<{ id: string; name: string }>
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      {post.cover_image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>{post.author}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t">
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <Link key={tag.id} href={`/blog?tag=${tag.id}`}>
              <Badge variant="secondary">{tag.name}</Badge>
            </Link>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}