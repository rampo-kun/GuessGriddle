'use client';
import { useGameStore } from '@/store/useGameStore';
export default function Round1Choice() {
 const {teams,jeopardyTurnIndex,lastRound1Mode,round1ModeStreak,chooseRound1Mode}=useGameStore();
 const team=teams[jeopardyTurnIndex];
 const jBlocked=lastRound1Mode==='JEOPARDY'&&round1ModeStreak>=2;
 const wBlocked=lastRound1Mode==='WORDLE_SELECT'&&round1ModeStreak>=2;
 return <main className="min-h-screen w-screen bg-[#f5e8cc] text-[#24211d] flex flex-col items-center justify-center p-8">
 <p className="text-sm font-black uppercase tracking-[.3em] text-[#a82e22]">Round 1 · Team turn</p>
 <h1 className="mt-4 text-4xl md:text-6xl font-black text-center">{team?.name??'No teams'} is playing</h1>
 <p className="mt-4 text-lg font-bold text-[#766e61]">Choose your challenge</p>
 <div className="mt-10 grid w-full max-w-3xl grid-cols-1 md:grid-cols-2 gap-6">
 <button disabled={jBlocked} onClick={()=>chooseRound1Mode('JEOPARDY')} className="rounded-3xl border-4 border-[#e9b949] bg-[#303b50] p-10 text-left text-[#fff7e8] shadow-xl disabled:opacity-40"><span className="text-4xl font-black">JEOPARDY</span><span className="mt-3 block text-sm font-bold">Choose a guesstimate question from the grid</span>{jBlocked&&<span className="mt-4 block text-xs uppercase font-black text-amber-300">Played twice in a row · choose Wordle</span>}</button>
 <button disabled={wBlocked} onClick={()=>chooseRound1Mode('WORDLE_SELECT')} className="rounded-3xl border-4 border-emerald-600 bg-[#fff7e8] p-10 text-left text-[#24211d] shadow-xl disabled:opacity-40"><span className="text-4xl font-black text-emerald-800">WORDLE</span><span className="mt-3 block text-sm font-bold">Solve a word puzzle for points</span>{wBlocked&&<span className="mt-4 block text-xs uppercase font-black text-rose-700">Played twice in a row · choose Jeopardy</span>}</button>
 </div><div className="mt-10 flex flex-wrap justify-center gap-3">{teams.map((t,i)=><div key={t.id} className={`rounded-xl px-4 py-3 ${i===jeopardyTurnIndex?'bg-[#e9b949]':'bg-white/60'}`}><b>{t.name}</b><div className="text-sm">{t.score} pts</div></div>)}</div></main>;
}
