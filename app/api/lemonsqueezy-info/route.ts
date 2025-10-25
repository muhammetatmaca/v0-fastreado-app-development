import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 400 })
    }

    // Get stores
    const storesResponse = await fetch('https://api.lemonsqueezy.com/v1/stores', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!storesResponse.ok) {
      throw new Error(`Stores API error: ${storesResponse.statusText}`)
    }

    const storesData = await storesResponse.json()
    const stores = storesData.data || []

    // Get products for each store
    const storeInfo = []
    
    for (const store of stores) {
      const storeId = store.id
      
      // Get products for this store
      const productsResponse = await fetch(`https://api.lemonsqueezy.com/v1/products?filter[store_id]=${storeId}`, {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      let products = []
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        products = productsData.data || []
      }

      // Get variants for each product
      const productsWithVariants = []
      for (const product of products) {
        const variantsResponse = await fetch(`https://api.lemonsqueezy.com/v1/variants?filter[product_id]=${product.id}`, {
          headers: {
            'Accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${apiKey}`,
          },
        })

        let variants = []
        if (variantsResponse.ok) {
          const variantsData = await variantsResponse.json()
          variants = variantsData.data || []
        }

        productsWithVariants.push({
          id: product.id,
          name: product.attributes.name,
          description: product.attributes.description,
          price: product.attributes.price,
          variants: variants.map(v => ({
            id: v.id,
            name: v.attributes.name,
            price: v.attributes.price,
            interval: v.attributes.interval,
            interval_count: v.attributes.interval_count
          }))
        })
      }

      storeInfo.push({
        id: storeId,
        name: store.attributes.name,
        slug: store.attributes.slug,
        domain: store.attributes.domain,
        products: productsWithVariants
      })
    }

    return NextResponse.json({
      success: true,
      stores: storeInfo,
      instructions: {
        step1: "Copy your Store ID from above",
        step2: "Copy Variant IDs for your products",
        step3: "Update .env file with LEMONSQUEEZY_STORE_ID",
        step4: "Update app/actions/lemonsqueezy.ts with VARIANT_IDS",
        step5: "Create webhook at https://app.lemonsqueezy.com/settings/webhooks",
        webhook_url: "https://localhost:3000/api/webhooks/lemonsqueezy"
      }
    })

  } catch (error) {
    console.error('Lemon Squeezy info error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}