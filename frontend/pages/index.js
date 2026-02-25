import Head from "next/head";
import BoostForm from "../components/BoostForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Base Post Booster 🚀</title>
        <meta name="description" content="Boost your posts on Base chain with simple fixed slots MVP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", paddingTop: "50px", backgroundColor: "#f3f4f6" }}>
        <div style={{ width: "100%", maxWidth: "500px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Base Post Booster MVP 🚀</h1>
          <BoostForm />
        </div>
      </main>
    </>
  );
}
