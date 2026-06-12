import ProductClient from './ProductClient'
import { apiUrl } from '@/lib/api'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const res = await fetch(apiUrl('/api/products/'), { next: { revalidate: 60 } })
    if (res.ok) {
      const products = await res.json()
      if (Array.isArray(products) && products.length > 0) {
        return products.map((product: any) => ({
          id: String(product.id),
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch products for generateStaticParams:', error)
  }
  return [{ id: '1' }, { id: '2' }]
}

export default async function ProductPage({ params }: ProductPageProps) {
  return <ProductClient params={params} />
}

