"use client"

import { useState, useEffect } from 'react'
import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface TagSelectProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export function TagSelect({ selectedTags, onChange }: TagSelectProps) {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<{ id: string; name: string }[]>([])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tags')
      .select('id, name')
      .order('name')

    if (error) {
      toast.error('Failed to load tags')
      return
    }

    setTags(data || [])
  }

  const createTag = async () => {
    if (!newTag.trim()) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from('tags')
      .insert({ name: newTag.trim() })
      .select()
      .single()

    if (error) {
      toast.error('Failed to create tag')
      return
    }

    setTags([...tags, data])
    setNewTag('')
    onChange([...selectedTags, data.id])
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId)
          return tag ? (
            <Badge
              key={tag.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => {
                onChange(selectedTags.filter((id) => id !== tag.id))
              }}
            >
              {tag.name} ×
            </Badge>
          ) : null
        })}
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={newTag}
              onValueChange={setNewTag}
            />
            <CommandEmpty>
              <Button
                size="sm"
                className="w-full"
                onClick={createTag}
              >
                Create "{newTag}"
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    onChange(
                      selectedTags.includes(tag.id)
                        ? selectedTags.filter((id) => id !== tag.id)
                        : [...selectedTags, tag.id]
                    )
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedTags.includes(tag.id) ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}