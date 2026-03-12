export function decodeBasePost(link: string): string | null {
  try {
    const encoded = link.split("/content/")[1]
    if (!encoded) return null

    const decoded = atob(encoded)

    return decoded
  } catch (err) {
    return null
  }
}

export function extractContract(decoded: string): string | null {
  const match = decoded.match(/0x[a-fA-F0-9]{40}/)
  return match ? match[0] : null
}
