import { motion } from "framer-motion"
import type { Transition } from "framer-motion"
import { useEffect } from "react"
import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"

const pageVariants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -8,
    }
}

const pageTransition: Transition = {
    type: "tween",
    ease: "easeOut",
    duration: 0.25 // Snappy transition to ensure no lag and instant responsiveness
}

type Props = {
    children: ReactNode
}

const PageTransition = ({ children }: Props) => {
    const location = useLocation()

    useEffect(() => {
        // Scroll to top instantly upon component mounting (after exit animation completes)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        })

        let title = "Help Tourism Bhutan | Bhutan Tours & Luxury Travel Operator"
        let desc = "Help Tourism Bhutan is a premier licensed tour operator in Bhutan. Explore cultural dzongs, high-altitude treks, and custom luxury itineraries."
        
        const path = location.pathname
        if (path === "/destinations") {
            title = "Bhutan Travel Destinations & Valleys | Help Tourism Bhutan"
            desc = "Discover Bhutan's legendary valleys, from Tiger's Nest in Paro to Punakha Dzong and the spiritual heartlands."
        } else if (path === "/tours") {
            title = "Signature Bhutan Tour Packages & Expeditions | Help Tourism Bhutan"
            desc = "View our curated cultural festival tours, high altitude treks, and luxury escapes to the Kingdom of Happiness."
        } else if (path === "/hotels") {
            title = "Luxury Hotels & Boutique Lodges in Bhutan | Help Tourism Bhutan"
            desc = "Stay at five-star luxury retreats in Bhutan including Amankora, Six Senses, and COMO Uma Paro."
        } else if (path === "/flights") {
            title = "Book Flights to Paro International Airport | Help Tourism Bhutan"
            desc = "Find direct routes, carrier info, flight frequencies, and visa support for entry into Bhutan."
        } else if (path === "/about") {
            title = "Our Legacy & Sustainability Philosophy | Help Tourism Bhutan"
            desc = "Learn about our community-first standards, carbon-negative guidelines, and local guides."
        } else if (path === "/contact") {
            title = "Contact Our Thimphu Travel Architects | Help Tourism Bhutan"
            desc = "Get in touch with local guides in Thimphu to schedule your custom itinerary to Bhutan."
        } else if (path === "/plan") {
            title = "Design Your Custom Bhutan Itinerary | Help Tourism Bhutan"
            desc = "Use our interactive trip builder for an instant travel budget estimate and customized itinerary plan."
        } else if (path === "/faq") {
            title = "Bhutan Travel FAQ: Visas, SDF Fee & Guidelines | Help Tourism Bhutan"
            desc = "Get answers to frequently asked questions on Bhutan visas, Sustainable Development Fee (SDF), currency, and dress codes."
        } else if (path === "/sdf") {
            title = "Bhutan SDF Fee Explained: Rates & Regulations | Help Tourism Bhutan"
            desc = "All you need to know about the daily $100 Sustainable Development Fee (SDF) and visa fees for Bhutan."
        } else if (path.startsWith("/tours/")) {
            title = "Experience Bhutanese Luxury Tour | Help Tourism Bhutan"
        }

        document.title = title

        let metaDesc = document.querySelector('meta[name="description"]')
        if (!metaDesc) {
            metaDesc = document.createElement('meta')
            metaDesc.setAttribute('name', 'description')
            document.head.appendChild(metaDesc)
        }
        metaDesc.setAttribute('content', desc)

        // Inject JSON-LD Schema
        const schemaId = "helptourismbhutan-jsonld"
        let scriptTag = document.getElementById(schemaId) as HTMLScriptElement
        if (!scriptTag) {
            scriptTag = document.createElement("script")
            scriptTag.id = schemaId
            scriptTag.type = "application/ld+json"
            document.head.appendChild(scriptTag)
        }

        const schemaObj = {
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Help Tourism Bhutan",
            "image": "https://helptourismbhutan.bt/paro-taksang.jpg",
            "@id": "https://helptourismbhutan.bt/#agency",
            "url": "https://helptourismbhutan.bt",
            "telephone": "+975-2-334567",
            "priceRange": "$$$$",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Changlam Square, 2nd Floor",
                "addressLocality": "Thimphu",
                "addressCountry": "BT"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "27.4712",
                "longitude": "89.6339"
            },
            "sameAs": [
                "https://www.instagram.com/helptourismbhutan"
            ]
        }
        scriptTag.text = JSON.stringify(schemaObj)
    }, [location])

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full transform-gpu"
        >
            {children}
        </motion.div>
    )
}

export default PageTransition
