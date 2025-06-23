import fs from 'fs'
import path from 'path'

// Simple favicon.ico generator with better error handling
function createFaviconIco() {
  try {
    const pngPath = path.join(process.cwd(), 'public', 'icon-32x32.png')
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
    
    console.log('🔍 Looking for icon-32x32.png...')
    
    if (!fs.existsSync(pngPath)) {
      console.log('⚠️  icon-32x32.png not found, creating simple favicon...')
      
      // Create a minimal ICO file with basic structure
      const simpleIco = Buffer.from([
        0x00, 0x00, // Reserved
        0x01, 0x00, // ICO type
        0x01, 0x00, // Number of images
        0x10, // Width (16)
        0x10, // Height (16)
        0x00, // Color palette
        0x00, // Reserved
        0x01, 0x00, // Color planes
        0x08, 0x00, // Bits per pixel
        0x40, 0x00, 0x00, 0x00, // Image size (64 bytes)
        0x16, 0x00, 0x00, 0x00  // Image offset
      ])
      
      // Add simple bitmap data (16x16 blue square)
      const bitmapData = Buffer.alloc(64, 0x1F) // Blue color
      const icoData = Buffer.concat([simpleIco, bitmapData])
      
      fs.writeFileSync(faviconPath, icoData)
      console.log('✅ Simple favicon.ico created!')
      return
    }

    console.log('✅ Found icon-32x32.png, creating favicon...')
    
    // Read PNG data
    const pngData = fs.readFileSync(pngPath)
    
    // Create ICO header
    const icoHeader = Buffer.from([
      0x00, 0x00, // Reserved
      0x01, 0x00, // ICO type
      0x01, 0x00, // Number of images
      0x20, // Width (32)
      0x20, // Height (32)
      0x00, // Color palette
      0x00, // Reserved
      0x01, 0x00, // Color planes
      0x20, 0x00, // Bits per pixel
      0x00, 0x00, 0x00, 0x00, // Image size (will be updated)
      0x16, 0x00, 0x00, 0x00  // Image offset
    ])

    // Update image size in header
    icoHeader.writeUInt32LE(pngData.length, 8)
    
    // Combine header and PNG data
    const icoData = Buffer.concat([icoHeader, pngData])
    
    // Write ICO file
    fs.writeFileSync(faviconPath, icoData)
    
    console.log('✅ favicon.ico generated from PNG!')
    console.log(`📁 File size: ${icoData.length} bytes`)
    
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message)
    console.log('📝 Creating minimal fallback favicon...')
    
    // Create absolute minimal favicon
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
    const minimalIco = Buffer.from([
      0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x08, 0x00,
      0x68, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ])
    
    fs.writeFileSync(faviconPath, minimalIco)
    console.log('✅ Minimal favicon.ico created as fallback')
  }
}

createFaviconIco()
