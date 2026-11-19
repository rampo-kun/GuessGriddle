'use client';

import { useEffect, useState } from 'react';
import { useGameStore, isRound1ModeLocked } from '@/store/useGameStore';
import { ActiveView } from '@/types/game';

export default function AdminVaultPage() {
    const store = useGameStore();
    const [tab, setTab] = useState<'LIVE_R1' | 'LIVE_R2' | 'SETUP'>('LIVE_R1');

    // Local form states
    const [newTeamName, setNewTeamName] = useState('');
    const [guessInput, setGuessInput] = useState('');
    const [wordleGuessInput, setWordleGuessInput] = useState('');

    // New Question / Wordle builders
    const [qCat, setQCat] = useState('');
    const [qPts, setQPts] = useState(100);
    const [qText, setQText] = useState('');
    const [qAns, setQAns] = useState(0);
    const [qMin, setQMin] = useState(0);
    const [qMax, setQMax] = useState(0);
    const [qUnit, setQUnit] = useState('');

    const [wWord, setWWord] = useState('');
    const [wDef, setWDef] = useState('');
    const [wDifficulty, setWDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

    // Round 2 Assign/Steal selectors
    const [targetTeamId, setTargetTeamId] = useState('');

    useEffect(() => {
        store.hydrateFromStorage();
    }, []);

    const navButtons: { label: string; view: ActiveView }[] = [
        { label: 'Lobby', view: 'LOBBY' },
        { label: 'R1: Jeopardy', view: 'JEOPARDY' },
        { label: 'R1: Wordle Grid', view: 'WORDLE_SELECT' },
        { label: 'R1: Standings', view: 'R1_LEADERBOARD' },
        { label: 'R2: Word Market', view: 'ROUND2_MARKET' },
        { label: 'Finale: Wiki Race', view: 'WIKIRACE_FINALE' },
    ];

    const activeQuestion = store.jeopardyBoard.find(
        (q) => q.id === store.activeJeopardyId
    );
    const activeWordle = store.wordles.find((w) => w.id === store.activeWordleId);
    const currentJeopardyTeam = store.teams[store.jeopardyTurnIndex];
    const currentR2Team = store.teams[store.r2TurnIndex];
    const activeWordleTeam = activeWordle
        ? store.teams.find((team) => team.id === activeWordle.assignedTeamId)
        : undefined;
    const selectedWordleTeamId = currentJeopardyTeam?.id ?? '';
    const jeopardyLocked = isRound1ModeLocked(store.round1ModeByTeam, currentJeopardyTeam?.id, 'JEOPARDY');
    const wordleLocked = isRound1ModeLocked(store.round1ModeByTeam, currentJeopardyTeam?.id, 'WORDLE_SELECT');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            {/* Top Smartboard View Switcher */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                        Host Control Vault (Keep Hidden from Smartboard)
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {navButtons.map((btn) => (
                            <button
                                key={btn.view}
                                onClick={() => store.setView(btn.view)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${store.activeView === btn.view
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    {(['LIVE_R1', 'LIVE_R2', 'SETUP'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm ${tab === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'
                                }`}
                        >
                            {t === 'LIVE_R1'
                                ? 'Round 1 Controls'
                                : t === 'LIVE_R2'
                                    ? 'Round 2 Controls'
                                    : 'Setup & Rules'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Live Score Override Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {store.teams.map((t, idx) => (
                    <div
                        key={t.id}
                        className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between"
                    >
                        <div>
                            <div className="font-bold text-sm">
                                {t.name}{' '}
                                {idx === store.jeopardyTurnIndex && (
                                    <span className="text-xs text-amber-400">(R1 Turn)</span>
                                )}
                            </div>
                            <div className="text-lg font-black text-emerald-400">{t.score} pts</div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => store.adjustTeamScore(t.id, -50)}
                                className="px-2 py-1 bg-slate-800 rounded text-xs font-bold hover:bg-rose-900"
                            >
                                -50
                            </button>
                            <button
                                onClick={() => store.adjustTeamScore(t.id, 50)}
                                className="px-2 py-1 bg-slate-800 rounded text-xs font-bold hover:bg-emerald-900"
                            >
                                +50
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* TAB 1: LIVE ROUND 1 */}
            {tab === 'LIVE_R1' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Jeopardy Control */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-black mb-4 text-indigo-400">
                            1. Jeopardy & Guesstimate Control
                        </h2>

                        <button onClick={() => store.startRound1Choice()} className="mb-4 rounded-lg bg-amber-500 px-4 py-2 font-black text-slate-950">Show Team Choice Screen</button>\n                        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-black text-amber-300">Round 1 thinking timer</p>
                                    <p className="text-xs text-slate-400">When it reaches zero, the team still gets time to say its answer and the host can enter it.</p>
                                </div>
                                <div className="text-xs font-bold text-amber-200">{store.roundTimerPhase === 'thinking' ? 'THINKING' : store.roundTimerPhase === 'answer' ? 'ANSWER NOW' : 'IDLE'}</div>
                            </div>
                            <label className="block text-xs font-bold text-slate-300">Timer duration (seconds)
                                <input type="number" min="10" max="180" value={store.config.roundTimerSeconds} onChange={(e) => store.updateConfig({ roundTimerSeconds: Math.max(10, Math.min(180, Number(e.target.value) || 45)) })} className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2" />
                            </label>
                            <div className="flex gap-2">
                                <button onClick={() => store.startRoundTimer()} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold">Restart thinking time</button>
                                <button onClick={() => store.endThinkingTime()} disabled={store.roundTimerPhase !== 'thinking'} className="rounded-lg bg-rose-700 disabled:opacity-40 px-3 py-2 text-xs font-bold">End thinking time</button>
                                <button onClick={() => store.resetRoundTimer()} className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold">Hide timer</button>
                            </div>
                        </div>

                        <div className="mb-4 flex items-center gap-3">
                            <span className="text-sm text-slate-400">Active Team:</span>
                            <select
                                value={store.jeopardyTurnIndex}
                                onChange={(e) => store.setJeopardyTurn(Number(e.target.value))}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-bold"
                            >
                                {store.teams.map((t, i) => (
                                    <option key={t.id} value={i}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {jeopardyLocked && (
                            <p className="mb-3 rounded-lg bg-amber-950/50 p-3 text-sm font-bold text-amber-300">
                                {currentJeopardyTeam?.name} has played Jeopardy twice in a row and must play Wordle this turn.
                            </p>
                        )}
                        {/* Tile Launcher */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {store.jeopardyBoard.map((q) => (
                                <button
                                    key={q.id}
                                    disabled={jeopardyLocked}
                                    onClick={() => {
                                        store.setView('JEOPARDY');
                                        store.selectJeopardyTile(q.id);
                                    }}
                                    className={`p-3 rounded-xl text-left border text-sm ${q.isCompleted
                                            ? 'bg-slate-950 border-slate-800 text-slate-500'
                                            : 'bg-slate-800 border-indigo-500/40 hover:border-indigo-400'
                                        }`}
                                >
                                    <div className="font-bold">
                                        {q.category} — {q.points}
                                    </div>
                                    <div className="text-xs truncate text-slate-400">{q.question}</div>
                                </button>
                            ))}
                        </div>

                        {/* Secret Answer & Guess Input */}
                        {activeQuestion && (
                            <div className="bg-slate-950 border border-indigo-500 rounded-xl p-4">
                                <div className="text-sm font-bold text-amber-400 mb-1">
                                    FULL CREDIT ±{25 + (Math.max(1, Math.min(5, Math.round(activeQuestion.points / 100))) - 1) * 5}% · HALF CREDIT ±{50 + (Math.max(1, Math.min(5, Math.round(activeQuestion.points / 100))) - 1) * 5}%
                                </div>
                                <div className="text-xs text-slate-400 mb-3">
                                    Ballpark answer: {activeQuestion.actualAnswer.toLocaleString()} {activeQuestion.unit}
                                </div>

                                {store.lastGuesstimateResult && (
                                    <p className="mb-3 rounded-lg bg-emerald-950/50 p-3 text-sm font-bold text-emerald-300">
                                        Result is live on the projector. Advance only when the host is ready.
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <input
                                        type="number"
                                        placeholder={`Enter ${currentJeopardyTeam?.name}'s guess...`}
                                        value={guessInput}
                                        onChange={(e) => setGuessInput(e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
                                    />
                                    <button
                                        onClick={() => {
                                            if (!guessInput) return;
                                            store.submitGuesstimate(Number(guessInput));
                                            setGuessInput('');
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold"
                                    >
                                        Evaluate
                                    </button>
                                    {store.lastGuesstimateResult && (
                                        <button
                                            onClick={() => {
                                                store.revealNextRound1Turn();
                                                setGuessInput('');
                                            }}
                                            className="bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-lg font-black text-slate-950"
                                        >
                                            Reveal Result Shown · Next Team
                                        </button>
                                    )}
                                    <button
                                        onClick={() => store.selectJeopardyTile(null)}
                                        className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
                                    >
                                        Close Modal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Wordle Bonus Control — independent of the Jeopardy turn queue */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                        <div>
                            <h2 className="text-xl font-black text-emerald-400">2. Wordle Bonus Challenge</h2>
                            <p className="text-xs text-slate-400 mt-1">Choose any team and difficulty. A team may play multiple different Wordle puzzles; each puzzle can only be assigned once.</p>
                        </div>

                        {wordleLocked && (
                            <p className="rounded-lg bg-amber-950/50 p-3 text-sm font-bold text-amber-300">
                                {currentJeopardyTeam?.name} has played Wordle twice in a row and must play Jeopardy this turn.
                            </p>
                        )}
                        <div className="rounded-lg bg-slate-950 p-3 text-sm">Wordle team: <strong className="text-emerald-300">{currentJeopardyTeam?.name ?? 'No active team'}</strong></div>

                        {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                            <div key={difficulty} className="space-y-2">
                                <h3 className="text-xs font-black uppercase tracking-widest text-amber-300">{difficulty} · {difficulty === 'easy' ? '150' : difficulty === 'medium' ? '220' : '300'} max points</h3>
                                <div className="flex flex-wrap gap-2">
                                    {store.wordles.filter((p) => (p.difficulty ?? 'medium') === difficulty).map((puzzle) => {
                                        const puzzleAssignedToAnotherTeam = Boolean(puzzle.assignedTeamId && puzzle.assignedTeamId !== selectedWordleTeamId);
                                        return (
                                        <button key={puzzle.id} disabled={puzzle.isCompleted || !selectedWordleTeamId || puzzleAssignedToAnotherTeam || wordleLocked} onClick={() => store.openWordle(puzzle.id, selectedWordleTeamId)} className={`px-3 py-2 rounded-lg border text-sm font-bold ${puzzle.isCompleted ? 'bg-slate-950 border-slate-700 text-slate-500' : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100 hover:bg-emerald-900'}`}>
                                            #{puzzle.number} · {puzzle.targetWord} {puzzle.isCompleted ? '✓' : puzzleAssignedToAnotherTeam ? '· Assigned' : ''}
                                        </button>
                                    )})}
                                </div>
                            </div>
                        ))}

                        {activeWordle && (
                            <div className="bg-slate-950 border border-emerald-500 rounded-xl p-4 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-emerald-300">Playing team</p>
                                        <p className="text-xl font-black">{activeWordleTeam?.name ?? 'Team removed'} · {activeWordle.difficulty ?? 'medium'}</p>
                                        <p className="text-xs text-slate-400">Guess {activeWordle.guesses.length + 1} of {store.config.wordleMaxGuesses} · Only a solved guess scores; points decrease after each attempt</p>
                                    </div>
                                    {activeWordle.isCompleted ? (
                                        <button onClick={() => store.closeWordleAsComplete()} className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-2 rounded font-black">Reveal Result Shown · Next Team</button>
                                    ) : (
                                        <button onClick={() => store.closeWordleAsComplete()} className="text-xs bg-rose-600 text-white px-3 py-2 rounded font-bold">End Wordle & Return to Grid</button>
                                    )}
                                </div>
                                <p className="text-sm text-amber-300">SECRET WORD: {activeWordle.targetWord}</p>
                                <div className="text-xs text-slate-400">Scoring: a first-guess solve earns full points; each later attempt earns a smaller share (linear decrease). Failed guesses earn 0 points.</div>
                                {!activeWordle.isCompleted && (
                                    <div className="flex flex-wrap gap-2">
                                        <input type="text" placeholder={`Enter ${activeWordle.targetWord.length}-letter word`} maxLength={activeWordle.targetWord.length} value={wordleGuessInput} onChange={(e) => setWordleGuessInput(e.target.value.replace(/[^a-z]/gi, '').toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter' && wordleGuessInput.trim()) { store.submitWordleGuess(wordleGuessInput); setWordleGuessInput(''); } }} className="min-w-0 flex-1 bg-white text-slate-950 border border-slate-700 rounded-lg px-3 py-2 uppercase font-mono" />
                                        <button disabled={!wordleGuessInput.trim()} onClick={() => { store.submitWordleGuess(wordleGuessInput); setWordleGuessInput(''); }} className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white px-5 py-2 rounded-lg font-bold">Submit Guess</button>
                                    </div>
                                )}
                                {activeWordle.isCompleted && <p className="font-bold text-emerald-300">Challenge complete. Answer: {activeWordle.targetWord}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: LIVE ROUND 2 */}
            {tab === 'LIVE_R2' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-purple-400">
                                Round 2: Word Market & Steal Controls
                            </h2>
                            <p className="text-sm text-slate-400">
                                Current Turn: <strong>{currentR2Team?.name}</strong> (
                                {currentR2Team?.score} pts)
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => store.initializeRound2()}
                                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl font-bold text-sm"
                            >
                                Deal Starting Words
                            </button>
                            <button
                                disabled={Boolean(store.currentMarketWord)}
                                onClick={() => store.drawNextMarketWord()}
                                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 px-4 py-2 rounded-xl font-bold text-sm"
                            >
                                {store.currentMarketWord ? 'Current Word Still in Auction' : 'Reveal Next Market Word'}
                            </button>
                            <button
                                onClick={() => store.r2AutoFillRemaining()}
                                className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-xl font-bold text-sm"
                            >
                                Auto-Fill Empty Slots
                            </button>
                        </div>
                    </div>

                    {store.currentMarketWord && currentR2Team && (
                        <div className="bg-slate-950 border border-purple-500 rounded-2xl p-5 space-y-4">
                            <div className="text-lg">
                                Market Word:{' '}
                                <strong className="text-2xl text-amber-400">
                                    {store.currentMarketWord}
                                </strong>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    disabled={
                                        currentR2Team.score < store.config.r2BuyCost ||
                                        currentR2Team.words.length >= 3
                                    }
                                    onClick={() => store.r2BuyWord(currentR2Team.id)}
                                    className="bg-emerald-600 disabled:opacity-40 px-4 py-2 rounded-xl font-bold"
                                >
                                    1. Buy for {currentR2Team.name} (-{store.config.r2BuyCost})
                                </button>

                                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700">
                                    <select
                                        value={targetTeamId}
                                        onChange={(e) => setTargetTeamId(e.target.value)}
                                        className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm"
                                    >
                                        <option value="">Select Opponent...</option>
                                        {store.teams
                                            .filter((t) => t.id !== currentR2Team.id)
                                            .map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} ({t.words.length}/3 slots)
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        disabled={
                                            !targetTeamId || currentR2Team.score < store.config.r2AssignCost
                                        }
                                        onClick={() => {
                                            store.r2AssignWord(currentR2Team.id, targetTeamId);
                                            setTargetTeamId('');
                                        }}
                                        className="bg-amber-600 disabled:opacity-40 px-4 py-1.5 rounded-lg font-bold text-sm"
                                    >
                                        2. Assign (-{store.config.r2AssignCost})
                                    </button>
                                </div>

                                <button
                                    onClick={() => store.r2SkipTurn()}
                                    className="bg-slate-700 px-4 py-2 rounded-xl font-bold text-sm"
                                >
                                    Skip · Pass Same Word
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Steal Panel (Can be used on current team's turn) */}
                    {currentR2Team && (
                        <div className="bg-slate-950 border border-rose-500/40 rounded-2xl p-5">
                            <h3 className="font-bold text-rose-400 mb-3">
                                3. Steal an Opponent&apos;s Acquired Word (Cost: {store.config.r2StealCost}{' '}
                                pts • Victim gets {store.config.r2StealRefundPercent}% of Buy cost back)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {store.teams
                                    .filter((t) => t.id !== currentR2Team.id)
                                    .map((opp) => (
                                        <div
                                            key={opp.id}
                                            className="bg-slate-900 p-3 rounded-xl border border-slate-800"
                                        >
                                            <div className="font-bold text-sm mb-2">{opp.name}</div>
                                            {opp.words.length === 0 ? (
                                                <div className="text-xs text-slate-500">No stealable words</div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {opp.words.map((w, idx) => (
                                                        <button
                                                            key={idx}
                                                            disabled={
                                                                currentR2Team.score < store.config.r2StealCost ||
                                                                currentR2Team.words.length >= 3
                                                            }
                                                            onClick={() =>
                                                                store.r2StealWord(currentR2Team.id, opp.id, idx)
                                                            }
                                                            className="bg-rose-900/60 hover:bg-rose-700 disabled:opacity-40 border border-rose-500 px-3 py-1 rounded-lg text-xs font-bold"
                                                        >
                                                            Steal &ldquo;{w}&rdquo;
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    <section className="rounded-2xl border border-amber-500/40 bg-slate-950 p-5 space-y-4">
                        <div>
                            <h3 className="text-lg font-black text-amber-300">Wikipedia Race: Page Check-off & Winner</h3>
                            <p className="text-xs text-slate-400">Mark pages as visited as soon as a team reaches them. They can be completed in any order.</p>
                        </div>
                        {store.teams.map((team) => {
                            const pages = [team.startingWord, ...(team.words ?? [])].filter(Boolean);
                            const visited = team.visitedWords ?? [];
                            return <div key={team.id} className="rounded-xl border border-slate-800 p-3">
                                <div className="mb-2 flex items-center justify-between gap-2"><strong>{team.name}</strong><span className="text-xs text-emerald-300">{pages.filter((word) => visited.includes(word)).length}/{pages.length} pages visited</span></div>
                                <div className="flex flex-wrap gap-2">{pages.map((word) => <button key={word} onClick={() => store.toggleWikiWordVisited(team.id, word)} className={`rounded-lg border px-3 py-2 text-xs font-bold ${visited.includes(word) ? 'border-emerald-400 bg-emerald-900/50 text-emerald-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>{visited.includes(word) ? '✓ ' : ''}{word}</button>)}</div>
                            </div>;
                        })}
                        <div className="border-t border-slate-800 pt-4"><p className="mb-2 text-sm font-bold text-slate-200">Choose the winner (host decision)</p><div className="flex flex-wrap gap-2">{store.teams.map((team) => <button key={team.id} onClick={() => store.chooseWikiWinner(team.id)} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-black text-slate-950 hover:bg-amber-500">Display {team.name} as Winner</button>)}<button onClick={() => store.chooseWikiWinner(null)} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold">Return to Wiki Race</button></div></div>
                    </section>
                </div>
            )}

            {/* TAB 3: SETUP & CONFIGURATOR */}
            {tab === 'SETUP' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Team Manager & Scoring Rules */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-black mb-3">Manage Teams</h3>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="New team name..."
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2"
                                />
                                <button
                                    onClick={() => {
                                        if (!newTeamName.trim()) return;
                                        store.addTeam(newTeamName);
                                        setNewTeamName('');
                                    }}
                                    className="bg-indigo-600 px-4 py-2 rounded-lg font-bold"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {store.teams.map((t) => (
                                    <span
                                        key={t.id}
                                        className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                                    >
                                        {t.name}
                                        <button
                                            onClick={() => store.removeTeam(t.id)}
                                            className="text-rose-400 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Point & Pricing Economics */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                            <div className="col-span-2 rounded-lg border border-emerald-700/50 bg-emerald-950/30 p-3 text-xs text-slate-300">
                                <p className="font-black text-emerald-300">Wordle reward rules</p>
                                <p>Maximum {store.config.wordleMaxGuesses} guesses. Points are awarded only when the selected team solves the puzzle; the reward decreases with every guess and is capped by difficulty.</p>
                            </div>
                            <label className="text-xs">
                                Wordle Maximum Guesses
                                <input
                                    type="number"
                                    min="1"
                                    max="6"
                                    value={store.config.wordleMaxGuesses}
                                    onChange={(e) => store.updateConfig({ wordleMaxGuesses: Math.max(1, Math.min(6, Number(e.target.value) || 6)) })}
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
                            </label>
                            <label className="text-xs">
                                Wordle Green Letter Points
                                <input type="number" min="1" value={store.config.wordleNewGreenPoints} onChange={(e) => store.updateConfig({ wordleNewGreenPoints: Math.max(1, Number(e.target.value) || 25) })} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2" />
                            </label>
                            <label className="text-xs">
                                Wordle Yellow Letter Points
                                <input type="number" min="1" value={store.config.wordleNewYellowPoints} onChange={(e) => store.updateConfig({ wordleNewYellowPoints: Math.max(1, Number(e.target.value) || 12) })} className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2" />
                            </label>
                            <label className="text-xs">
                                R2 Buy Cost
                                <input
                                    type="number"
                                    value={store.config.r2BuyCost}
                                    onChange={(e) =>
                                        store.updateConfig({ r2BuyCost: Number(e.target.value) })
                                    }
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
                            </label>
                            <label className="text-xs">
                                R2 Assign Cost
                                <input
                                    type="number"
                                    value={store.config.r2AssignCost}
                                    onChange={(e) =>
                                        store.updateConfig({ r2AssignCost: Number(e.target.value) })
                                    }
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
                            </label>
                            <label className="text-xs">
                                R2 Steal Cost
                                <input
                                    type="number"
                                    value={store.config.r2StealCost}
                                    onChange={(e) =>
                                        store.updateConfig({ r2StealCost: Number(e.target.value) })
                                    }
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
                            </label>
                            <label className="text-xs col-span-2">
                                Steal Refund % to Victim (of Buy Cost)
                                <input
                                    type="number"
                                    value={store.config.r2StealRefundPercent}
                                    onChange={(e) =>
                                        store.updateConfig({
                                            r2StealRefundPercent: Number(e.target.value),
                                        })
                                    }
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
                            </label>
                        </div>

                        <button
                            onClick={() => store.resetFullGame()}
                            className="w-full bg-rose-900/60 hover:bg-rose-800 border border-rose-500 py-2 rounded-xl text-sm font-bold"
                        >
                            Reset Entire Competition State
                        </button>
                    </div>

                    {/* Add Guesstimate & Wordle Content */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-black mb-3">Add Jeopardy Guesstimate</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    placeholder="Category (e.g. FINANCE)"
                                    value={qCat}
                                    onChange={(e) => setQCat(e.target.value.toUpperCase())}
                                    className="bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Points (e.g. 300)"
                                    value={qPts}
                                    onChange={(e) => setQPts(Number(e.target.value))}
                                    className="bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                                <input
                                    placeholder="Guesstimate Question"
                                    value={qText}
                                    onChange={(e) => setQText(e.target.value)}
                                    className="col-span-2 bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Exact Answer"
                                    value={qAns || ''}
                                    onChange={(e) => setQAns(Number(e.target.value))}
                                    className="bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                                <input
                                    placeholder="Unit (e.g. crores, users)"
                                    value={qUnit}
                                    onChange={(e) => setQUnit(e.target.value)}
                                    className="bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Min Acceptable Limit"
                                    value={qMin || ''}
                                    onChange={(e) => setQMin(Number(e.target.value))}
                                    className="bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Acceptable Limit"
                                    value={qMax || ''}
                                    onChange={(e) => setQMax(Number(e.target.value))}
                                    className="bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (!qCat || !qText.trim()) return;
                                    store.addJeopardyQuestion({
                                        category: qCat,
                                        points: qPts,
                                        question: qText,
                                        actualAnswer: qAns,
                                        minLimit: qMin,
                                        maxLimit: qMax,
                                        unit: qUnit,
                                    });
                                    setQText('');
                                }}
                                className="mt-2 w-full bg-indigo-600 py-2 rounded-lg font-bold text-sm"
                            >
                                Add Jeopardy Tile
                            </button>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <h3 className="text-lg font-black mb-3">Add Wordle Puzzle</h3>
                            <div className="space-y-2">
                                <input
                                    placeholder="Target Word (e.g. ALPHA)"
                                    value={wWord}
                                    onChange={(e) => setWWord(e.target.value.toUpperCase())}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm uppercase"
                                />
                                <input
                                    placeholder="Definition Clue shown on screen"
                                    value={wDef}
                                    onChange={(e) => setWDef(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm"
                                />
                                <select value={wDifficulty} onChange={(e) => setWDifficulty(e.target.value as 'easy' | 'medium' | 'hard')} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm">
                                    <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                                </select>
                                <button
                                    onClick={() => {
                                        if (!wWord || !wDef) return;
                                        store.addWordle(wWord, wDef, wDifficulty);
                                        setWWord('');
                                        setWDef('');
                                    }}
                                    className="w-full bg-emerald-600 py-2 rounded-lg font-bold text-sm"
                                >
                                    Add Wordle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}