import { motion } from "framer-motion"
import type { Transition } from "framer-motion"
import type { ReactNode } from "react"

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
