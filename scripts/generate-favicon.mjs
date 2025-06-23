import fs from 'fs'
import path from 'path'

// Simple favicon.ico generator
// This creates a basic ICO file structure with our 32x32 PNG
function createFaviconIco() {
  try {
    // Read the 32x32 PNG file
    const pngPath = path.join(process.cwd(), 'public', 'icon-32x32.png')
    
    if (!fs.existsSync(pngPath)) {
      console.log('❌ icon-32x32.png not found. Please ensure the PNG files are generated first.')
      return
    }

    // For now, let's create a simple text-based favicon as a placeholder
    // In production, you'd use a proper ICO conversion library
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
    
    // Create a minimal ICO file header (this is a simplified approach)
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

    // Read PNG data
    const pngData = fs.readFileSync(pngPath)
    
    // Update image size in header
    icoHeader.writeUInt32LE(pngData.length, 8)
    
    // Combine header and PNG data
    const icoData = Buffer.concat([icoHeader, pngData])
    
    // Write ICO file
    fs.writeFileSync(faviconPath, icoData)
    
    console.log('✅ favicon.ico generated successfully!')
    console.log(`📁 File size: ${icoData.length} bytes`)
    
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message)
    
    // Fallback: create a simple placeholder
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
    const placeholder = Buffer.from('MR') // Simple text placeholder
    fs.writeFileSync(faviconPath, placeholder)
    console.log('📝 Created placeholder favicon.ico')
  }
}

createFaviconIco()
