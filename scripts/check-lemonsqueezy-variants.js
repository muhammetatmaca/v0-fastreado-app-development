// Lemon Squeezy Product Variants Kontrol Script
// Node.js ile çalıştırın: node scripts/check-lemonsqueezy-variants.js

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI4OGQ3ZDg2ZGQ5MDNkOGMyN2ViOGFjNzZiYmYyYWU2ZDU4M2MwOTZjY2JmY2NmZmZhYzU5NWFkNTczZDAzNGY2Yzg4MTljYTJjMDViYzAyMSIsImlhdCI6MTc2MTkxMDU2Ni40NzYzNDMsIm5iZiI6MTc2MTkxMDU2Ni40NzYzNDUsImV4cCI6MjA3NzQ0MzM2Ni40NjEwMTYsInN1YiI6IjU4MzE0NTEiLCJzY29wZXMiOltdfQ.45Zo7bacSxRtDpt-djj0GN1D5ZTbbQhY3wWH9TwjwTpYNbSi5gKDPB5lq98tVGfeDfgTvDqIJEFsXsTsbVKc0V0jvmFQQ_9DHpWB4TblzI3yfskmDwWEoRn3bix3zlkM3mqvg71Z_sNCRnccilr2ugWkR4FfNUS3ZP87AQkPaNslInnOVkHbkvoWZPP-9eLkl3E_V8qu-r7OF6c1hSgqr5KVimIQZAe24wJ9aDAXOneaKbIKE5LVq5ImNVaTs1OhNF1Wm9udtARHLhwbEbaC5fk3vOWchcUWhZ4pNtp8sSoqbOCWkjk7JQwLStDrYqvSeTsn4yL0BEGBKpMaK5Uu4Y2KmEq28WOvomJBYdYnCu7sTrQpplRozbCqy_76l_ZmUO5jf0ENKFdICn1NYQaoAr7Fnh99ELEkWcZN9b40myIAdN7Vk0O9ZHdXW4_YdJhPQvl_1TBY08aaxykom6Y1FIGARt2mL3poH2-ouRB2ycvMYmFIEdzk82L1brf2PXlZ23lenWHohincg3rYxgfnpdHdGKOtSRc4FNi0YVAQlw_neoa6kaQXGm8bJK_tCWziumvPnV35KdlebX6bCq7S6mBoC5oHZMlQYH5NfPXUtRcFsfUbLzRdT3VtR20UB9tpJfVYASdKD-NXBQoA8Obv3okHRUSHjr-PzbZGqt6QC9M"
const PRODUCT_ID = "678363"

async function getProductVariants() {
  try {
    const response = await fetch(`https://api.lemonsqueezy.com/v1/variants?filter[product_id]=${PRODUCT_ID}`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('=== LEMON SQUEEZY VARIANTS ===')
    console.log('Product ID:', PRODUCT_ID)
    console.log('Variants found:', data.data.length)
    console.log('')
    
    data.data.forEach((variant, index) => {
      console.log(`Variant ${index + 1}:`)
      console.log('  ID:', variant.id)
      console.log('  Name:', variant.attributes.name)
      console.log('  Price:', variant.attributes.price / 100, variant.attributes.price_formatted)
      console.log('  Status:', variant.attributes.status)
      console.log('  Interval:', variant.attributes.interval)
      console.log('  Interval Count:', variant.attributes.interval_count)
      console.log('')
    })
    
    if (data.data.length > 0) {
      console.log('=== KULLANILACAK VARIANT ID ===')
      console.log('Premium Monthly Variant ID:', data.data[0].id)
      console.log('')
      console.log('Bu ID\'yi app/actions/lemonsqueezy.ts dosyasında güncelleyin:')
      console.log(`premium: '${data.data[0].id}',`)
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

getProductVariants()