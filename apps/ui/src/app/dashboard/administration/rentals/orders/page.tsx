"use client";

import { type OrderDto } from "@rent-to-craft/dtos";
import Link from "next/link";
import { useEffect, useState } from "react";

import EditOrder from "@/app/components/Forms/Order/EditOrder";
import OffCanvas from "@/app/components/OffCanvas";
import OrderService from "@/app/services/order.service";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);

  const getOrders = async () => {
    const response = await OrderService.getOrders();
    setOrders(response);
  };

  const deleteOrder = async (id: number) => {
    await OrderService.deleteOrder(id);
    void getOrders();
  };

  useEffect(() => {
    void getOrders();
  }, []);

  return (
    <div>
      <h1>Commandes</h1>

      <div>
        {orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Utilisateur</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>{order.status}</td>
                  <td>{order.user.id ?? "Utilisateur supprimé"}</td>
                  <td>{order.total ?? 0} €</td>
                  <td>
                    <Link
                      href={`/dashboard/administration/rentals/orders/${order.id}`}
                      className="btn btn-underline-primary btn-small mr-16"
                    >
                      Voir
                    </Link>
                    <OffCanvas
                      buttonContent="Modifier"
                      buttonClassName="btn btn-underline-primary btn-small"
                    >
                      <EditOrder
                        order={order}
                        onSuccess={() => {
                          void getOrders();
                        }}
                      />
                    </OffCanvas>
                    <button
                      className="btn btn-underline-red btn-small"
                      onClick={() => {
                        if (order.id) {
                          void deleteOrder(order.id);
                        }
                      }}
                    >
                      Supprimer
                    </button>
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

export default AdminOrdersPage;
