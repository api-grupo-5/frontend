'use client'
import { useCart } from '../context/CartManagement';
import CartItem from './CartItems'
import styles from '../css/cart.module.css';


export default function Cart() {
  const email = "usuario@ejemplo.com"
  const { removeFromCart, cart, loading } = useCart();
  if (loading) return <p>Cargando carrito...</p>;

  let total = 0;
  const handleConfirm = () => {
    alert(`¿Confirmas pago de: $${total.toFixed(2)}?`);
    // Aquí podrías también redirigir o vaciar el carrito
  };

  return (
    <div>
    {cart && cart.length > 0 ?(
      <div>
      <h1>Bienvenido{email? `, ${email}`:""}</h1>
      <p>Tenes {cart.length} productos en tu carrito</p>
      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          <ul>
            {cart.map((item, idx) => {
              total += item.price
              
              return (
                <CartItem 
                  key={idx}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  onRemove={removeFromCart}
                />
              )
            })}
          </ul>
          </div>
        <div className={styles.cartSummary}>
          <p>Agregaste {cart.length} productos</p>
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
