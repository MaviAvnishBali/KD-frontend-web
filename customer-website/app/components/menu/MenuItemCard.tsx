"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Minus, Star, Clock, Flame } from "lucide-react";
import { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem } from "../../lib/api/hooks";
import { cn } from "../../lib/utils";
import type { MenuItem } from "../../types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  variant?: "grid" | "list";
}

const FoodTypeDot = ({ type }: { type: string }) => {
  const isVeg = type === "VEG" || type === "VEGAN" || type === "JAIN";
  return (
    <div className={cn(
      "w-5 h-5 border-2 rounded-sm flex items-center justify-center flex-shrink-0",
      isVeg ? "border-green-600" : "border-red-600"
    )}>
      <div className={cn(
        "w-2.5 h-2.5 rounded-full",
        isVeg ? "bg-green-600" : "bg-red-600"
      )} />
    </div>
  );
};

export function MenuItemCard({ item, variant = "grid" }: MenuItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const { data: cart } = useCart();
  const addToCart      = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const quantity = cart?.items.find((ci) => ci.menuItemId === item.id)?.quantity ?? 0;

  const handleAdd = () => addToCart.mutate({ menuItemId: item.id });
  const handleRemove = () => {
    if (quantity > 1) updateCartItem.mutate({ itemId: item.id, qty: quantity - 1 });
    else removeCartItem.mutate(item.id);
  };

  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
  const effectivePrice = hasDiscount ? item.discountPrice! : item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
    : 0;

  if (variant === "list") {
    return (
      <motion.div
        layout
        className="card-royal p-4 flex gap-4"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={imageError ? "/images/food-placeholder.jpg" : (item.images?.[0]?.url || "/images/food-placeholder.jpg")}
            alt={item.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
          {item.isBestSeller && (
            <div className="absolute top-1 left-1 bg-brand-gold-500 text-royal-dark text-xs font-bold px-1.5 py-0.5 rounded">
              Best
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <FoodTypeDot type={item.foodType} />
            <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
          <div className="flex items-center gap-2">
            {item.rating && (
              <span className="flex items-center gap-0.5 text-xs text-brand-gold-600">
                <Star className="w-3 h-3 fill-brand-gold-500" />
                {item.rating}
              </span>
            )}
            {item.preparationTime && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {item.preparationTime}m
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="font-bold text-royal-maroon">₹{effectivePrice}</p>
            {hasDiscount && (
              <p className="text-xs text-muted-foreground line-through">₹{item.price}</p>
            )}
          </div>
          <AddToCartButton
            quantity={quantity}
            onAdd={handleAdd}
            onRemove={handleRemove}
            disabled={!item.isAvailable}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="card-royal group overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={imageError ? "/images/food-placeholder.jpg" : (item.images?.[0]?.url || "/images/food-placeholder.jpg")}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.isBestSeller && (
            <span className="bg-brand-gold-500 text-royal-dark text-xs font-bold px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
          {item.isRecommended && !item.isBestSeller && (
            <span className="bg-royal-maroon text-royal-cream text-xs font-bold px-2 py-1 rounded-full">
              Chef's Pick
            </span>
          )}
          {hasDiscount && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-1">
          <FoodTypeDot type={item.foodType} />
          <h3 className="font-semibold leading-tight line-clamp-1">{item.name}</h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
          {item.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          {item.rating && (
            <span className="flex items-center gap-1 text-brand-gold-600 font-medium">
              <Star className="w-3.5 h-3.5 fill-brand-gold-500" />
              {item.rating} ({item.totalReviews})
            </span>
          )}
          {item.preparationTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {item.preparationTime} min
            </span>
          )}
          {item.calories && (
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {item.calories} cal
            </span>
          )}
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg text-royal-maroon">
              ₹{effectivePrice}
            </span>
            {hasDiscount && (
              <span className="ml-1.5 text-sm text-muted-foreground line-through">
                ₹{item.price}
              </span>
            )}
          </div>

          <AddToCartButton
            quantity={quantity}
            onAdd={handleAdd}
            onRemove={handleRemove}
            disabled={!item.isAvailable}
          />
        </div>
      </div>
    </motion.div>
  );
}

function AddToCartButton({
  quantity,
  onAdd,
  onRemove,
  disabled,
}: {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <button disabled className="btn-outline-royal py-1.5 px-3 text-sm opacity-50 cursor-not-allowed">
        Sold Out
      </button>
    );
  }

  if (quantity === 0) {
    return (
      <button onClick={onAdd} className="btn-royal py-1.5 px-4 text-sm">
        <Plus className="w-4 h-4" />
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-royal-maroon rounded-full px-1 py-1">
      <button
        onClick={onRemove}
        className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-white font-bold w-5 text-center text-sm">{quantity}</span>
      <button
        onClick={onAdd}
        className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
