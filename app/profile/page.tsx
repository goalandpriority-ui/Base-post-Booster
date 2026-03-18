"use client"

import Link from "next/link"

export default function ProfilePage() {

return (

<main style={mainStyle}>

<h1 style={titleStyle}>
👤 Creator Profile
</h1>

<p style={{marginBottom:30}}>
Connect with me across platforms 🚀
</p>

{/* PROFILE CARDS */}

<div style={card}>

<a
href="https://farcaster.xyz/iamalien"
target="_blank"
rel="noopener noreferrer"
style={linkStylePurple}
>
🟣 Farcaster Profile
</a>

<a
href="https://base.app/profile/iamalien"
target="_blank"
rel="noopener noreferrer"
style={linkStyleBlue}
>
🔵 Base App Profile
</a>

<a
href="https://x.com/iamalien000"
target="_blank"
rel="noopener noreferrer"
style={linkStyleDark}
>
🐦 X (Twitter)
</a>

</div>

{/* EXTRA SECTION */}

<div style={infoBox}>
<p>🚀 Building on Base</p>
<p>🔥 Boosting Social Posts</p>
<p>⚡ Web3 Growth Tools</p>
</div>

{/* 💰 TIP SECTION */}

<div style={tipBox}>

<p style={{marginBottom:10,fontWeight:"bold"}}>
💰 Support My Work
</p>

<p style={{fontSize:12,opacity:0.7,marginBottom:15}}>
Send a tip on Base 🚀
</p>

<p style={walletText}>
0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2
</p>

<button
onClick={()=>{
navigator.clipboard.writeText("0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2")
}}
style={copyBtn}
>
Copy Address
</button>

<a
href="https://basescan.org/address/0xffF8b3F8D8b1F06EDE51fc331022B045495cEEA2"
target="_blank"
rel="noopener noreferrer"
style={tipBtn}
>
⚡ Send Tip
</a>

</div>

{/* BACK */}

<div style={{marginTop:40}}>
<Link href="/" style={backBtn}>
← Back to Home
</Link>
</div>

</main>

)

}

/* ---------------- STYLES ---------------- */

const mainStyle: React.CSSProperties = {
minHeight:"100vh",
background:"#0f172a",
padding:30,
textAlign:"center",
color:"white"
}

const titleStyle: React.CSSProperties = {
fontSize:32,
fontWeight:"bold",
marginBottom:20,
background:"linear-gradient(90deg,#6366f1,#22c55e)",
WebkitBackgroundClip:"text",
color:"transparent"
}

const card: React.CSSProperties = {
background:"rgba(255,255,255,0.05)",
backdropFilter:"blur(10px)",
padding:25,
borderRadius:16,
display:"flex",
flexDirection:"column",
gap:15,
maxWidth:400,
margin:"0 auto"
}

const linkStylePurple: React.CSSProperties = {
display:"block",
padding:"12px",
borderRadius:10,
background:"linear-gradient(90deg,#a855f7,#6366f1)",
color:"white",
fontWeight:"bold",
textDecoration:"none"
}

const linkStyleBlue: React.CSSProperties = {
display:"block",
padding:"12px",
borderRadius:10,
background:"linear-gradient(90deg,#3b82f6,#22c55e)",
color:"white",
fontWeight:"bold",
textDecoration:"none"
}

const linkStyleDark: React.CSSProperties = {
display:"block",
padding:"12px",
borderRadius:10,
background:"linear-gradient(90deg,#111827,#374151)",
color:"white",
fontWeight:"bold",
textDecoration:"none"
}

const infoBox: React.CSSProperties = {
marginTop:30,
padding:20,
background:"rgba(255,255,255,0.05)",
borderRadius:12,
maxWidth:400,
marginInline:"auto"
}

/* 💰 TIP STYLES */

const tipBox: React.CSSProperties = {
marginTop:30,
padding:20,
background:"rgba(255,255,255,0.05)",
borderRadius:12,
maxWidth:400,
marginInline:"auto",
textAlign:"center"
}

const walletText: React.CSSProperties = {
fontSize:12,
wordBreak:"break-all",
marginBottom:10,
opacity:0.8
}

const copyBtn: React.CSSProperties = {
padding:"6px 10px",
borderRadius:6,
background:"#334155",
color:"white",
border:"none",
marginBottom:10,
cursor:"pointer"
}

const tipBtn: React.CSSProperties = {
display:"block",
marginTop:10,
padding:"10px",
borderRadius:10,
background:"linear-gradient(90deg,#22c55e,#4ade80)",
color:"black",
fontWeight:"bold",
textDecoration:"none",
boxShadow:"0 0 15px rgba(34,197,94,0.6)"
}

const backBtn: React.CSSProperties = {
color:"#22c55e",
fontWeight:"bold",
fontSize:16
}
