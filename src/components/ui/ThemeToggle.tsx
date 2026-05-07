import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "../../stores/themeStore";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggle = useThemeStore((state) => state.toggle);

  return (
    <motion.button
      aria-label={
        theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
      }
      className="icon-action"
      onClick={toggle}
      type="button"
      whileTap={{ scale: 0.9 }}
    >
      <motion.span
        animate={{ opacity: 1, rotate: 0 }}
        initial={{ opacity: 0, rotate: -90 }}
        key={theme}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.span>
    </motion.button>
  );
}
