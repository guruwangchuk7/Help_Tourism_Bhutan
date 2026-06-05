import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown } from "lucide-react"
import PageTransition from "../components/common/PageTransition"

type FaqItem = {
  question: string
  answer: string
}

type FaqCategory = {
  title: string
  items: FaqItem[]
}

const faqData: FaqCategory[] = [
  {
    title: "Visa & Entry Process",
    items: [
      {
        question: "How do I apply for a tourist visa to Bhutan?",
        answer: "As an official tour operator, we handle the entire e-visa application process for you. We submit the visa application online on your behalf after receiving your details and full trip payment (including the SDF fee). All you need to do is send us a scanned copy of your passport photo page (which must be valid for at least 6 months from the date of travel) and a digital passport passport-sized photo."
      },
      {
        question: "How much does the Bhutan tourist visa cost?",
        answer: "The visa application fee is $40 USD per person. This is a one-time, non-refundable government processing fee. We bundle this cost directly inside your package booking for convenience."
      },
      {
        question: "Are there any nationalities exempt from tourist visa fees?",
        answer: "Indian nationals do not require a standard visa but must apply for an Online Entry Permit in advance. Bangladeshi tourists pay a reduced visa fee. For all other international travelers, the $40 USD visa fee is mandatory."
      }
    ]
  },
  {
    title: "Sustainable Development Fee (SDF)",
    items: [
      {
        question: "What is the Sustainable Development Fee (SDF)?",
        answer: "The SDF is a mandatory daily fee paid directly to the government of Bhutan to fund the country's carbon-negative preservation, free universal healthcare, public school systems, trail upkeep, and heritage conservation."
      },
      {
        question: "What is the current daily SDF rate?",
        answer: "Currently, the standard international SDF rate is $100 USD per person per night (reduced from the original rate of $200 USD). This 50% discount is valid until August 31, 2027. Children aged 6-11 pay $50 USD per night, and children under 6 are completely exempt."
      },
      {
        question: "Is the SDF included in my tour package price?",
        answer: "Yes, all our signature tour itineraries include the daily $100 USD SDF government levy and the $40 visa fee. However, if you book standalone luxury hotels or external services separately, you must calculate and pay the SDF directly during visa issuance."
      }
    ]
  },
  {
    title: "Money & Currency",
    items: [
      {
        question: "What currency is used in Bhutan?",
        answer: "The local currency is the Bhutanese Ngultrum (BTN), which is officially pegged 1:1 to the Indian Rupee (INR). Indian Rupees are widely accepted across Bhutan, but bank notes of INR 500 and INR 2,000 denomination are restricted. US Dollars (USD) are widely accepted at premium hotels and handicraft shops."
      },
      {
        question: "Can I use credit cards in Bhutan?",
        answer: "Credit card acceptance is limited in Bhutan. Only major international hotels and high-end handicraft shops in Thimphu and Paro accept Visa and Mastercard. ATMs are available in major towns but can be unreliable for foreign cards. We strongly recommend carrying USD cash to exchange for personal expenses, dinners, and tips."
      }
    ]
  },
  {
    title: "Packing & Climate",
    items: [
      {
        question: "What should I pack for my Bhutan trip?",
        answer: "Dress in Bhutan is modest. When visiting Dzongs (fortresses) and temples, you must cover your shoulders and knees; closed-toe shoes are mandatory. Pack layered clothing (thermal base layers, windbreaker jackets, sweaters) as temperatures drop rapidly in the evenings, especially in winter or at high mountain passes like Dochula."
      },
      {
        question: "Is altitude sickness common in Bhutan?",
        answer: "Most tourist valleys (Paro, Thimphu, Punakha) lie between 1,200 and 2,400 meters, where altitude sickness is rare. However, hikes to Tiger's Nest (3,120m) and drives across Dochula Pass (3,100m) may trigger mild shortness of breath. We pace our itineraries carefully to allow natural acclimatization."
      }
    ]
  }
]

const Faq = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <PageTransition>
      <div className="pt-24 bg-bg-light min-h-[100dvh]">
        {/* Header Section */}
        <section className="py-20 px-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Practical Guide</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-medium text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-secondary font-light text-base leading-relaxed">
            Everything you need to know before traveling to the Land of the Thunder Dragon. Get clear details on visas, currency, packing guidelines, and government taxes.
          </p>
        </section>

        {/* Content Tabs & Accordions */}
        <main className="max-w-5xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            
            {/* Category Selectors (4 cols) */}
            <div className="md:col-span-4 space-y-2">
              {faqData.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(idx)
                    setExpandedIndex(0) // reset expanded to first item of new tab
                  }}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    activeTab === idx
                      ? "bg-primary border-primary text-white shadow-minimal"
                      : "bg-white border-primary/5 hover:border-primary/10 text-primary"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

            {/* Accordion Panel (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {faqData[activeTab].items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-primary/5 overflow-hidden transition-all shadow-minimal hover:shadow-premium"
                    >
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                      >
                        <span className="font-heading font-semibold text-primary text-base pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${
                            expandedIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedIndex === index && (
                        <div className="px-6 pb-6 pt-2 border-t border-primary/5 text-sm font-light text-secondary leading-relaxed tracking-wide">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

export default Faq
