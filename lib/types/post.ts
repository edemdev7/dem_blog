export interface Post {
  id: string
  title: string
  slug: string
  content: string
  cover_image?: string | null
  published: boolean
  featured: boolean
  view_count: number
  created_at: string
  updated_at: string
  tags?: string[]
}