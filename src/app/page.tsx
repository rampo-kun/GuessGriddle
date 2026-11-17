import Link from "next/link";
import { ArrowUpRight, MonitorPlay, SlidersHorizontal, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full border-[32px] border-[#e9b949]/25" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full border-[44px] border-[#c83d2d]/10" />
      <section className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#24211d]/15 bg-[#fff7e8] shadow-[0_24px_80px_rgba(58,43,23,.16)]">
        <div className="flex items-center justify-between border-b border-[#24211d]/10 bg-[#303b50] px-6 py-4 text-[#fff7e8] sm:px-10">
          <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-[#c83d2d]"/><span className="h-3 w-3 rounded-full bg-[#e9b949]"/><span className="h-3 w-3 rounded-full bg-[#78a77a]"/><span className="ml-2 text-xs font-bold uppercase tracking-[.24em] text-[#f5e8cc]/75">X-Insights Broadcast Network</span></div>
          <span className="hidden text-xs font-bold uppercase tracking-[.18em] text-[#f5e8cc]/70 sm:block">Live game control</span>
        </div>
        <div className="grid gap-10 px-7 py-12 sm:px-12 sm:py-16 md:grid-cols-[1.15fr_.85fr] md:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c83d2d]/25 bg-[#c83d2d]/8 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#c83d2d]"><Sparkles size={15}/> XIME Bangalore presents</div>
            <p className="mb-2 text-sm font-black uppercase tracking-[.28em] text-[#766e61]">The not-so-serious competition</p>
            <h1 className="text-6xl font-black leading-[.88] tracking-[-.065em] text-[#24211d] sm:text-7xl lg:text-8xl">GUESS<span className="text-[#c83d2d]">GRIDDLE</span><span className="mt-3 block text-2xl font-black tracking-[-.02em] text-[#9b6a08] sm:text-3xl">Think fast. Guess wildly. Pitch badly.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#62594d] sm:text-lg">Your control room for the X-Insights game show. Run the quiz, drop a surprise Wordle, auction ridiculous words and crown the best business pitch.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/projector" className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#c83d2d] px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#c83d2d]/20 hover:bg-[#a82e22]"><MonitorPlay size={18}/> Launch projector <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></Link>
              <Link href="/x-admin-vault" className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-[#303b50] px-6 py-4 text-sm font-black uppercase tracking-wider text-[#303b50] hover:bg-[#303b50] hover:text-[#fff7e8]"><SlidersHorizontal size={18}/> Open host dashboard</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-[28px] border-[8px] border-[#303b50] bg-[#24211d] p-3 shadow-[0_24px_45px_rgba(36,33,29,.24)]"><div className="rounded-[17px] bg-[#f5e8cc] p-5">
              <div className="mb-5 flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[.2em] text-[#766e61]">Tonight's scoreboard</span><span className="rounded-full bg-[#c83d2d] px-2 py-1 text-[9px] font-black tracking-widest text-white">ON AIR</span></div>
              <div className="grid grid-cols-3 gap-2">{["QUIZ","GUESS","PITCH"].map((item,i)=><div key={item} className={`rounded-xl p-3 text-center ${i===1?"bg-[#e9b949]":"bg-[#303b50] text-[#fff7e8]"}`}><div className={`text-[9px] font-black tracking-widest ${i===1?"text-[#24211d]/65":"text-[#fff7e8]/60"}`}>ROUND 0{i+1}</div><div className={`mt-2 text-xs font-black ${i===1?"text-[#24211d]":"text-[#fff7e8]"}`}>{item}</div></div>)}</div>
              <div className="mt-5 rounded-xl border-2 border-dashed border-[#c83d2d]/40 p-4 text-center"><div className="text-4xl font-black tracking-[.16em] text-[#c83d2d]">???</div><div className="mt-2 text-[10px] font-black uppercase tracking-[.2em] text-[#766e61]">Your team. Your moment.</div></div>
            </div></div>
            <div className="mx-auto mt-3 h-5 w-28 rounded-b-2xl bg-[#303b50]"/><div className="mx-auto h-2 w-44 rounded-full bg-[#24211d]/20"/><div className="absolute -right-3 -top-5 rotate-6 rounded-lg bg-[#e9b949] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#24211d] shadow-lg">Let's play!</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#24211d]/10 bg-[#f0dfbf] px-7 py-4 text-[10px] font-black uppercase tracking-[.2em] text-[#766e61] sm:px-10"><span>One projector. Many questionable decisions.</span><span>Made for X-Insights · XIME Bangalore</span></div>
      </section>
    </main>
  );
}
