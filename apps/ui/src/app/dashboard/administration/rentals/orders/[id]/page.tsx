"use client";
import { type OrderDto } from "@rent-to-craft/dtos";
import React, { use, useEffect, useState } from "react";

import OrderService from "@/app/services/order.service";

type AdminOrderPageProps = {
  readonly params: Promise<{
    id: string;
  }>;
};

const AdminOrderPage = ({ params }: AdminOrderPageProps) => {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDto | null>(null);

  const getOrder = async () => {
    const response = await OrderService.getOrderById(Number(id));
    setOrder(response);
  };

  useEffect(() => {
    void getOrder();
  }, [id]);

  return (
    <div>
      <h1>Commande #{order?.id}</h1>

      <div>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Propriétaire</th>
              <th>Contact</th>
              <th>Ville</th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems?.map((item) => (
              <tr key={item.id}>
                <td>{item.rental.name}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.rental.user?.firstName} {item.rental.user?.lastName}
                </td>
                <td>
                  {item.rental.user?.contactEmail ?? item.rental.user?.email}
                </td>
                <td>{item.rental.user?.city?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {order?.createdAt &&
                  new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td>{order?.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderPage;
