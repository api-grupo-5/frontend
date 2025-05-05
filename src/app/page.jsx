import Carousel from "./components/Carousel";
import Footer from "./components/Footer";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}