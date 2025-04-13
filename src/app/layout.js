import Navbar from "./components/Navbar";
import styles from "./css/main.module.css";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400', // Puedes agregar más si necesitas
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en"> 
      <head>
        <title>TecnoExpress</title>
      </head>
      <body className={`${styles.main} ${roboto.className}`}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
