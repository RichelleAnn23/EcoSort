import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
	const socialLinks = [
		{ icon: Github, href: "#", label: "GitHub" },
		{ icon: Linkedin, href: "#", label: "LinkedIn" },
		{ icon: Mail, href: "#", label: "Email" },
	];

	return (
		<motion.footer
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.8 }}
			className="border-t border-border/50 backdrop-blur-xl bg-card/20 py-8 mt-16"
		>
			<div className="container mx-auto px-6">
				<div className="flex flex-col items-center justify-center gap-4">
					{/* Copyright */}
					<p className="text-muted-foreground text-sm flex items-center gap-2">
						© 2025 EcoSort AI | Built with{" "}
						<Heart className="w-4 h-4 text-primary fill-primary inline animate-pulse" />{" "}
						using React + Teachable Machine
					</p>

					{/* Social Links */}
					<div className="flex gap-4">
						{socialLinks.map((link, index) => (
							<motion.a
								key={index}
								href={link.href}
								aria-label={link.label}
								whileHover={{ scale: 1.2, y: -2 }}
								whileTap={{ scale: 0.9 }}
								className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 border border-primary/20 hover:border-primary/40"
							>
								<link.icon className="w-5 h-5" />
							</motion.a>
						))}
					</div>
				</div>

				{/* Additional Info */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1 }}
					className="text-center mt-6 text-xs text-muted-foreground"
				>
					<p>Powered by AI • Committed to Sustainability • Open Source Ready</p>
				</motion.div>
			</div>
		</motion.footer>
	);
};

export default Footer;
