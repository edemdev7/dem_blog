"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PostForm } from '@/components/posts/post-form'
import { type Post } from '@/lib/types/post'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditPostPage({
  params,
}: {
  params: { id: string }
}) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [])

  const loadPost = async () => {
    const supabase = createClient()
    
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_tags!inner (
          tag_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (!error && post) {
      setPost({
        ...post,
        tags: post.post_tags.map((pt: any) => pt.tag_id),
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (formData: FormData) => {
    const supabase = createClient()
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const cover_image = formData.get('cover_image') as string
    const tags = JSON.parse(formData.get('tags') as string)
    const slug = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')

    const { error: postError } = await supabase
      .from('posts')
      .update({
        title,
        slug,
        content,
        cover_image,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (postError) throw postError

    // Update tags
    const { error: deleteError } = await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', params.id)

    if (deleteError) throw deleteError

    if (tags.length > 0) {
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(
          tags.map((tagId: string) => ({
            post_id: params.id,
            tag_id: tagId,
          }))
        )

      if (tagError) throw tagError
    }
  }

  if (loading) {
    return <PostSkeleton />
  }

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm post={post} onSubmit={handleSubmit} />
    </div>
  )
}