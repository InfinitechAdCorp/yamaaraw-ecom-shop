import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api'

    switch (action) {
      case 'products':
        // Fetch all products for price list
        const productsResponse = await fetch(`${baseUrl}/products`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch products: ${productsResponse.status}`)
        }

        const productsData = await productsResponse.json()
        
        if (!productsData.success) {
          throw new Error('API returned unsuccessful response')
        }

        // Transform the data for chatbot use
        const transformedProducts = productsData.data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          model: product.model,
          price: product.price,
          original_price: product.original_price,
          category: product.category,
          in_stock: product.in_stock,
          featured: product.featured,
          description: product.description,
          image: product.images?.[0] || null,
        }))

        return NextResponse.json({
          success: true,
          data: transformedProducts,
        })

      case 'featured':
        // Fetch featured products
        const featuredResponse = await fetch(`${baseUrl}/products/featured`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!featuredResponse.ok) {
          throw new Error(`Failed to fetch featured products: ${featuredResponse.status}`)
        }

        const featuredData = await featuredResponse.json()
        
        if (!featuredData.success) {
          throw new Error('API returned unsuccessful response')
        }

        const transformedFeatured = featuredData.data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          model: product.model,
          price: product.price,
          original_price: product.original_price,
          category: product.category,
          in_stock: product.in_stock,
          featured: product.featured,
          description: product.description,
          image: product.images?.[0] || null,
        }))

        return NextResponse.json({
          success: true,
          data: transformedFeatured,
        })

      case 'categories':
        // Fetch products and extract unique categories
        const categoriesResponse = await fetch(`${baseUrl}/products`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch products for categories: ${categoriesResponse.status}`)
        }

        const categoriesData = await categoriesResponse.json()
        
        if (!categoriesData.success) {
          throw new Error('API returned unsuccessful response')
        }

        // Extract unique categories
        const categories = [...new Set(categoriesData.data.map((product: any) => product.category))]
        
        return NextResponse.json({
          success: true,
          data: categories,
        })

      case 'search':
        // Search products
        const searchTerm = searchParams.get('q') || ''
        const category = searchParams.get('category') || ''
        const minPrice = searchParams.get('min_price') || ''
        const maxPrice = searchParams.get('max_price') || ''

        let searchUrl = `${baseUrl}/products?`
        const params = new URLSearchParams()

        if (searchTerm) params.append('search', searchTerm)
        if (category) params.append('category', category)
        if (minPrice) params.append('min_price', minPrice)
        if (maxPrice) params.append('max_price', maxPrice)

        searchUrl += params.toString()

        const searchResponse = await fetch(searchUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!searchResponse.ok) {
          throw new Error(`Failed to search products: ${searchResponse.status}`)
        }

        const searchData = await searchResponse.json()
        
        if (!searchData.success) {
          throw new Error('API returned unsuccessful response')
        }

        const transformedSearch = searchData.data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          model: product.model,
          price: product.price,
          original_price: product.original_price,
          category: product.category,
          in_stock: product.in_stock,
          featured: product.featured,
          description: product.description,
          image: product.images?.[0] || null,
        }))

        return NextResponse.json({
          success: true,
          data: transformedSearch,
        })

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action parameter',
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Chatbot API Error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api'

    switch (action) {
      case 'get_product_details':
        // Get specific product details
        const productId = data.productId
        const productResponse = await fetch(`${baseUrl}/products/${productId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch product details: ${productResponse.status}`)
        }

        const productData = await productResponse.json()
        
        if (!productData.success) {
          throw new Error('Product not found')
        }

        return NextResponse.json({
          success: true,
          data: productData.data,
        })

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action parameter',
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Chatbot API POST Error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 })
  }
}
