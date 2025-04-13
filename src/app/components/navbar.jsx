import Link from 'next/link'
import Image from 'next/image';
import styles from '../css/navbar.module.css'
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa'

export default function Navbar() {
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
            <input type="text" placeholder="Buscar productos..." />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        {/* Iconos */}
        <div className={styles.right}>
          <div className={styles.icons}>
            <FaUser />
            <FaShoppingCart />
          </div>
        </div>
      </div>

      {/* Menú de categorías */}
      <div className={styles.categoryWrapper}>
        <div className={styles.categoryMenu}>
          <ul>
            <li><Link href="/categoria/computacion">Computación</Link></li>
            <li><Link href="/categoria/televisores">Electrodomésticos</Link></li>
            <li><Link href="/categoria/perifericos">Periféricos</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}