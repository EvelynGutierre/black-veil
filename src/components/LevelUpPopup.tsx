import { motion, AnimatePresence } from "framer-motion";

type LevelUpPopupProps = {
  show: boolean;
  level: number;
};

export default function LevelUpPopup({ show, level }: LevelUpPopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="level-up-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="level-up-box"
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="level-up-label">SYSTEM NOTICE</p>
            <h1>LEVEL UP</h1>
            <p className="level-up-level">You are now Level {level}</p>
            <p className="level-up-reward">Ability Points +3</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}