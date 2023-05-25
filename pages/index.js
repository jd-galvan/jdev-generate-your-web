import { useState } from "react";
import styles from './index.module.css';
import parser from "html-react-parser"

export default function Home() {
  const [featureInput, setFeature] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false)

  async function onSubmit(event) {
    setLoading(true)
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feature: featureInput }),
      });

      const data = await response.text();
      setLoading(false);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data);
      setFeature("");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <div className={styles.form}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="feature"
            placeholder="¿Cómo quieres que se vea la web?"
            value={featureInput}
            onChange={(e) => setFeature(e.target.value)}
          />
          <input className={loading ? styles.btnDisabled : styles.btnEnabled} type="submit" value=">" disabled={loading} />
        </form>
      </div>
      <div className={styles.flexContainer}>
        <div className={styles.web}>
          {result ? parser(result) : "Aquí verás el resultado :O"}
        </div>
        <div className={styles.code}>
          <p>{result || "Aquí verás el código :O"}</p>
        </div>
      </div>
    </div>
  );
}
