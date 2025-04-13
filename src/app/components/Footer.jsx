import styles from '../css/footer.module.css';;

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_section}>
          <h4>Sobre nosotros</h4>
          <p>Con más de 1 semana de historia, en TecnoExpress ofrecemos productos tecnológicos de alta calidad a precios competitivos, con atención personalizada y envíos fugaces.</p>
        </div>
        <div className={styles.footer_section}>
          <h4>Enlaces útiles</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="/categoria/computacion">Computación</a></li>
            <li><a href="/categoria/electrodomesticos">Electrodomésticos</a></li>
            <li><a href="/categoria/perifericos">Periféricos</a></li>
          </ul>
        </div>
        <div className={styles.footer_section}>
          <h4>Contacto</h4>
          <p>Email: soporte@tecnoexpress.com</p>
          <p>Teléfono 24/7: +54 9 11 1234 5678</p>
        </div>
      </div>
      <div className={styles.footer_bottom}>
        <p>&copy; {new Date().getFullYear()} TecnoExpress. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
