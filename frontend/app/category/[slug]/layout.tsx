export const runtime = 'edge';

import { Metadata } from 'next'
import { categorySEOData } from '@/lib/seo-data'

interface CategoryLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const seo = categorySEOData[slug]

  if (!seo) {
    return { title: 'Категория' }
  }

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://keyllect.uz/category/${slug}`,
    },
    alternates: {
      canonical: `https://keyllect.uz/category/${slug}`,
    }
  }
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return <>{children}</>
}
