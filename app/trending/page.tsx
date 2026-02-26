"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Trending() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTrending() {
      const { data, error } = await supabase
        .from("boosted_posts")
        .select("*")
        .order("boost_count", { ascending: false });
      if (error) console.error(error);
      else setPosts(data || []);
    }
    fetchTrending();
  }, []);

  return (
    <main style={{ padding: 20, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Trending Boosted Posts</h1>

      <div style={{ marginBottom: 20 }}>
        <a href="/">Back to Boost</a>
      </div>

      {posts.length === 0 && <p>No boosted posts yet.</p>}

      {posts.map((post, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: 20, marginTop: 20 }}>
          <h3>#{index + 1}</h3>
          <p><strong>Boost Count:</strong> {post.boost_count}</p>
          <p><strong>Tier:</strong> {post.tier}</p>
          <p><strong>Time:</strong> {post.created_at}</p>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => window.open(post.post_link, "_blank")} style={{ padding: "8px 15px", cursor: "pointer" }}>
              View Post
            </button>
          </div>

          {post.contract && (
            <div style={{ marginTop: 20 }}>
              <iframe
                src={`https://dexscreener.com/base/${post.contract}`}
                width="100%"
                height="500"
                style={{ border: "none" }}
              ></iframe>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
