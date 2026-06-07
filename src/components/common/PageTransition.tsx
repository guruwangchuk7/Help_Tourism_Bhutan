import { motion } from "framer-motion"
import type { Transition } from "framer-motion"
import { useEffect } from "react"
import type { ReactNode } from "react"

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
    duration: 0.25
}

type Props = {
    children: ReactNode
    title?: string
    description?: string
    ogImage?: string
    ogType?: string
}

const PageTransition = ({ children }: Props) => {
    useEffect(() => {
        // Scroll to top instantly upon component mounting
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        })
    }, [])

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
