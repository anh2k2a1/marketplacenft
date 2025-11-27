import type { FC } from "react"

export const FaqView: FC = ({}) => {
  const questions = [
    {
      question: "What is Solana Token Creator?",
      answer:
        "Solana Token Creator is a simple tool that allows you to generate, deploy, and manage tokens on the Solana blockchain without writing any code.",
      id: "faq-1",
    },
    {
      question: "How do I create my first token?",
      answer:
        "Just connect your Solana wallet, open the Create Token tool, and follow the guided steps. You can set the name, symbol, supply, and deploy the token instantly.",
      id: "faq-2",
    },
    {
      question: "Can I airdrop tokens to other users?",
      answer:
        "Yes! With the Airdrop feature, you can send your tokens to multiple wallet addresses at once. It’s an easy way to distribute tokens for promotions or community events.",
      id: "faq-3",
    },
    {
      question: "How can I update my token metadata?",
      answer:
        "Use the Token Metadata tool to edit details like your token’s logo, description, or project links. These changes will be reflected across platforms that support Solana tokens.",
      id: "faq-4",
    },
    {
      question: "Is there a fee for creating tokens?",
      answer:
        "Yes, creating a token requires a small amount of SOL for transaction fees on the Solana network. The cost is usually very low compared to other blockchains.",
      id: "faq-5",
    },
    {
      question: "Do I need coding knowledge to use this platform?",
      answer:
        "Not at all. The platform is designed for beginners. Everything works through a clean UI, so you can create and manage tokens with just a few clicks.",
      id: "faq-6",
    },
  ]

  return (
    <section id="faq" className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-medium capitalize text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-default-200 text-sm font-medium">
              Everything you need to know about creating and managing tokens on
              Solana.
            </p>
          </div>
        </div>

        {/* Accordion */}
        <div className="mx-auto max-w-3xl">
          <div className="hs-accordion-group space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className="hs-accordion bg-default-950/40 overflow-hidden rounded-lg border border-white/10 backdrop-blur-3xl"
                id={q.id}
              >
                <button
                  className="hs-accordion-toggle inline-flex items-center justify-between gap-x-3 px-6 py-4 text-left capitalize text-white transition-all"
                  aria-controls={`faq-accordion-${index + 1}`}
                >
                  <h5 className="flex text-base font-semibold">
                    <i className="me-3 h-5 w-5 stroke-white align-middle"></i>
                    {q.question}
                  </h5>
                  <i className="hs-accordion-active:-rotate-180 h-4 w-4 transition-all duration-500"></i>
                </button>

                <div
                  id={`faq-accordion-${index + 1}`}
                  className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                  aria-labelledby={q.id}
                >
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-default-300 text-sm font-medium">
                      {q.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}