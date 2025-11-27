import type { Dispatch, FC, SetStateAction } from 'react'
import { MdGeneratingTokens } from 'react-icons/md'
import { IoIosArrowForward } from 'react-icons/io'
import { LuArrowRightFromLine } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom';

interface ToolViewProps {
  setOpenAirdrop: Dispatch<SetStateAction<any>>;
  setOpenContact: Dispatch<SetStateAction<any>>;
  setOpenCreateModal: Dispatch<SetStateAction<any>>;
  setOpenSendTransaction: Dispatch<SetStateAction<any>>;
  setOpenTokenMetaData: Dispatch<SetStateAction<any>>;
}

export const ToolView: FC<ToolViewProps> = ({
  setOpenAirdrop,
  setOpenContact,
  setOpenCreateModal,
  setOpenSendTransaction,
  setOpenTokenMetaData
}) => {

  const tools = [
    { name: "Create Token", icon: <MdGeneratingTokens />, action: setOpenCreateModal },
    { name: "Token Metadata", icon: <MdGeneratingTokens />, action: setOpenTokenMetaData },
    { name: "Contact Us", icon: <MdGeneratingTokens />, action: setOpenContact },
    { name: "Airdrop", icon: <MdGeneratingTokens />, action: setOpenAirdrop },
    { name: "Send Transaction", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
    { name: "Buddy Token", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
    { name: "Top Tokens", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
    { name: "Solana Explore", icon: <MdGeneratingTokens />, action: setOpenSendTransaction },
  ]

  const navigate = useNavigate();

  return (
    <section id="tools" className='py-20'>
      <div className='container'>
        <div className='mb-10 flex items-end justify-between'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='mb-4 text-3xl font-medium capitalize text-white'>
              Solana Powerful Tools
            </h2>
            <p className='text-default-200 text-sm font-medium'>
              Hello world of words, this paragraph is merely a placeholder used to illustrate layout.
              Lines of text flow endlessly, without needing real meaning, only keeping rhythm and length.
              The reader will focus on the presentation rather than the content.
              Words just pour out, sentences seem meaningful but are actually only a background for the design.
            </p>
          </div>
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {tools.map((tool, index) => (
            <div
              key={index}
              className='bg-default-950/40 rounded-xl backdrop-blur-3xl cursor-pointer'
              onClick={() => tool.action(true)}
            >
              <div className='p-6'>
                <div className='mb-4 flex items-center gap-4'>
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 
                    ${index == 0 ? "text-red-500"
                        : index == 1 ? "text-sky-500"
                          : index == 2 ? "text-indigo-500"
                            : index == 4 ? "text-yellow-500"
                              : "text-teal-500"
                      }`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className='text-default-200 text-xl font-medium'>{tool.name}</h3>
                </div>
                <button
                  onClick={() => navigate('/mint')}
                  className='text-primary group relative inline-flex items-center gap-2'
                >
                  Select & Try
                  <LuArrowRightFromLine />
                  <span className='bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full'></span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-10 flex justify-center'>
          <button className='hover:bg-primary-hover bg-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-white transition-all duration-500'>
            More Tools
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </section>
  );
}