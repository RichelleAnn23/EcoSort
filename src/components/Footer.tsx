import { motion } from "framer-motion";

const Footer = () => {

	return (
		<motion.footer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.8 }}
			className="border-t border-border/50 backdrop-blur-xl bg-card/20 py-8 mt-16"
		>
			<div className="container mx-auto px-6">
				<div className="flex flex-col items-center justify-center gap-2">
					{/* Copyright */}
					<p className="text-sm text-white/60">© 2025 EcoSort AI. All rights reserved.</p>

					{/* Social Links */}
					{/* Additional Info */}
				</div>
			</div>
		</motion.footer>
	);
};

export default Footer;
