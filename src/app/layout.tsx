import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://anima.sylphx.com"),
	title: {
		default: "Anima — AI Agents for Enterprise",
		template: "%s | Anima",
	},
	description:
		"Deploy autonomous AI agents across your tools and channels — privately, on your infrastructure. Built for enterprise.",
	keywords: ["AI agents", "enterprise AI", "autonomous agents", "AI automation", "Anima"],
	authors: [{ name: "Anima", url: "https://anima.sylphx.com" }],
	creator: "Anima",
	openGraph: {
		title: "Anima — AI Agents for Enterprise",
		description:
			"Deploy autonomous AI agents across your tools and channels — privately, on your infrastructure.",
		url: "https://anima.sylphx.com",
		siteName: "Anima",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Anima — AI Agents for Enterprise",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Anima — AI Agents for Enterprise",
		description:
			"Deploy autonomous AI agents across your tools and channels — privately, on your infrastructure.",
		images: ["/og-image.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon.ico", sizes: "any" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
	alternates: {
		canonical: "https://anima.sylphx.com",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Anima",
	url: "https://anima.sylphx.com",
	logo: "https://anima.sylphx.com/icon-512.png",
	description:
		"Deploy autonomous AI agents across your tools and channels — privately, on your infrastructure. Built for enterprise.",
	contactPoint: {
		"@type": "ContactPoint",
		email: "hello@sylphx.com",
		contactType: "customer support",
	},
	sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={inter.variable}>
			<body>
				{/* Make all animated elements immediately visible when JS is disabled */}
				<noscript>
					<style>{`
						.animate-fade-in-up,
						.animate-fade-in,
						.reveal {
							opacity: 1 !important;
							animation: none !important;
							transform: none !important;
						}
					`}</style>
				</noscript>
				{children}
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</body>
		</html>
	);
}
