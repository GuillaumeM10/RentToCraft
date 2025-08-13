"use client";
import { type OrderDto, OrderStatus } from "@rent-to-craft/dtos";
import { useState } from "react";

import OrderService from "@/app/services/order.service";

import { LoadingSpinner } from "../../LoadingSpinner";

type EditOrderProps = {
  readonly order: OrderDto;
  readonly onSuccess: () => void;
};

const EditOrder = ({ order, onSuccess }: EditOrderProps) => {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (element: React.FormEvent<HTMLFormElement>) => {
    element.preventDefault();
    setIsLoading(true);
    try {
      await OrderService.updateOrder({ id: order.id, status });
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h2>Modifier la commande #{order.id}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="status">Statut</label>
              <select
                name="status"
                id="status"
                value={status}
                onChange={(element) =>
                  setStatus(element.target.value as OrderStatus)
                }
              >
                {Object.values(OrderStatus).map((statusType) => (
                  <option key={statusType} value={statusType}>
                    {statusType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                Modifier
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EditOrder;
