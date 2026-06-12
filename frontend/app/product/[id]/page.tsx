import ProductClient from './ProductClient'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductClient params={params} />
}
