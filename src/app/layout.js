import Navbar from "./components/navbar";
import styles from "./css/main.module.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TecnoExpress</title>
      </head>
      <body className={styles.main}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
