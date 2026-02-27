function formatNum(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return String(n);
}

interface Stats {
	instances: number;
	totalMessages: number;
	totalUsers: number;
	orgs: number;
}

export default async function Home() {
	let stats: Stats = { instances: 0, totalMessages: 0, totalUsers: 0, orgs: 0 };
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://anima.sylphx.com"}/api/stats`,
			{
				next: { revalidate: 60 },
			},
		);
		if (res.ok) stats = await res.json();
	} catch {
		// silently fall back to zeros
	}

	return (
		<>
			{/* Navigation */}
			<nav>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
						padding: "1rem 1.5rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					{/* Logo */}
					<a
						href="/"
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.375rem",
							textDecoration: "none",
						}}
					>
						<span
							style={{
								fontSize: "1.375rem",
								fontWeight: 700,
								letterSpacing: "-0.02em",
								color: "#ffffff",
							}}
						>
							anima
						</span>
						<span
							style={{
								width: "6px",
								height: "6px",
								borderRadius: "50%",
								background: "var(--accent)",
								display: "inline-block",
								boxShadow: "0 0 8px var(--accent)",
							}}
						/>
					</a>

					{/* Nav links */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "2rem",
						}}
					>
						{["Features", "How it works", "Use cases"].map((item) => (
							<a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="nav-link">
								{item}
							</a>
						))}
						<a
							href="#contact"
							className="btn-primary"
							style={{ padding: "0.625rem 1.25rem", fontSize: "0.9rem" }}
						>
							Get in touch
						</a>
					</div>
				</div>
			</nav>

			<main>
				{/* ─────────────────────────────── HERO ─────────────────────────────── */}
				<section
					style={{
						minHeight: "100vh",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						overflow: "hidden",
						paddingTop: "6rem",
					}}
					className="grid-bg"
				>
					{/* Orbs */}
					<div
						className="orb"
						style={{
							width: "600px",
							height: "600px",
							background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}
					/>
					<div
						className="orb"
						style={{
							width: "300px",
							height: "300px",
							background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
							top: "20%",
							right: "10%",
							animationDelay: "-4s",
						}}
					/>

					<div
						style={{
							maxWidth: "800px",
							margin: "0 auto",
							textAlign: "center",
							position: "relative",
							zIndex: 1,
						}}
					>
						<div
							className="animate-fade-in-up"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "0.5rem",
								background: "rgba(99, 102, 241, 0.1)",
								border: "1px solid rgba(99, 102, 241, 0.25)",
								borderRadius: "100px",
								padding: "0.375rem 1rem",
								fontSize: "0.8rem",
								fontWeight: 600,
								color: "var(--accent-light)",
								letterSpacing: "0.05em",
								textTransform: "uppercase",
								marginBottom: "2rem",
							}}
						>
							<span
								style={{
									width: "6px",
									height: "6px",
									borderRadius: "50%",
									background: "var(--accent)",
									animation: "orbFloat 2s ease-in-out infinite",
								}}
							/>
							AI Agents for Enterprise
						</div>

						<h1
							className="animate-fade-in-up delay-100"
							style={{
								fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
								fontWeight: 800,
								lineHeight: 1.1,
								letterSpacing: "-0.03em",
								marginBottom: "1.5rem",
							}}
						>
							<span className="gradient-text">AI Agents That</span>
							<br />
							Actually Work
						</h1>

						<p
							className="animate-fade-in-up delay-200"
							style={{
								fontSize: "clamp(1rem, 2vw, 1.25rem)",
								color: "var(--muted)",
								lineHeight: 1.7,
								maxWidth: "600px",
								margin: "0 auto 2.5rem",
							}}
						>
							Anima deploys autonomous agents into your business workflows. They communicate, take
							action, and improve — without you managing them.
						</p>

						<div
							className="animate-fade-in-up delay-300"
							style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
						>
							<a href="#contact" className="btn-primary">
								Get in touch
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
									<path
										d="M3 8h10M9 4l4 4-4 4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</a>
							<a
								href="#how-it-works"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "0.5rem",
									color: "var(--muted)",
									textDecoration: "none",
									fontSize: "1rem",
									fontWeight: 500,
									padding: "0.875rem 1.5rem",
									transition: "color 0.2s",
								}}
							>
								See how it works
							</a>
						</div>

						{/* Abstract geometric decoration */}
						<div
							className="animate-fade-in delay-500"
							style={{
								marginTop: "5rem",
								position: "relative",
								height: "180px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{/* Hexagonal grid decoration */}
							<svg
								viewBox="0 0 800 180"
								width="100%"
								height="180"
								style={{ opacity: 0.15 }}
								aria-hidden="true"
							>
								<defs>
									<pattern
										id="hex"
										x="0"
										y="0"
										width="60"
										height="52"
										patternUnits="userSpaceOnUse"
									>
										<polygon
											points="30,1 59,16 59,46 30,61 1,46 1,16"
											fill="none"
											stroke="#6366f1"
											strokeWidth="0.8"
										/>
									</pattern>
								</defs>
								<rect width="800" height="180" fill="url(#hex)" />
								<rect width="800" height="180" fill="url(#fade-mask)" />
								<defs>
									<linearGradient id="fade-mask" x1="0" y1="0" x2="1" y2="0">
										<stop offset="0%" stopColor="var(--bg)" stopOpacity="1" />
										<stop offset="20%" stopColor="transparent" stopOpacity="0" />
										<stop offset="80%" stopColor="transparent" stopOpacity="0" />
										<stop offset="100%" stopColor="var(--bg)" stopOpacity="1" />
									</linearGradient>
								</defs>
							</svg>
						</div>
					</div>
				</section>

				{/* ─────────────────────────────── STATS BAR ─────────────────────────────── */}
				<section
					style={{
						background: "rgba(99,102,241,0.04)",
						borderTop: "1px solid rgba(99,102,241,0.12)",
						borderBottom: "1px solid rgba(99,102,241,0.12)",
						padding: "2.5rem 1.5rem",
					}}
				>
					<div
						style={{
							maxWidth: "900px",
							margin: "0 auto",
							display: "grid",
							gridTemplateColumns: "repeat(3, 1fr)",
							gap: "2rem",
							textAlign: "center",
						}}
					>
						{[
							{ label: "Agents Running", value: formatNum(stats.instances) },
							{ label: "Messages Processed", value: formatNum(stats.totalMessages) },
							{ label: "Organisations Served", value: formatNum(stats.orgs) },
						].map((s) => (
							<div key={s.label}>
								<div
									style={{
										fontSize: "clamp(2rem, 4vw, 2.75rem)",
										fontWeight: 800,
										letterSpacing: "-0.03em",
										background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
										lineHeight: 1.1,
										marginBottom: "0.5rem",
									}}
								>
									{s.value}
								</div>
								<div
									style={{
										color: "var(--muted)",
										fontSize: "0.9rem",
										fontWeight: 500,
										letterSpacing: "0.02em",
									}}
								>
									{s.label}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* ─────────────────────────────── FEATURES ─────────────────────────────── */}
				<section id="features" style={{ background: "rgba(255,255,255,0.01)" }}>
					<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
						<div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
							<p
								style={{
									color: "var(--accent-light)",
									fontWeight: 600,
									fontSize: "0.85rem",
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									marginBottom: "1rem",
								}}
							>
								Why Anima
							</p>
							<h2
								style={{
									fontSize: "clamp(2rem, 4vw, 3rem)",
									fontWeight: 800,
									letterSpacing: "-0.03em",
									lineHeight: 1.15,
									marginBottom: "1rem",
								}}
							>
								Built for real enterprise needs
							</h2>
							<p
								style={{
									color: "var(--muted)",
									fontSize: "1.1rem",
									maxWidth: "500px",
									margin: "0 auto",
								}}
							>
								Not another chatbot wrapper. Anima is infrastructure for autonomous work.
							</p>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
								gap: "1.5rem",
							}}
						>
							{[
								{
									icon: "🔗",
									title: "Multi-channel",
									desc: "Telegram, WhatsApp, web. Works where your team already is.",
									delay: "delay-100",
								},
								{
									icon: "⚡",
									title: "Autonomous",
									desc: "Takes action end-to-end. Not just a chatbot.",
									delay: "delay-200",
								},
								{
									icon: "🧠",
									title: "Always learning",
									desc: "Builds context from every interaction in your environment.",
									delay: "delay-300",
								},
								{
									icon: "🔒",
									title: "Fully private",
									desc: "Deployed on your infrastructure. Your data never leaves.",
									delay: "delay-400",
								},
							].map((f) => (
								<div key={f.title} className={`card reveal ${f.delay}`}>
									<div
										style={{
											width: "48px",
											height: "48px",
											borderRadius: "12px",
											background: "rgba(99, 102, 241, 0.12)",
											border: "1px solid rgba(99, 102, 241, 0.2)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: "1.5rem",
											marginBottom: "1.25rem",
										}}
									>
										{f.icon}
									</div>
									<h3
										style={{
											fontSize: "1.15rem",
											fontWeight: 700,
											marginBottom: "0.625rem",
											letterSpacing: "-0.01em",
										}}
									>
										{f.title}
									</h3>
									<p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: "0.95rem" }}>
										{f.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ─────────────────────────────── HOW IT WORKS ─────────────────────────────── */}
				<section id="how-it-works">
					<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
						<div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
							<p
								style={{
									color: "var(--accent-light)",
									fontWeight: 600,
									fontSize: "0.85rem",
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									marginBottom: "1rem",
								}}
							>
								How it works
							</p>
							<h2
								style={{
									fontSize: "clamp(2rem, 4vw, 3rem)",
									fontWeight: 800,
									letterSpacing: "-0.03em",
									lineHeight: 1.15,
								}}
							>
								From setup to running in days
							</h2>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
								gap: "2rem",
								position: "relative",
							}}
						>
							{/* Connector line (desktop) */}
							<div
								style={{
									position: "absolute",
									top: "1.25rem",
									left: "calc(16.67% + 1.25rem)",
									right: "calc(16.67% + 1.25rem)",
									height: "1px",
									background: "linear-gradient(90deg, rgba(99,102,241,0.5), rgba(99,102,241,0.5))",
									zIndex: 0,
								}}
							/>

							{[
								{
									num: "1",
									title: "We configure",
									desc: "Anima is set up for your specific workflows and connected to your tools.",
									delay: "delay-100",
								},
								{
									num: "2",
									title: "You connect",
									desc: "Point your channels (Telegram bot, webhooks, etc.) to your Anima endpoint.",
									delay: "delay-200",
								},
								{
									num: "3",
									title: "It works",
									desc: "Your team interacts naturally. Anima handles the rest.",
									delay: "delay-300",
								},
							].map((s) => (
								<div
									key={s.num}
									className={`reveal ${s.delay}`}
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
										gap: "1.25rem",
										position: "relative",
										zIndex: 1,
										background: "var(--bg)",
										padding: "1.5rem",
										borderRadius: "16px",
									}}
								>
									<div className="step-number">{s.num}</div>
									<div>
										<h3
											style={{
												fontSize: "1.15rem",
												fontWeight: 700,
												marginBottom: "0.5rem",
												letterSpacing: "-0.01em",
											}}
										>
											{s.title}
										</h3>
										<p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.95rem" }}>
											{s.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ─────────────────────────────── USE CASES ─────────────────────────────── */}
				<section
					id="use-cases"
					style={{
						background: "rgba(99,102,241,0.02)",
						borderTop: "1px solid rgba(99,102,241,0.08)",
						borderBottom: "1px solid rgba(99,102,241,0.08)",
					}}
				>
					<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
						<div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
							<p
								style={{
									color: "var(--accent-light)",
									fontWeight: 600,
									fontSize: "0.85rem",
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									marginBottom: "1rem",
								}}
							>
								Use cases
							</p>
							<h2
								style={{
									fontSize: "clamp(2rem, 4vw, 3rem)",
									fontWeight: 800,
									letterSpacing: "-0.03em",
									lineHeight: 1.15,
									marginBottom: "1rem",
								}}
							>
								Everywhere work happens
							</h2>
							<p
								style={{
									color: "var(--muted)",
									fontSize: "1.1rem",
									maxWidth: "480px",
									margin: "0 auto",
								}}
							>
								Anima adapts to your organisation — not the other way around.
							</p>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
								gap: "1.5rem",
							}}
						>
							{[
								{
									icon: "👥",
									title: "HR & People Ops",
									desc: "Onboarding, leave management, policy Q&A, staff communications.",
									tags: ["Onboarding", "Leave mgmt", "Policy Q&A"],
									delay: "delay-100",
								},
								{
									icon: "⚙️",
									title: "Operations",
									desc: "Approvals, status updates, task routing, internal knowledge base.",
									tags: ["Approvals", "Routing", "Knowledge base"],
									delay: "delay-200",
								},
								{
									icon: "💬",
									title: "Customer-facing",
									desc: "Intake, triage, escalation — always on, never off-brand.",
									tags: ["Intake", "Triage", "Escalation"],
									delay: "delay-300",
								},
							].map((u) => (
								<div
									key={u.title}
									className={`card reveal ${u.delay}`}
									style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
								>
									<div
										style={{
											width: "48px",
											height: "48px",
											borderRadius: "12px",
											background: "rgba(99, 102, 241, 0.1)",
											border: "1px solid rgba(99, 102, 241, 0.2)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: "1.5rem",
										}}
									>
										{u.icon}
									</div>
									<div>
										<h3
											style={{
												fontSize: "1.15rem",
												fontWeight: 700,
												marginBottom: "0.5rem",
												letterSpacing: "-0.01em",
											}}
										>
											{u.title}
										</h3>
										<p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.95rem" }}>
											{u.desc}
										</p>
									</div>
									<div
										style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "auto" }}
									>
										{u.tags.map((tag) => (
											<span
												key={tag}
												style={{
													background: "rgba(99, 102, 241, 0.08)",
													border: "1px solid rgba(99, 102, 241, 0.15)",
													borderRadius: "100px",
													padding: "0.25rem 0.75rem",
													fontSize: "0.75rem",
													fontWeight: 500,
													color: "var(--accent-light)",
												}}
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ─────────────────────────────── CTA BANNER ─────────────────────────────── */}
				<section>
					<div
						style={{
							maxWidth: "800px",
							margin: "0 auto",
							textAlign: "center",
							background:
								"linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)",
							border: "1px solid rgba(99,102,241,0.2)",
							borderRadius: "24px",
							padding: "4rem 2rem",
							position: "relative",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								position: "absolute",
								width: "400px",
								height: "400px",
								borderRadius: "50%",
								background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								pointerEvents: "none",
							}}
						/>
						<div style={{ position: "relative", zIndex: 1 }}>
							<h2
								className="reveal"
								style={{
									fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
									fontWeight: 800,
									letterSpacing: "-0.03em",
									marginBottom: "1rem",
									lineHeight: 1.15,
								}}
							>
								Deploy your first agent
								<br />
								<span className="gradient-text">in days, not months</span>
							</h2>
							<p
								className="reveal delay-100"
								style={{
									color: "var(--muted)",
									fontSize: "1.1rem",
									marginBottom: "2rem",
									lineHeight: 1.65,
								}}
							>
								We handle configuration, integration, and ongoing improvement.
								<br />
								You just interact.
							</p>
							<a href="#contact" className="btn-primary reveal delay-200">
								Talk to us
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
									<path
										d="M3 8h10M9 4l4 4-4 4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</a>
						</div>
					</div>
				</section>

				{/* ─────────────────────────────── CONTACT / FOOTER ─────────────────────────────── */}
				<footer
					id="contact"
					style={{
						borderTop: "1px solid rgba(255,255,255,0.06)",
						padding: "5rem 1.5rem 3rem",
					}}
				>
					<div
						style={{
							maxWidth: "1100px",
							margin: "0 auto",
						}}
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "4rem",
								marginBottom: "4rem",
							}}
						>
							<div>
								{/* Logo */}
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.375rem",
										marginBottom: "1rem",
									}}
								>
									<span style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
										anima
									</span>
									<span
										style={{
											width: "6px",
											height: "6px",
											borderRadius: "50%",
											background: "var(--accent)",
											display: "inline-block",
											boxShadow: "0 0 8px var(--accent)",
										}}
									/>
								</div>
								<p
									style={{
										color: "var(--muted)",
										lineHeight: 1.65,
										fontSize: "0.95rem",
										maxWidth: "320px",
									}}
								>
									Deploy autonomous AI agents that work across your tools and channels — privately,
									on your infrastructure.
								</p>
							</div>

							<div>
								<h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>
									Get in touch
								</h3>
								<p
									style={{
										color: "var(--muted)",
										lineHeight: 1.65,
										fontSize: "0.95rem",
										marginBottom: "1.25rem",
									}}
								>
									Interested in Anima for your organisation? Reach out.
								</p>
								<a
									href="mailto:hello@sylphx.com"
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: "0.5rem",
										color: "var(--accent-light)",
										textDecoration: "none",
										fontWeight: 600,
										fontSize: "1rem",
										transition: "color 0.2s",
									}}
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									hello@sylphx.com
								</a>
							</div>
						</div>

						<div
							style={{
								borderTop: "1px solid rgba(255,255,255,0.06)",
								paddingTop: "2rem",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: "1rem",
							}}
						>
							<p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
								© 2026 Sylphx Ltd. All rights reserved.
							</p>
							<div style={{ display: "flex", gap: "1.5rem" }}>
								{["Privacy Policy", "Terms"].map((link) => (
									<a
										key={link}
										href={link === "Privacy Policy" ? "/privacy" : "/terms"}
										style={{
											color: "var(--muted)",
											textDecoration: "none",
											fontSize: "0.85rem",
											transition: "color 0.2s",
										}}
									>
										{link}
									</a>
								))}
							</div>
						</div>
					</div>
				</footer>
			</main>
		</>
	);
}
