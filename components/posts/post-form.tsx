"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TiptapEditor } from '@/components/editor/tiptap-editor'
import { TagSelect } from '@/components/posts/tag-select'
import { ImageUpload } from '@/components/posts/image-upload'
import { toast } from 'sonner'
import { type Post } from '@/lib/types/post'

interface PostFormProps {
  post?: Post
  onSubmit: (data: FormData) => Promise<void>
}

export function PostForm({ post, onSubmit }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags || [])
  const [content, setContent] = useState(post?.content || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append('content', content)
      formData.append('tags', JSON.stringify(selectedTags))
      await onSubmit(formData)
      toast.success(post ? 'Post updated' : 'Post created')
      router.push('/dashboard/posts')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={post?.title}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <ImageUpload
          defaultImage={post?.cover_image}
          onUpload={(url) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = 'cover_image'
            input.value = url
            document.forms[0].appendChild(input)
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagSelect
          selectedTags={selectedTags}
          onChange={setSelectedTags}
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/posts')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}