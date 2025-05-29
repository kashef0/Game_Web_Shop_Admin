import { useState, useEffect } from "react";


// hook för att hantera get förfrågningar
export default function useGet<T>(url: string, updateStatus: boolean, id?: string, authToken?: string) : {
    data: T,              
    error: string | null, 
    loading: boolean,     
    fetchData: () => Promise<void>  // Funktion för att hämta data
} {

    // State för data, error och loading
    const [data, setData] = useState<T>([] as T);    
    const [error, setError] = useState<string | null>(null);  
    const [loading, setLoading] = useState<boolean>(false);

    // triggar datahämtning när url id eller updateStatus ändras
    useEffect(() => {
        fetchData();  // hämta data
    }, [url, id, updateStatus]); 
    
    // Funktion för att hämta data
    const fetchData = async () => {
        setLoading(true); 
        try {
            let response;
            
            // bygger url beroende på om ett id är angivet
            let urlWithId = url;
            if (id) {
                urlWithId = `${url}/${id}`;  // lägg till id till url om det finns
            }
            
            if (!authToken) {
                response = await fetch(urlWithId);  // skicka get förfrågan
            } else {
                response = await fetch(urlWithId, {
                    method: "GET",   // eller annan metod om behövs
                    headers: {"Authorization": `Bearer ${authToken}`},  // Lägg till headers här
                    
                });
            }
           

            if (!response.ok) {
                throw Error("Fel vid hämtning av data" + response.status); 
            }

            
            const fetchedData = await response.json();  // spara data
            
            setData(fetchedData);
            setError(null);
        } catch (error) {
            console.error("Fel:", error);
            setError("Kunde inte hämta data.");
        } finally {
            setLoading(false); 
        }
    };

    // Returnerar alla tillstånd och funktioner
    return {data, error, loading, fetchData};
}