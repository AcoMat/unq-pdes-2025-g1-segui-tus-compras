import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { postNewPurchase } from "../services/ApiService";
import { getToken } from "../services/TokenService";

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const localCart = localStorage.getItem('shoppingCart');
            return localCart ? JSON.parse(localCart) : [];
        } catch (error) {
            console.error("Error al cargar el carrito desde localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
        }
    }, [cart]);

    const addToCart = useCallback((product, amountToAdd = 1) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (item) => item.product.id === product.id
            );
            if (existingItemIndex !== -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].amount += amountToAdd;
                return updatedCart;
            }
            return [...prevCart, { product, "amount": amountToAdd }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        console.log("Removing product with ID:", productId);
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    }, []);

    const updateAmount = useCallback((productId, newAmount) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product.id === productId ? { ...item, "amount": newAmount } : item
            )
        );
    }, []);

    const purchaseCart = useCallback(async () => {
        const token = await getToken();
        if (!token) {
            console.error("No token found. User is not authenticated.");
            throw new Error("User is not authenticated.");
        }
        await postNewPurchase(token, cart.map(item => ({
            productId: item.product.id,
            amount: item.amount
        })));
        setCart([]);
    }, [cart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateAmount,
        clearCart,
        purchaseCart
    }), [cart, addToCart, removeFromCart, updateAmount, clearCart, purchaseCart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);