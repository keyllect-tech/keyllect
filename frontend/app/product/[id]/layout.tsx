export const runtime = 'edge';

import { Metadata } from 'next'
import { getProductById } from '@/lib/data'
import { apiUrl, mediaUrl } from '@/lib/api'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  let product = null;
  try {
    const res = await fetch(apiUrl('/api/products/'), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      product = data.find((p: any) => String(p.id) === id);
    }
  } catch (e) {
    console.error("Failed to fetch products for metadata");
  }

  if (!product) {
    return { title: 'Товар не найден' }
  }

  const title = `Купить ${product.name} в Ташкенте | Keyllect`
  const description = `${product.description.substring(0, 150)}... Купить игровую периферию в Узбекистане.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keyllect.uz/product/${product.id}`,
      images: product.images && product.images.length > 0 && product.images[0].image 
        ? [{ url: mediaUrl(product.images[0].image) }] 
        : [],
    },
    alternates: {
      canonical: `https://keyllect.uz/product/${product.id}`,
    }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
