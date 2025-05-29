import { useState } from "react";

// hook för att hantera post förfrågningar
export default function usePost<T>(url: string) : {
    data: T | null,                  // hämtade datan
    error: string | null,     // felmeddelande
    loading: boolean,         // Indikerar om förfrågan är pågående
    postData: (req: T) => Promise<T | null>  //  skicka post förfrågan
} {

    // State för data, error och loading
    const [data, setData] = useState<T>([] as T);    
    const [error, setError] = useState<string | null>(null);  
    const [loading, setLoading] = useState<boolean>(false);

    // skicka post förfrågan
    const postData = async (req: T) => {
        setLoading(true); 
        setError(null);
        try {
            const token = localStorage.getItem("token");  // Hämta token
            const response = await fetch(url, {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json',   
                    'Authorization': `Bearer ${token}`,   
                },
                body: JSON.stringify(req),  
            });

            if (!response.ok) {
                const errorText = await response.json();
                
                throw new Error(errorText.message); 
            }

            const responseData = await response.json();  // Spara data
            setData(responseData);
            return responseData;
        } catch (err: any) {
            console.log("err:: ",err)
            setError(err.message || "Kunde inte hämta data.");
            return null;
        } finally {
            setLoading(false);  
        }
    };

    // Returnera alla data och funktioner
    return {data, error, loading, postData};
}