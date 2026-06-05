import { motion } from "framer-motion"
import type { Transition } from "framer-motion"
import { useEffect } from "react"
import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
        filter: "blur(3px)",
    },
    in: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    },
    out: {
        opacity: 0,
        y: -10,
        filter: "blur(3px)",
    }
}

const pageTransition: Transition = {
    type: "tween",
    ease: [0.22, 1, 0.36, 1], // Custom Bézier curve for an elegant, fluid motion
    duration: 0.6
}

type Props = {
    children: ReactNode
}

const PageTransition = ({ children }: Props) => {
    const location = useLocation()

    useEffect(() => {
        let title = "WanderVista | Bhutan Tours & Luxury Travel Operator"
        let desc = "WanderVista is a premier licensed tour operator in Bhutan. Explore cultural dzongs, high-altitude treks, and custom luxury itineraries."
        
        const path = location.pathname
        if (path === "/destinations") {
            title = "Bhutan Travel Destinations & Valleys | WanderVista"
            desc = "Discover Bhutan's legendary valleys, from Tiger's Nest in Paro to Punakha Dzong and the spiritual heartlands."
        } else if (path === "/tours") {
            title = "Signature Bhutan Tour Packages & Expeditions | WanderVista"
            desc = "View our curated cultural festival tours, high altitude treks, and luxury escapes to the Kingdom of Happiness."
        } else if (path === "/hotels") {
            title = "Luxury Hotels & Boutique Lodges in Bhutan | WanderVista"
            desc = "Stay at five-star luxury retreats in Bhutan including Amankora, Six Senses, and COMO Uma Paro."
        } else if (path === "/flights") {
            title = "Book Flights to Paro International Airport | WanderVista"
            desc = "Find direct routes, carrier info, flight frequencies, and visa support for entry into Bhutan."
        } else if (path === "/about") {
            title = "Our Legacy & Sustainability Philosophy | WanderVista Bhutan"
            desc = "Learn about our community-first standards, carbon-negative guidelines, and local guides."
        } else if (path === "/contact") {
            title = "Contact Our Thimphu Travel Architects | WanderVista"
            desc = "Get in touch with local guides in Thimphu to schedule your custom itinerary to Bhutan."
        } else if (path === "/plan") {
            title = "Design Your Custom Bhutan Itinerary | WanderVista"
            desc = "Use our interactive trip builder for an instant travel budget estimate and customized itinerary plan."
        } else if (path === "/faq") {
            title = "Bhutan Travel FAQ: Visas, SDF Fee & Guidelines | WanderVista"
            desc = "Get answers to frequently asked questions on Bhutan visas, Sustainable Development Fee (SDF), currency, and dress codes."
        } else if (path === "/sdf") {
            title = "Bhutan SDF Fee Explained: Rates & Regulations | WanderVista"
            desc = "All you need to know about the daily $100 Sustainable Development Fee (SDF) and visa fees for Bhutan."
        } else if (path.startsWith("/tours/")) {
            title = "Experience Bhutanese Luxury Tour | WanderVista"
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
        const schemaId = "wandervista-jsonld"
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
            "name": "WanderVista Bhutan",
            "image": "https://wandervista.bt/paro-taksang.jpg",
            "@id": "https://wandervista.bt/#agency",
            "url": "https://wandervista.bt",
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
                "https://www.instagram.com/wandervista"
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
