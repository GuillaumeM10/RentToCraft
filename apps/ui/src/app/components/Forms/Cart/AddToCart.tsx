"use client";
import type React from "react";

import { type RentalDto } from "@rent-to-craft/dtos";
import { useState } from "react";

import { useAuth } from "@/app/contexts/auth.context";
import { useCart } from "@/app/contexts/cart.context";

interface AddToCartProps {
  readonly rental: RentalDto;
}

const AddToCart = ({ rental }: AddToCartProps) => {
  const { isAuthenticated, user } = useAuth();
  const { addItem, cart, updateItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!isAuthenticated || !cart || rental.user.id === user?.id) {
    return;
  }

  const isInCart = cart?.cartItems?.find(
    (item) => item.rental.id === rental.id,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await (isInCart
      ? updateItem({ id: isInCart.id, quantity })
      : addItem({ rental, quantity, cart }));
    setQuantity(1);
  };

  return (
    <div className="my-20 mx-auto max-w-xl">
      <form
        onSubmit={handleSubmit}
        role="form"
        aria-label="Formulaire d'ajout au panier"
      >
        <div className="form-group">
          <label htmlFor="quantity">Quantité</label>
          <input
            type="number"
            value={quantity}
            min={1}
            id="quantity"
            max={
              rental.quantity -
              (cart?.cartItems?.find((item) => item.rental.id === rental.id)
                ?.quantity ?? 0)
            }
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="tac"
            required
            aria-required="true"
            aria-invalid={quantity < 1 ? "true" : "false"}
            aria-describedby={
              quantity < 1 ? "addtocart-quantity-error" : undefined
            }
          />
          {quantity < 1 && (
            <div className="error-message" id="addtocart-quantity-error">
              La quantité doit être supérieure ou égale à 1
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Ajouter au panier
        </button>
      </form>
    </div>
  );
};

export default AddToCart;
