"use client";
import { type OrderDto } from "@rent-to-craft/dtos";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import OrderService from "@/app/services/order.service";

const RentalsDashboard = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);

  const getOrders = async () => {
    const response = await OrderService.getMyOrders();
    setOrders(response);
  };

  useEffect(() => {
    void getOrders();
  }, []);

  return (
    <div>
      <h1>Mes commandes</h1>

      <div>
        {orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>{order.status}</td>
                  <td>
                    <Link
                      href={`/dashboard/rentals/${order.id}`}
                      className="btn btn-underline-primary btn-small"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune commande trouvée</p>
        )}
      </div>
    </div>
  );
};

export default RentalsDashboard;
