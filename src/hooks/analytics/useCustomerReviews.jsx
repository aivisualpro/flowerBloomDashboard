import { useEffect, useState } from "react";
import { API_BASE_URL } from 'config';

export default function useCustomerReviews() {
  const [state, setState] = useState([]);

  useEffect(() => {
    let aborted = false;
    const url = `${API_BASE_URL}/analytics/customer-reviews`;

    (async () => {
      try {
        const res = await fetch(url, {
          cache: "no-store",
          headers: { "Cache-Control": "no-store" }
        });
        const data = await res.json();

        const counts = data?.breakdown?.map((b) => b.count);

        if (!aborted) {
          setState(counts);
        }
      } catch (e) {
        if (!aborted) {
          setState({ total: 0, labels: ['Poor','Extremely Satisfied','Satisfied','Very Poor'], counts: [0,0,0,0], percents: [0,0,0,0], loading: false });
        }
        console.error("customer-reviews error:", e);
      }
    })();

    return () => { aborted = true; };
  }, []);

  return state; // { total, labels, counts, percents, loading }
}
