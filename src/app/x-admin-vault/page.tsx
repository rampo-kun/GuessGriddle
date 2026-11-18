'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
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
    const wordleTeamCount = store.teams.length;
    const nextWordleStartingIndex = wordleTeamCount > 0
        ? store.wordleCountCompleted % wordleTeamCount
        : -1;
    const nextWordleStartingTeam = nextWordleStartingIndex >= 0
        ? store.teams[nextWordleStartingIndex]
        : undefined;
    const activeWordleTurnIndex = activeWordle && wordleTeamCount > 0
        ? (activeWordle.startingTeamIndex + activeWordle.guesses.length) % wordleTeamCount
        : -1;
    const activeWordleTeam = activeWordleTurnIndex >= 0
        ? store.teams[activeWordleTurnIndex]
        : undefined;
    const followingWordleTeam = activeWordle && wordleTeamCount > 0 && !activeWordle.isCompleted
        ? store.teams[(activeWordleTurnIndex + 1) % wordleTeamCount]
        : nextWordleStartingTeam;
    const nextPuzzleStartingTeam = activeWordle && !activeWordle.isCompleted && wordleTeamCount > 0
        ? store.teams[(activeWordle.startingTeamIndex + 1) % wordleTeamCount]
        : nextWordleStartingTeam;

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

                        {/* Tile Launcher */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {store.jeopardyBoard.map((q) => (
                                <button
                                    key={q.id}
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
                                    SECRET ACCEPTABLE RANGE: {activeQuestion.minLimit.toLocaleString()} –{' '}
                                    {activeQuestion.maxLimit.toLocaleString()} {activeQuestion.unit}
                                </div>
                                <div className="text-xs text-slate-400 mb-3">
                                    Exact Answer: {activeQuestion.actualAnswer.toLocaleString()}
                                </div>

                                <div className="flex gap-2">
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

                    {/* Wordle Control */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-black mb-4 text-emerald-700">
                            2. Wordle Circular Queue Control
                        </h2>

                        <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
                            <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
                                <p className="text-[11px] font-black uppercase tracking-[.18em] text-amber-300">Next Wordle · First team</p>
                                <p className="mt-1 text-2xl font-black text-white">
                                    {nextPuzzleStartingTeam?.name ?? 'Add teams to see the queue'}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-300">
                                    Circular queue · Start position {nextWordleStartingIndex >= 0 ? nextWordleStartingIndex + 1 : '—'} of {wordleTeamCount || '—'}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                                <p className="text-[11px] font-black uppercase tracking-[.18em] text-slate-400">Queue order for the next Wordle</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {wordleTeamCount > 0 ? store.teams.map((team, offset) => {
                                        const queueIndex = (nextWordleStartingIndex + offset) % wordleTeamCount;
                                        const isFirst = offset === 0;
                                        return (
                                            <span key={team.id} className={`rounded-full border px-3 py-1.5 text-xs font-extrabold ${isFirst ? 'border-amber-300 bg-amber-400 text-slate-950' : 'border-slate-600 bg-slate-800 text-slate-100'}`}>
                                                {offset + 1}. {store.teams[queueIndex].name}{isFirst ? ' · STARTS' : ''}
                                            </span>
                                        );
                                    }) : <span className="text-sm text-slate-400">No teams configured yet.</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {store.wordles.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => store.openWordle(w.id)}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm border ${w.isCompleted
                                            ? 'bg-slate-950 border-slate-700 text-slate-400'
                                            : 'bg-emerald-900/40 border-emerald-500 text-emerald-200 hover:bg-emerald-900/70'
                                        }`}
                                >
                                    Wordle #{w.number} ({w.targetWord})
                                    <span className="ml-2 block text-[10px] font-semibold opacity-80">
                                        Starts: {nextPuzzleStartingTeam?.name ?? 'Waiting for teams'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {activeWordle && (
                            <div className="bg-slate-950 border border-emerald-500 rounded-xl p-4">
                                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Playing now</p>
                                        <p className="mt-1 text-lg font-black text-white">{activeWordle.isCompleted ? 'Puzzle complete' : activeWordleTeam?.name ?? 'No team'}</p>
                                        <p className="text-[11px] text-slate-300">Turn {activeWordle.guesses.length + 1}</p>
                                    </div>
                                    <div className="rounded-lg border border-sky-500/60 bg-sky-500/10 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-sky-300">Next in this queue</p>
                                        <p className="mt-1 text-lg font-black text-white">{followingWordleTeam?.name ?? '—'}</p>
                                        <p className="text-[11px] text-slate-300">After the current guess</p>
                                    </div>
                                    <div className="rounded-lg border border-amber-500/60 bg-amber-500/10 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">First team next Wordle</p>
                                        <p className="mt-1 text-lg font-black text-white">{nextPuzzleStartingTeam?.name ?? '—'}</p>
                                        <p className="text-[11px] text-slate-300">Queue rotates by one team</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-3 gap-3">
                                    <span className="text-sm font-bold text-amber-300">
                                        SECRET WORD: {activeWordle.targetWord}
                                    </span>
                                    <button
                                        onClick={() => store.closeWordleAsComplete()}
                                        className="text-xs bg-rose-600 text-white px-3 py-1 rounded font-bold"
                                    >
                                        Mark Done & Return to Grid
                                    </button>
                                </div>

                                <div className="mb-3 text-xs text-slate-600">
                                    Enter the team's complete word. The projector will not reveal the answer length.
                                    Green = correct position; yellow = correct letter, wrong position. Each yellow
                                    letter can score only once per puzzle, and each green position can score only once.
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <input
                                        type="text"
                                        placeholder="Team's full-word guess"
                                        value={wordleGuessInput}
                                        onChange={(e) => setWordleGuessInput(e.target.value.replace(/[^a-z]/gi, '').toUpperCase())}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && wordleGuessInput.trim()) {
                                                store.submitWordleGuess(wordleGuessInput);
                                                setWordleGuessInput('');
                                            }
                                        }}
                                        className="min-w-0 flex-1 bg-white border border-slate-700 rounded-lg px-3 py-2 uppercase font-mono"
                                    />
                                    <button
                                        disabled={!wordleGuessInput.trim()}
                                        onClick={() => {
                                            store.submitWordleGuess(wordleGuessInput);
                                            setWordleGuessInput('');
                                        }}
                                        className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white px-5 py-2 rounded-lg font-bold"
                                    >
                                        Submit Word
                                    </button>
                                </div>
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
                                onClick={() => store.drawNextMarketWord()}
                                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-bold text-sm"
                            >
                                Reveal Next Market Word
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
                                    Skip Turn
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
                            <label className="text-xs">
                                Wordle New Yellow Pts
                                <input
                                    type="number"
                                    value={store.config.wordleNewYellowPoints}
                                    onChange={(e) =>
                                        store.updateConfig({
                                            wordleNewYellowPoints: Number(e.target.value),
                                        })
                                    }
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
                            </label>
                            <label className="text-xs">
                                Wordle New Green Pts
                                <input
                                    type="number"
                                    value={store.config.wordleNewGreenPoints}
                                    onChange={(e) =>
                                        store.updateConfig({
                                            wordleNewGreenPoints: Number(e.target.value),
                                        })
                                    }
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
                            </label>
                            <label className="text-xs">
                                Wordle Full Solve Bonus
                                <input
                                    type="number"
                                    value={store.config.wordleExactWordBonus}
                                    onChange={(e) =>
                                        store.updateConfig({
                                            wordleExactWordBonus: Number(e.target.value),
                                        })
                                    }
                                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-2"
                                />
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
                                <button
                                    onClick={() => {
                                        if (!wWord || !wDef) return;
                                        store.addWordle(wWord, wDef);
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