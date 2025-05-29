// hooks/usePut.tsx
import { useState } from "react";

export default function usePut<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateData = async (updatedData: FormData | object) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`
      };

      
      if (!(updatedData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: updatedData instanceof FormData 
          ? updatedData 
          : JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const responseData = await response.json();
      setData(responseData); 
      return responseData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, updateData };
}