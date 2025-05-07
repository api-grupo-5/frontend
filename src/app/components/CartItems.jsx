import styles from '../css/cartItems.module.css';

export default function CartItem({ id, title, image, price, onRemove }) {
  return (
    <li className={styles.cartItem}>
      <img src={image} alt={title} />
      <div className={styles.cartItemDetails}>
        <span className={styles.cartItemTitle}>{title}</span>
        <span className={styles.cartItemPrice}>${price}</span>
      </div>
      <button className={styles.removeButton} onClick={() => onRemove(id)}>
        ❌
      </button>
    </li>
  );
}
