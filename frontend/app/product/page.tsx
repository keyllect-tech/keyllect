'use client'

import { useSearchParams } from 'next/navigation'
import ProductClient from './ProductClient'
import { Suspense } from 'react'

function ProductPageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''

  return <ProductClient id={id} />
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  )
}
