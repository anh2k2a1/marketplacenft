// src/router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeView } from './views/home';
import { ToolView } from './views/tool';
import { FeatureView } from './views/feature';
import { OfferView } from './views/offer';
import { FaqView } from './views/faq';
import { ContactView } from './views/contact';
import Home from './pages/home';
import ProductIndex from "./pages/product/index";
import NFTDetail from "./pages/product/nftDetail";
import MintNFTPage from './pages/mint';
import CategoryPage from './pages/category';
import LoginPage from './pages/login';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import type { FC } from 'react';
import { useState } from 'react';

const AppRouter: FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTokenMetadata, setOpenTokenMetadata] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [openAirdrop, setOpenAirdrop] = useState(false);
  const [openSendTransaction, setOpenSendTransaction] = useState(false);

  return (
    // <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <>
            <HomeView setOpenCreateModal={setOpenCreateModal} />
            <ToolView
              setOpenAirdrop={setOpenAirdrop}
              setOpenContact={setOpenContact}
              setOpenCreateModal={setOpenCreateModal}
              setOpenSendTransaction={setOpenSendTransaction}
              setOpenTokenMetaData={setOpenTokenMetadata}
            />
            <FeatureView
              setOpenAirdrop={setOpenAirdrop}
              setOpenCreateModal={setOpenCreateModal}
              setOpenSendTransaction={setOpenSendTransaction}
              setOpenTokenMetaData={setOpenTokenMetadata}
            />
            <OfferView />
            <FaqView />

            {/* MODAL DYNAMIC */}
            {openContact && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-6">
                  <ContactView setOpenContact={setOpenContact} />
                </div>
              </div>
            )}
            {openAirdrop && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-6">
                  <div>Airdrop Modal Here</div>
                </div>
              </div>
            )}
          </>
        }
      />
      <Route path='/home' element={<Home />} />
      <Route path="/product" element={<ProductIndex />} />
      <Route path="/product/:id" element={<NFTDetail />} />
      <Route path='/mint' element={<MintNFTPage />} />
      <Route path='/category' element={<CategoryPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/oauth2/redirect' element={<OAuth2RedirectHandler />} />
    </Routes>
    // </BrowserRouter>
  );
};

export default AppRouter;