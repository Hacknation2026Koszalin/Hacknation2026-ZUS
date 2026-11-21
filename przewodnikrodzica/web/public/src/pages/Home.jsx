import { useEffect, useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    fetch("/api/hello")
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .catch(() => setMsg("API not reachable"));
  }, []);

  return <h1>{msg}</h1>;
}
