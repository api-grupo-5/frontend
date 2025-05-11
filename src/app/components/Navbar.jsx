'use client'
import Link from 'next/link'
import Image from 'next/image';
import styles from '../css/navbar.module.css'
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa'
import { redirect } from "next/navigation";
import { products } from '../data/products';
import { useState, useEffect } from 'react';


export default function Navbar() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const allProducts = Object.values(products).flatMap(cat => Object.values(cat));

  useEffect(() => {
    if (search.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );

    setResults(filtered);
  }, [search]);


  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/logo.png"
              alt="TecnoExpress logo"
              width={350}
              height={50}
            />
          </Link>
        </div>

        {/* Buscador */}
        <div className={styles.center}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className={styles.searchIcon} />
          </div>

          {results.length > 0 && (
            <ul className={styles.searchResults}>
              {results.map(product => (
                <li key={product.id}>
                  <Link href={`../producto/${product.id}`}>
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Iconos */}
        <div className={styles.right}>
          <div className={styles.icons}>
            <div onClick={() => redirect("/login")}>
              <FaUser />
            </div>
            
            <div onClick={() => redirect("/cart")}>
              <FaShoppingCart />
            </div>
          </div>
        </div>
      </div>

      {/* Menú de categorías */}
      <div className={styles.categoryWrapper}>
        <div className={styles.categoryMenu}>
          <ul>
            <li><Link href="/categoria/computacion">Computación</Link></li>
            <li><Link href="/categoria/electrodomesticos">Electrodomésticos</Link></li>
            <li><Link href="/categoria/perifericos">Periféricos</Link></li>
            <li><Link href="/emular-venta">Vender</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
