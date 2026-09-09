import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../components/Layout/Navbar";

const Landing = () => {
    return (
        <main className="min-h-screen overflow-hidden bg-[#080808] text-white">

            <Navbar />

            {/* Hero */}
            <section className="relative flex min-h-screen items-center justify-center px-6 pt-20">

                {/* Glow */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6b2c]/10 blur-[140px]" />

                <div className="relative z-10 mx-auto max-w-5xl text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[#ff6b2c]/20 bg-[#ff6b2c]/5 px-4 py-2 text-sm text-[#ff9a6b]"
                    >
                        <Sparkles size={15} />
                        The modern workspace for teams
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-8xl"
                    >
                        Where projects
                        <br />
                        <span className="text-[#ff6b2c]">flow.</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg"
                    >
                        DEVFLOW brings projects, tasks, clients and team collaboration
                        together in one powerful workspace built for modern teams.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
                    >
                        <button className="group flex items-center gap-2 rounded-full bg-[#ff6b2c] px-7 py-3.5 font-semibold text-black transition hover:bg-[#ff8a4c]">
                            Start building
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </button>

                        <button className="rounded-full border border-white/10 px-7 py-3.5 font-semibold text-white transition hover:border-white/20 hover:bg-white/5">
                            Explore features
                        </button>
                    </motion.div>

                    {/* Trust */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500"
                    >
                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-[#ff6b2c]" />
                            Free to get started
                        </span>

                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-[#ff6b2c]" />
                            No credit card
                        </span>

                        <span className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-[#ff6b2c]" />
                            Built for teams
                        </span>
                    </motion.div>

                </div>
            </section>

            {/* Preview */}
            <section className="px-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-[#ff6b2c]/5"
                >
                    <div className="flex h-12 items-center gap-2 border-b border-white/10 px-4">
                        <span className="h-3 w-3 rounded-full bg-red-400/60" />
                        <span className="h-3 w-3 rounded-full bg-yellow-400/60" />
                        <span className="h-3 w-3 rounded-full bg-green-400/60" />
                    </div>

                    <div className="grid min-h-[360px] grid-cols-[190px_1fr]">
                        <aside className="border-r border-white/10 p-5">
                            <div className="mb-8 text-sm font-bold">
                                DEV<span className="text-[#ff6b2c]">FLOW</span>
                            </div>

                            <div className="space-y-3 text-sm text-zinc-500">
                                <div className="rounded-lg bg-[#ff6b2c]/10 px-3 py-2 text-[#ff8a4c]">
                                    Overview
                                </div>
                                <div className="px-3 py-2">Projects</div>
                                <div className="px-3 py-2">Tasks</div>
                                <div className="px-3 py-2">Clients</div>
                                <div className="px-3 py-2">Analytics</div>
                            </div>
                        </aside>

                        <div className="p-7">
                            <p className="text-sm text-zinc-500">Good morning</p>

                            <h2 className="mt-1 text-2xl font-bold">
                                Your workspace
                            </h2>

                            <div className="mt-7 grid gap-4 sm:grid-cols-3">
                                {[
                                    ["12", "Projects"],
                                    ["48", "Tasks"],
                                    ["08", "Clients"],
                                ].map(([value, label]) => (
                                    <div
                                        key={label}
                                        className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                                    >
                                        <p className="text-3xl font-bold">{value}</p>
                                        <p className="mt-1 text-sm text-zinc-500">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 h-32 rounded-xl border border-white/10 bg-gradient-to-r from-[#ff6b2c]/10 to-transparent" />
                        </div>
                    </div>
                </motion.div>
            </section>

        </main>
    );
};

export default Landing;