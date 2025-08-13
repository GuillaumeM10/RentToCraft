import { type CartItemDto, type FileDto } from "@rent-to-craft/dtos";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React, { memo } from "react";

import { useCart } from "../contexts/cart.context";
import OrderService from "../services/order.service";
import Img from "./Img";
import { LoadingSpinner } from "./LoadingSpinner";

interface CartProps {
  readonly className?: string;
}

const Cart = memo(({ className }: CartProps) => {
  const { cart, isLoading, removeItem, updateItem, clearCart, setCart } =
    useCart();

  const handleRemoveItem = async (item: CartItemDto) => {
    await removeItem(item);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleCreateOrder = async () => {
    if (!cart) return;
    try {
      await OrderService.createOrder({
        orderItems: cart.cartItems?.map((item) => ({
          ...item,
        })),
      });
      setCart(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateItem = async (item: CartItemDto) => {
    await updateItem({ id: item.id, quantity: item.quantity });
  };

  return (
    <div className={className}>
      <h1 className="mb-40 text-center text-2xl font-bold">Panier</h1>

      {cart?.cartItems?.length && cart.cartItems.length > 0 ? (
        <>
          <div>
            <table
              style={{ maxWidth: "800px", overflowX: "auto" }}
              className="mx-auto"
            >
              <thead>
                <tr>
                  <th></th>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Propriétaire</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart?.cartItems?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Img image={item.rental.images?.[0] as FileDto} />
                    </td>
                    <td>
                      <Link href={`/rental/${item.rental.slug}`}>
                        {item.rental.name}
                      </Link>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min={0}
                        max={item.rental.quantity}
                        onChange={async (event) =>
                          handleUpdateItem({
                            ...item,
                            quantity: Number(event.target.value),
                          })
                        }
                        className="w-100"
                      />
                    </td>
                    <td className="">
                      {item.rental.user?.firstName}{" "}
                      <span className="uppercase whitespace-nowrap">
                        {item.rental.user?.lastName}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-underline-red"
                        onClick={() => handleRemoveItem(item)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center">
            <button className="btn btn-danger" onClick={handleClearCart}>
              Vider le panier
            </button>
            <button className="btn btn-primary" onClick={handleCreateOrder}>
              Commander
            </button>
            <Link
              className="btn btn-underline-primary btn-small"
              style={{
                gap: "12px",
              }}
              href="/cart"
            >
              Voir le panier <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-12">
          <p className="tac">Votre panier est vide</p>
          <Link className="btn btn-primary text-white text-lg" href="/rental">
            Voir les objets
          </Link>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
    </div>
  );
});

Cart.displayName = "Cart";

export default Cart;
