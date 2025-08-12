'use client';

import styles from "../css/carousel.module.css";
import Product from "./Product";
import { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCart } from '../context/CartManagement';
import { GET } from '../api/products/route'
import { useNotifier } from '../context/NotifierManagent';

export default function Carousel() {
    const { addToCart } = useCart();
    const { request_id } = useNotifier()
    const [loopedProducts, setLoopedProducts] = useState([]);
    const scrollRef = useRef(null);
    const timeoutRef = useRef(null);
    const CARD_WIDTH = parseInt(process.env.NEXT_PUBLIC_CARD_WIDTH);

    const pauseAutoScroll = () => clearTimeout(timeoutRef.current);

    const startAutoScroll = () => {
        timeoutRef.current = setTimeout(() => {
            scrollRight()
            startAutoScroll();
        }, 3000);
    };
    useEffect(() => {
        async function fetchProducts() {
            const response = await GET(request_id);
            const data = await response.json();
            const products = data.data;
            setLoopedProducts([...products, ...products]);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (loopedProducts.length === 0) return;

        const el = scrollRef.current;
        if (el) {
            el.scrollLeft = el.scrollWidth / 2;
        }
        
        startAutoScroll();
        return () => {
            pauseAutoScroll();
        };
    }, [loopedProducts]);

    const scrollLeft = () => {
        const el = scrollRef.current;
        if (!el) return;
        
        el.current?.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
    };

    const scrollRight = () => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });

        const mid = (el.scrollWidth / 2)
        if (el.scrollLeft >= mid) { // Si paso la mitad de los productos
            setTimeout(() => {
                el.scrollTo({ left: el.scrollLeft - mid, behavior: 'auto' });
            }, 300);
        }
    };

    const handleRedirigir = (producto) => {
        const url = `/producto/${producto.id}`;
        window.open(url, '_blank'); 
    };

    return (
        <div className={styles.catalog_wrapper}>
            <h1 className={styles.catalog_titles}>¡Explora todo lo que tenemos para ofrecerte!</h1>
            
            <div onMouseEnter={pauseAutoScroll} onMouseLeave={startAutoScroll}>
                <button className={styles.nav_arrow_left} onClick={scrollLeft}>
                    <FaChevronLeft />
                </button>
                <button className={styles.nav_arrow_right} onClick={scrollRight}>
                    <FaChevronRight />
                </button>
            </div>
            

            <div className={styles.catalog_main} ref={scrollRef}>
                {loopedProducts.map((product, index) => (
                    <Product
                        key={`${product.id}-${index}`}
                        title={product.name}
                        image={product.image}
                        price={product.price}
                        seller={product.seller}
                        onHoverStart={pauseAutoScroll}
                        onHoverEnd={startAutoScroll}
                        onAddToCart={() => addToCart(product)}
                        onClick={() => handleRedirigir(product)}
                    />
                ))}
            </div>
        </div>
    );
}
