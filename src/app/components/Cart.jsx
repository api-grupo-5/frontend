'use client'
import { useCart } from '../context/CartManagement';
import CartItem from './CartItems'
import styles from '../css/cart.module.css';

export default function Cart() {
  const email = "usuario@ejemplo.com"
  const { removeFromCart, cart, loading, updateCartItemQuantity, clearCart  } = useCart();
  if (loading) return <p>Cargando carrito...</p>;

  let total = 0;
  let totalItems = 0;

  const handleConfirm = () => {
    const confirmed = confirm(`¿Confirmas pago de: $${total.toFixed(2)}?`);
    if (confirmed) {
      clearCart()
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(id, newQuantity);
    }
  };

  return (
    <div>
    {cart && cart.length > 0 ?(
      <div>
      <h1>Bienvenido{email? `, ${email}`:""}</h1>
      <p>Tenes {cart.reduce((acc, item) => acc + item.quantity, 0)} productos en tu carrito</p>
      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          <ul>
            {cart.map((item, idx) => {
              total += item.price * item.quantity
              totalItems += item.quantity
              
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
