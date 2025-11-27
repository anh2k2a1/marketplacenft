import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import {
  FaqView, FeatureView, HomeView,
  OfferView,
  ToolView,
  // OfferView,
  // FaqView,
  // AirdropView,
  // DonateView,
  //CreateView,
  //TokenMetadata,
  ContactView,
  //DonateView,
  // InputView,
  // TokenMetadata,
  // ContactView
} from "../../views"
import { useState } from 'react'
import { Divide } from 'lucide-react'
//import { AirdropView } from 'views/airdrop'
const Home: NextPage = (props) => {

  const [openCreateModel, setOpenCreateModal] = useState(false)
  const [openTokenMetadata, setOpenTokenMetadata] = React.useState(false)
  const [openContact, setOpenContact] = React.useState(false)
  const [openAirdrop, setOpenAirdrop] = React.useState(false)
  const [openSendTransaction, setOpenSendTransaction] = React.useState(false)


  return (
    <>
      <Head>
        <title>Solana Token Creator</title>
        <meta name='Build and create solana token' />
      </Head>
      <HomeView setOpenCreateModal={setOpenCreateModal} />
      <ToolView setOpenAirdrop={setOpenAirdrop}
        setOpenContact={setOpenContact}
        setOpenCreateModal={setOpenCreateModal}
        setOpenSendTransaction={setOpenSendTransaction}
        setOpenTokenMetaData={setOpenTokenMetadata} />
      <FeatureView setOpenAirdrop={setOpenAirdrop}
        setOpenCreateModal={setOpenCreateModal}
        setOpenSendTransaction={setOpenSendTransaction}
        setOpenTokenMetaData={setOpenTokenMetadata} />
      <OfferView />
      <FaqView />
      {/* DYNAMIC COMPONENT*/}
      {/* {
        openCreateModel && (
          <div className='new_loader relative h-full bg-slate-900'>
            <CreateView setOpenCreateModal = {setOpenCreateModal}/>
          </div>
        )
      } */}
      {/* {
        openTokenMetadata && (
          <div className='new_loader relative h-full bg-slate-900'>
            <TokenMetadata setOpenTokenMetadata={setOpenTokenMetadata}/>
          </div>
        )
      } */}
      {
        openContact && (
          <div className='new_loader relative h-full bg-slate-900'>
            <ContactView setOpenContact={setOpenContact} />
          </div>
        )
      }
      {/* {
        openAirdrop && (
          <div className='new_loader relative h-full bg-slate-900'>
            <AirdropView setOpenAirdrop={setOpenAirdrop}/>
          </div>
        )
      } */}
      {/* {
        openSendTransaction && (
          <div className='new_loader relative h-full bg-slate-900'>
            <DonateView setOpenSendTransaction={setOpenSendTransaction}/>
          </div>
        )
      } */}
    </>

  )
}
export default Home