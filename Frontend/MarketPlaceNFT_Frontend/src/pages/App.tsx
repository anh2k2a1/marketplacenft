// src/App.tsx
import type { FC } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import { AutoConnectProvider } from '../contexts/AutoConnectProvider';
import { NetworkConfigurationProvider } from '../contexts/NetworkConfigurationProvider';
import ConnectProvider from "../contexts/ConnectProvider";
import { AppBar } from "../components/header/AppBar";
import { Footer } from "../components/footer/Footer";
import NotificationList from "../components/notification/Notification";
import AppRouter from "../router";

import "../styles/globals.css";

const AppLayout: FC = () => {
  const location = useLocation();

  // Những route KHÔNG dùng navbar/footer
  const noLayoutRoutes = ["/login"];
  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <NotificationList />
      {!hideLayout && <AppBar />}
      <main className={hideLayout ? "" : "container mx-auto p-6"}>
        <AppRouter />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AutoConnectProvider>
        <NetworkConfigurationProvider>
          {/* Nếu có ConnectProvider thì bọc thêm, còn không cần thì bỏ */}
          {/* <ConnectProvider> */}
          <AppLayout />
          <Toaster position="top-center" reverseOrder={false} />
          {/* </ConnectProvider> */}
        </NetworkConfigurationProvider>
      </AutoConnectProvider>

      <script src="assets/libs/preline/preline.js"></script>
      <script src="assets/libs/swiper/swiper-bundle.min.js"></script>
      <script src="assets/libs/gumshoejs/gumshoe.polyfills.min.js"></script>
      <script src="assets/libs/lucide/lucide.min.js"></script>
      <script src="assets/libs/aos/aos.js"></script>
      <script src="assets/js/swiper.js"></script>
      <script src="assets/js/theme.js"></script>
    </BrowserRouter>
  );
}
