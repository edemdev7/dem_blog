"use client"

import { createClient } from '@/lib/supabase/client'
import { PostForm } from '@/components/posts/post-form'

export default function NewPostPage() {
  const handleSubmit = async (formData: FormData) => {
    const supabase = createClient()
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('Not authenticated')
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const cover_image = formData.get('cover_image') as string
    const tags = JSON.parse(formData.get('tags') as string)
    const slug = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')

    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        content,
        cover_image,
        author_id: session.user.id,
      })
      .select()
      .single()

    if (postError) throw postError

    if (tags.length > 0) {
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(
          tags.map((tagId: string) => ({
            post_id: post.id,
            tag_id: tagId,
          }))
        )

      if (tagError) throw tagError
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm onSubmit={handleSubmit} />
    </div>
  )
}