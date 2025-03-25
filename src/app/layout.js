"use client";
import localFont from "next/font/local";
import "bootstrap/dist/css/bootstrap.css"
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import StoreProvider from "@/providers/StoreProvider";
import { DarkSpacesTheme } from "@/theme/theme";
import Loader from "@/components/atoms/Loader";
import GlobalSnackbar from "@/components/atoms/GlobalSnackbar";
import PermissionsMonitor from "@/components/atoms/PermissionsMonitor";
import SocketManager from "@/lib/socket/SocketManager";
import PreventBackNavigation from "@/components/atoms/PreventBackNavigation";
import NavigationWarning from "./(user)/v1/(quiz)/test-window/navigation-warning/page";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"], // You can specify subsets like 'latin', 'cyrillic', etc.
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify weights if needed (optional)
  display: "swap", // Use "swap" for better rendering (optional)
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "Zeus",
//   description: "Zestful Empowering Utilization System",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-primary-300 !overflow-auto`}
      >
        <ThemeProvider theme={DarkSpacesTheme}>
          <StoreProvider>
            {children}
            <Loader />
            <GlobalSnackbar />
            <PermissionsMonitor />
            <SocketManager />
            <PreventBackNavigation />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
