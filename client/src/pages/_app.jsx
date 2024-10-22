import "../globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react"; // Ensure useState is imported
import { StateProvider } from "../context/StateContext";
import reducer, { initialState } from "../context/StateReducers";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (
      router.pathname.includes("/seller") ||
      router.pathname.includes("/buyer")
    ) {
      if (!cookies.jwt) {
        router.push("/");
      } else {
        setLoading(false); // Set loading to false when authenticated
      }
    } else {
      setLoading(false); // Ensure loading is false if not in restricted routes
    }
  }, [cookies, router]);

  // Show a loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>; // Customize loading message/UI
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Custom Craft</title>
      </Head>
      <div className="relative flex flex-col h-screen justify-between">
        <Navbar />
        <div
          className={`${
            router.pathname !== "/" ? "mt-36" : ""
          } mb-auto w-full mx-auto`}
        >
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </StateProvider>
  );
}
