'use client';

import styles from "../css/carousel.module.css";
import Product from "./Product";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCart } from '../context/CartContent';

export default function Carousel() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const scrollRef = useRef(null);
    const timeoutRef = useRef(null);
    const CARD_WIDTH = process.env.CARD_WIDTH;
    const apiUrl = process.env.NEXT_PUBLIC_FAKE_STORE_API;

    useEffect(() => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setProducts(data)
            })
            .catch(error => console.error("Error al cargar productos:", error));
    }, []);
    const loopedProducts = [...products, ...products];

    const pauseAutoScroll = () => clearTimeout(timeoutRef.current);
    const resumeAutoScroll = () => {
        clearTimeout(timeoutRef.current);
        startAutoScroll();
    };

    const startAutoScroll = () => {
        timeoutRef.current = setTimeout(() => {
            const el = scrollRef.current;
            if (!el) return;

            el.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });

            if (el.scrollLeft >= (products.length * CARD_WIDTH)) {
                setTimeout(() => {
                    el.scrollTo({ left: 0, behavior: 'auto' });
                }, 300);
            }

            startAutoScroll();
        }, 3000);
    };

    useEffect(() => {
        if (products.length === 0) return;

        startAutoScroll();

        const el = scrollRef.current;

        const handleScroll = () => {
            clearTimeout(timeoutRef.current);

            if (el && el.scrollLeft >= (products.length * CARD_WIDTH)) {
                el.scrollTo({ left: 0, behavior: 'auto' });
            }

            startAutoScroll();
        };

        el?.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timeoutRef.current);
            el?.removeEventListener("scroll", handleScroll);
        };
    }, [products]);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" });
    };

    const scrollRight = () => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });

        if (el.scrollLeft >= (products.length * CARD_WIDTH)) {
            setTimeout(() => {
                el.scrollTo({ left: 0, behavior: 'auto' });
            }, 300);
        }
    };

    return (
        <div className={styles.catalog_wrapper}>
            <h1 className={styles.catalog_titles}>¡Explora todo lo que tenemos para ofrecerte!</h1>

            <button className={styles.nav_arrow_left} onClick={scrollLeft}>
                <FaChevronLeft />
            </button>
            <button className={styles.nav_arrow_right} onClick={scrollRight}>
                <FaChevronRight />
            </button>

            <div className={styles.catalog_main} ref={scrollRef}>
                {loopedProducts.map((product, index) => (
                    <Product
                        key={`${product.id}-${index}`}
                        title={product.title}
                        image={product.image}
                        price={product.price}
                        onHoverStart={pauseAutoScroll}
                        onHoverEnd={resumeAutoScroll}
                        onAddToCart={() => addToCart(product)}
                    />
                ))}
            </div>
        </div>
    );
}
