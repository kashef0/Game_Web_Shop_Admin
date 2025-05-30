import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useGet from "../hooks/useGet";
import usePut from "../hooks/usePut";
import useDelete from "../hooks/useDelete";
import {
  setOrders,
  updateOrder,
  deleteOrder as deleteOrderAction,
} from "../redux/slices/orderSlice";


import ShowMoreButton from "../components/ShowMoreButton";
import ItemSearch from "../components/ItemSearch";
import ItemSort from "../components/ItemSort";
import type { RootState } from "../redux/store";
import type { Order, SortOption } from "../types/Order";
import OrderCard from "../components/OrderCard";


const AdminOrdersPage = () => {
  const dispatch = useDispatch();

  // hämtar token från redux store
  const { token } = useSelector((state: RootState) => state.auth);

  // hämtar spel och order data från redux store
  const { games: gamesdetails } = useSelector((state: RootState) => state.game);
  const { orders } = useSelector((state: RootState) => state.order);

  // hanterar lokal state
  const [updateStatus, setUpdateStatus] = useState(false);
  const [sortOption, setSortOption] = useState<
    "date" | "user" | "price" | "isDelivered" | ""
  >("");

  const sortOptions: SortOption[] = [
  { value: "", label: "--Alla ordrar--" },
  { value: "date", label: "Datum (Nyast först)" },
  { value: "user", label: "Användarnamn (A–Ö)" },
  { value: "price", label: "Totalt pris (Högst först)" },
  { value: "isDelivered", label: "Leveransstatus" },
];

  const [visibleCount, setVisibleCount] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_DATABASE_API_URL;

  // anropar custom hook för att hämta ordrar
  const {
    data: fetchedOrders,
    error,
    loading,
    fetchData,
  } = useGet<Order[]>(`${BASE_URL}/api/orders`, updateStatus, "", token || "");

  // anropar custom hook för att markera order som levererad
  const { updateData: markAsDelivered } = usePut<Order>(
    currentOrderId ? `${BASE_URL}/api/orders/${currentOrderId}/deliver` : ""
  );

  // anropar custom hook för att radera order
  const { deleteData, loading: deletedLoading } = useDelete<Order>(
    `${BASE_URL}/api/orders`
  );

  // uppdaterar redux store med ordrar när data har hämtats
  useEffect(() => {
    if (fetchedOrders) {
      dispatch(setOrders(fetchedOrders));
    }
  }, [fetchedOrders, dispatch]);

  // hanterar leveransmarkering och refetch vid radering
  useEffect(() => {
    const deliverOrder = async () => {
      if (!currentOrderId) return;

      try {
        await markAsDelivered({});
        dispatch(
          updateOrder({ _id: currentOrderId, isDelivered: true } as Order)
        );
        alert("Order marked as delivered");
        setUpdateStatus(!updateStatus);
      } catch {
        alert("Error marking as delivered");
      } finally {
        setCurrentOrderId(null);
      }
    };

    if (deletedLoading) {
      fetchData();
    }

    deliverOrder();
  }, [currentOrderId]);

  // sorterar orders baserat på valt alternativ
  const sortOrders = (orders: Order[]) => {
    const sorted = [...orders];
    if (sortOption === "date") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOption === "user") {
      sorted.sort((a, b) => {
        const nameA = a.user?.name?.toLowerCase() || "";
        const nameB = b.user?.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === "price") {
      sorted.sort((a, b) => b.totalPrice - a.totalPrice);
    } else if (sortOption === "isDelivered") {
      // sorterar så att icke levererade ordrar visas först
      sorted.sort((a, b) => {
        return Number(b.isDelivered) - Number(a.isDelivered);
      });
    }
    return sorted;
  };

  // filtrerar orders efter söktermen
  const filterOrders = (orders: Order[]) => {
    if (!searchTerm.trim()) return orders;
    const lowerTerm = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const name = order.user?.name?.toLowerCase() || "";
      const email = order.user?.email?.toLowerCase() || "";
      return name.includes(lowerTerm) || email.includes(lowerTerm);
    });
  };

  // hämtar detaljer för ett spel baserat på rawgId
  const getGameDetails = (rawgId: string) =>
    gamesdetails.find((g) => g.rawgId === rawgId);

  // hanterar radering av order
  const handleDeleteOrder = async (orderId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    await deleteData(orderId);
    dispatch(deleteOrderAction(orderId));
  };

  // kombinerar filtrering och sortering
  const filteredSortedOrders = sortOrders(filterOrders(orders));

  // visar endast ett begränsat antal ordrar åt gången
  const visibleOrders = filteredSortedOrders.slice(0, visibleCount);

  return (
    <div className="container mt-4">
      <h1>All Orders</h1>
      <ItemSearch searchTerm={searchTerm} onChange={setSearchTerm} />
      <ItemSort sortOption={sortOption} onChange={setSortOption} options={sortOptions} />
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          {visibleOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              getGameDetails={getGameDetails}
              onMarkAsDelivered={setCurrentOrderId}
              onDelete={handleDeleteOrder}
            />
          ))}
          {visibleCount < filteredSortedOrders.length && (
            <ShowMoreButton
              onClick={() => setVisibleCount((prev) => prev + 10)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;
