// components/OrderCard.tsx
import type { FC } from "react";
import type { Games } from "../types/Game";
import type { Order } from "../types/Order";
import Button from "./Button";

interface Props {
  order: Order;
  getGameDetails: (rawgId: string) => Games | undefined;
  onMarkAsDelivered: (orderId: string) => void;
  onDelete: (orderId: string) => void;
  
}

const OrderCard: FC<Props> = ({
  order,
  getGameDetails,
  onMarkAsDelivered,
  onDelete,
}) => {
  return (
    <div className="card mb-3 p-3">
      <h2 className="fs-4">Order ID: {order._id}</h2>
      <p className="m-0 fw-semibold">User: {order.user?.name || "N/A"}</p>
      <p className="m-0">Email: {order.user?.email || "N/A"}</p>
      <p className="m-0">Adress: {order.address || "N/A"}</p>
      <p className="m-0">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      {order.deliveredAt && (
        <p className="m-0">
          Delivered At: {new Date(order.deliveredAt).toLocaleDateString()}
        </p>
      )}
      <p className="m-0">Status: {order.isDelivered ? "Delivered" : "Pending"}</p>
      <p className="m-0">Total: {order.totalPrice} SEK</p>

      {order.rentalReturnDate && (
        <p>
          Return by:{" "}
          {new Date(order.rentalReturnDate).toLocaleDateString()}
        </p>
      )}

      {order.items.map((item, i) => {
        const game = getGameDetails(item.game?.rawgId);
        if (!game) return;
        return (
          <div key={item.game?.rawgId || i} className="border-top pt-2 mt-2">
            <h6>{game?.name || "Unknown Game"}</h6>
            <p className="m-0">
              {item.isRental ? "Rental" : "Purchase"} — Qty: {item.quantity}
            </p>
            {item.rentalDuration && (
              <p>Duration: {item.rentalDuration} days</p>
            )}
            <p>Price: {item.priceAtPurchase} SEK</p>
          </div>
        );
      })}

      <div className="d-flex gap-2 mt-3">
        {!order.isDelivered && (
          <Button
            onClick={() => onMarkAsDelivered(order._id)}
            variant="success"
          >
            Mark as Delivered
          </Button>
        )}
        {!order.isDelivered && (
          <Button onClick={() => onDelete(order._id)} variant="danger">
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
