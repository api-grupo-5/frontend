import styles from "../css/carousel.module.css";
import { useAuth } from "../context/LoginManagement";

export default function Product({ title, image, price, seller, onHoverStart, onHoverEnd, onAddToCart, onClick }) {
    const { user } = useAuth()

    return (
        <div
            className={styles.product_card}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
        >
            <div onClick={onClick}>
                <img src={image} alt={title} className={styles.product_image} />
                <h3 className={styles.product_title}>{title}</h3>
                <p className={styles.product_price}>${price}</p>
            </div>

            {user && seller == user.email ? (
                <div className={styles.botonesAdmin}>
                    <button className={styles.btnEditar}>Editar</button>
                    <button className={styles.btnEliminar}>Eliminar</button>
                </div>
                ) : 
                <button className={styles.add_to_cart_btn} onClick={onAddToCart}>
                    Agregar al carrito
                </button>
            }
        </div>
    );
}
