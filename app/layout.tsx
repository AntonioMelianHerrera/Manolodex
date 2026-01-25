import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CaughtPokemonMargins from "@/components/layout/CaughtPokemonMargins";
import { CaughtPokemonProvider } from "@/lib/CaughtPokemonContext";

export const metadata = {
  title: "Pokédex",
  description: "Pokédex creada con Next.js y PokéAPI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-slate-950 text-white">
        <CaughtPokemonProvider>
          <Header />
          <ScrollToTop />
          <CaughtPokemonMargins />
          <main className="flex-1">{children}</main>
          <Footer />
        </CaughtPokemonProvider>
      </body>
    </html>
  );
}