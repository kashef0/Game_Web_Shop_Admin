import { useState } from "react";

// hook för att hantera borttagning förfrågningar
export default function useDelete<T extends { _id: string }>(url: string) : {
    data: T[],                
    error: string | null,    
    loading: boolean,         
    deleteData: (deleteId: string) => Promise<void> 
} {

    // State för data, error och loading
    const [data, setData] = useState<T[]>([]);      
    const [error, setError] = useState<string | null>(null);  
    const [loading, setLoading] = useState<boolean>(false);

    // funktion för att radera item baserat på id
    const deleteData = async (deleteId: string) => {
        setLoading(true); 
        const originalPosts = [...data];  // spara den ursprungliga data
        
        // kontrollera om ett id skickas med
        const itemToDelete = deleteId;
        if (!itemToDelete) throw new Error("Ingen ID angiven för borttagning");

        // filtrera bort den item som ska tas bort från data
        setData((prevData) => prevData.filter((el) => el._id !== itemToDelete)); 
        
        try {
            // hämtar token från localStorage 
            const token = localStorage.getItem("token");

            // skickar ta bort förfrågan till servern
            const deleteCategoryById = await fetch(`${url}/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!deleteCategoryById.ok) {
                throw new Error('Misslyckades att ta bort item..');
            }

            setError('');  // Rensar felmeddelandet om borttagningen lyckas

        } catch (error) {
            console.error(error); 
            setError('Misslyckades att ta bort item..');  
            setData(originalPosts);  // återställer datan till den ursprungliga 
        } finally {
            setLoading(false); 
        }
    };

    // returnerar data, error, loading och deleteData funktionen
    return {data, error, loading, deleteData};
}