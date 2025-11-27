import type { FC } from "react"
import { Star, Shield, Zap, Coins, Rocket, Globe } from "lucide-react"

export const OfferView: FC = () => {
  const features = [
    {
      title: "Best Token Builder",
      desc: "She sits there, embracing both love and suffering in noble artistry. Every error seems almost to exist only to endure delight.",
      icon: <Star className="text-primary h-10 w-10" />,
    },
    {
      title: "Trusted Security",
      desc: "A safeguard for every choice, she transforms errors into resilience, guiding us through the unknown with strength.",
      icon: <Shield className="text-primary h-10 w-10" />,
    },
    {
      title: "High Performance",
      desc: "With speed and clarity, the path unfolds. Each obstacle is but a step toward the endurance we are meant to discover.",
      icon: <Zap className="text-primary h-10 w-10" />,
    },
    {
      title: "Low Transaction Fees",
      desc: "Enjoy seamless transactions on Solana with minimal costs, enabling efficiency and scalability for every project.",
      icon: <Coins className="text-primary h-10 w-10" />,
    },
    {
      title: "Scalability",
      desc: "Harness the power of Solana’s high throughput to grow without limits, supporting millions of users effortlessly.",
      icon: <Rocket className="text-primary h-10 w-10" />,
    },
    {
      title: "Global Adoption",
      desc: "Join a rapidly growing ecosystem embraced worldwide by developers, creators, and innovators.",
      icon: <Globe className="text-primary h-10 w-10" />,
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-medium capitalize text-white">
              Solana Token Popularity
            </h2>
            <p className="text-default-200 text-sm font-medium">
              She sits there, embracing both love and suffering in noble
              artistry. Every error seems almost to exist only to endure delight,
              some choice, the unknown, and the endurance that we are led
              through.
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-default-950/40 hover:-translate-y-2 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500"
            >
              <div className="p-10">
                {f.icon}
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  {f.title}
                </h3>
                <p className="text-default-100 mb-4 text-sm font-medium">
                  {f.desc}
                </p>
                <a
                  href="#"
                  className="text-primary group relative inline-flex items-center gap-2"
                >
                  Read More
                  <i className="h-4 w-4"></i>
                  <span className="bg-primary/80 absolute bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full"></span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}