import React from 'react'

function Footer() {
  return (
    <>
 
     <div style={{ 
  height: "220px", // Increased height to accommodate the image
  width: "100%", 
  backgroundColor: "#ffffff", 
  display: "flex", 
  flexDirection: "column", // Stacks image and text vertically
  alignItems: "center", 
  justifyContent: "center",
  borderTop: "1px solid #f1f5f9",
  gap: "15px" // Adds space between image and text
}}
className='border-2 border-gray-200 rounded-2xl mt-5'
>
  {/* Logo Image */}
  <img 
    src="\ayurveda.jpeg" 
    alt="Ayurveda Logo" 
    style={{ 
      height: "80px", // Adjust size as needed
      width: "auto",
      objectFit: "contain" 
    }} 
  />

  {/* Footer Text */}
  <p style={{ 
    margin: 0, 
    color: "#64748b", 
    fontSize: "14px", 
    fontFamily: "sans-serif",
    letterSpacing: "0.02em"
  }}>
    Created and designed by 
    <span style={{ fontWeight: "700", color: "#0f172a", marginLeft: "5px" }}>
      <span className='text-green-500'>Codeware (InnovativeX)</span>
    </span>
  </p>
</div>
    </>
  )
}

export default Footer