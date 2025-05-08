import styles from "../css/carousel.module.css";

export default function Product({ title, image, price, onHoverStart, onHoverEnd, onAddToCart }) {
    return (
        <div
            className={styles.product_card}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
        >
            <img src={image} alt={title} className={styles.product_image} />
            <h3 className={styles.product_title}>{title}</h3>
            <p className={styles.product_price}>${price}</p>
            <button className={styles.add_to_cart_btn} onClick={onAddToCart}>
                Agregar al carrito
            </button>
        </div>
    );
}
