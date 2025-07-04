'use client'
import { useState, useMemo } from 'react';
import { useCart } from '../context/CartManagement';
import { useAuth } from '../context/LoginManagement';
import { useNotifier } from '../context/NotifierManagent';
import { redirect } from "next/navigation";
import CartItem from './CartItems'
import ConfirmModal from './ConfirmModal';
import styles from '../css/cart.module.css';

export default function Cart() {
  const { user } = useAuth()
  const { removeFromCart, cart, loading, updateCartItemQuantity, clearCart  } = useCart();
  const { notify } = useNotifier()
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcular totales usando useMemo para mejor rendimiento
  const { total, totalItems } = useMemo(() => {
    return cart.reduce((acc, item) => ({
      total: acc.total + (item.price * item.quantity),
      totalItems: acc.totalItems + item.quantity
    }), { total: 0, totalItems: 0 });
  }, [cart]);

  // Ejemplo 1: Log simple
  console.log('Cart state:', { cart, total, totalItems, isModalOpen });

  const handleConfirm = () => {
    // Ejemplo 2: Log dentro de una función
    console.log('User trying to confirm:', user.email);
    if(user.email){
      setIsModalOpen(true);
    } else{
      notify("Tenes que estar conectado a una cuenta para poder realizar la compra!", "error")
      notify("Te enviaremos al portal de inicio de sesión. Tranquilo, no perderás tu carrito!", "info")
      redirect("/login")
    }
  };

  const handleModalConfirm = () => {
    // Ejemplo 3: Log antes y después de una acción
    console.log('Before clearing cart:', cart.length);
    clearCart();
    console.log('After clearing cart:', cart.length);
    setIsModalOpen(false);
    notify("¡Compra realizada con éxito!", "success");
  };

  const handleQuantityChange = (id, newQuantity) => {
    // Ejemplo 4: Log con múltiples valores
    console.log('Quantity change:', { id, oldQuantity: cart.find(item => item.id === id)?.quantity, newQuantity });
    if (newQuantity > 0) {
      updateCartItemQuantity(id, newQuantity);
    }
  };

  return (
    <div>
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        total={total}
      />
      {cart && cart.length > 0 ?(
        <div>
          <h1>Bienvenido{user && user.email ? `, ${user.email}`:""}!</h1>
          <p>Tenes {totalItems} productos en tu carrito</p>
          <div className={styles.cartLayout}>
            <div className={styles.cartItems}>
              <ul>
                {cart.map((item, idx) => {
                  return (
                    <CartItem 
                      key={idx}
                      id={item.id}
                      title={item.title}
                      image={item.image}
                      price={item.price * item.quantity}
                      quantity={item.quantity}
                      onRemove={removeFromCart}
                      onQuantityChange={handleQuantityChange}
                    />
                  )
                })}
              </ul>
              </div>
            <div className={styles.cartSummary}>
              <p>Agregaste {totalItems} productos</p>
              <p className={styles.totalPrice}>Total: ${total.toFixed(2)}</p>
              <button className={styles.confirmButton} onClick={handleConfirm}>
                Confirmar compra
              </button>
            </div>
          </div>
        </div>
      ): (
        <div>
          <h1>
            No agregaste ningún producto al carrito
          </h1>
        </div>
      )}
    </div>
  );
}
