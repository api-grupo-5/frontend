import Link from 'next/link'
import Image from 'next/image';
import styles from '../css/navbar.module.css'
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Nombre */}
        <Link href="/" className={styles.logo}>
            <Image
            src="/images/logo.png" // Asegurate que este archivo esté en /public
            alt="TecnoExpress logo"
            width={350}
            height={50}
            />
        </Link>

        {/* Buscador */}
        <div className={styles.searchBox}>
          <input type="text" placeholder="Buscar productos..." />
          <FaSearch className={styles.searchIcon} />
        </div>

        {/* Íconos */}
        <div className={styles.icons}>
          <FaUser />
          <FaShoppingCart />
        </div>
      </div>
    </nav>
  )
}
