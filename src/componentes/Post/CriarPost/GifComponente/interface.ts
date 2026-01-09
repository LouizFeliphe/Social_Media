export type GifResult = {
  id: string
  media_formats: {
    gif: { url: string }
    nanogif?: { url: string }
  }
}

export type Category = {
  name: string
  image: string
  path: string
  searchterm: string
}

export interface GifTabProps {
  onSelect: (gifUrl: string) => void 
}