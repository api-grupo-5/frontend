import styles from '../css/cartItems.module.css';

export default function CartItem({ id, title, image, price, quantity, onRemove, onQuantityChange }) {
  const handleDecrement = () => {
    onQuantityChange(id, quantity - 1);
  };

  const handleIncrement = () => {
    onQuantityChange(id, quantity + 1);
  };
  
  return (
    <li className={styles.cartItem}>
      <img src={image} alt={title} />
      <div className={styles.cartItemDetails}>
        <span className={styles.cartItemTitle}>{title}</span>
        <span className={styles.cartItemPrice}>${price.toFixed(2)}</span>
      </div>
      <div className={styles.quantityControls}>
        <button 
          className={styles.quantityButton} 
          onClick={handleDecrement} 
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className={styles.cartItemQuantity}>Unidades: {quantity}</span>
        <button 
          className={styles.quantityButton} 
          onClick={handleIncrement}
        >
          +
        </button>
      </div>

      <button className={styles.removeButton} onClick={() => onRemove(id)}>
        ❌
      </button>
    </li>
  );
}
