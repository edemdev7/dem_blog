"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function PostsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([])
  const selectedTag = searchParams.get('tag')

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('tags')
      .select('id, name')
      .order('name')

    if (data) {
      setTags(data)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Filter by Tag
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push('/blog')}
        >
          <Check className={`mr-2 h-4 w-4 ${!selectedTag ? 'opacity-100' : 'opacity-0'}`} />
          All Posts
        </DropdownMenuItem>
        {tags.map((tag) => (
          <DropdownMenuItem
            key={tag.id}
            onClick={() => router.push(`/blog?tag=${tag.id}`)}
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                selectedTag === tag.id ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {tag.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}