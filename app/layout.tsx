import type { Metadata } from "next";
import "./globals.css";
import { archivo, spline } from "./fonts";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import LibraryProvider from "@/components/Provider";
import { I18nProvider } from "@/components/I18nProvider";
import Guide from "@/components/Guide";

export const metadata: Metadata = {
  title: "Hanko",
  description:
    "Hanko — tu catálogo personal de anime: sellos, puntos y progreso en un pasaporte de fan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} ${spline.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("hanko.theme");if(!l){var o=localStorage.getItem("animepuntos.theme");if(o){l=o;localStorage.setItem("hanko.theme",o);localStorage.removeItem("animepuntos.theme");}}if(l==="dark"){document.documentElement.dataset.theme="dark";}}catch(e){}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("hanko.locale");if(!l){var n=(navigator.language||"es").toLowerCase();l=n.indexOf("ja")===0?"ja":n.indexOf("en")===0?"en":"es";}document.documentElement.lang=l;document.documentElement.dataset.locale=l;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <I18nProvider>
          <Masthead />
          <LibraryProvider>{children}</LibraryProvider>
          <Footer />
          <Guide />
        </I18nProvider>
      </body>
    </html>
  );
}