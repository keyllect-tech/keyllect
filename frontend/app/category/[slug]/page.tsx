import CategoryClient from './CategoryClient'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [{ slug: 'keyboards' }, { slug: 'mice' }]
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryClient params={params} />
}
