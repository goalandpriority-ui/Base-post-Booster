export default function ShareButtons({ postUrl }: { postUrl: string }) {
  const text = encodeURIComponent(
    `I just boosted my post on Base 🚀 Check it out: ${postUrl}`
  )

  return (
    <div>
      <a
        href={`https://warpcast.com/~/compose?text=${text}`}
        target="_blank"
      >
        Share on Farcaster
      </a>

      <br />

      <a
        href={`https://twitter.com/intent/tweet?text=${text}`}
        target="_blank"
      >
        Share on X
      </a>
    </div>
  )
}
