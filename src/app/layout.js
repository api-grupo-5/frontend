import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./css/main.module.css";
import { Roboto } from 'next/font/google';
import { CartProvider } from './context/CartManagement';
import { AuthProvider } from './context/LoginManagement';
import { NotifierProvider } from './context/NotifierManagent';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TecnoExpress</title>
      </head>
      <body className={`${styles.main} ${roboto.className}`}>
        <Navbar />
        <NotifierProvider>
          <CartProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </CartProvider>
        </NotifierProvider>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
