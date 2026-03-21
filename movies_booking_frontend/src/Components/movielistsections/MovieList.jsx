import Trending from './Trending'
import Recommended from './Recommended'
import List from './List'
import { motion } from 'framer-motion'

export default function MovieList() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-950 min-h-screen pt-20 flex flex-col pb-24"
        >
            <Trending />
            
            <div className="w-full flex flex-col gap-12 mt-10">
                <Recommended />
                <List />
            </div>
        </motion.div>
    )
}