import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-black mb-4">GuessGriddle • X-Insights</h1>
      <p className="text-slate-400 mb-8 max-w-md">
        Open the Smartboard Display in a window dragged to the projector, and keep the
        Admin Vault on your laptop screen.
      </p>
      <div className="flex gap-4">
        <Link
          href="/projector"
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-lg"
        >
          Launch Smartboard Display
        </Link>
        <Link
          href="/x-admin-vault"
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl font-bold text-lg"
        >
          Open Admin Vault
        </Link>
      </div>
    </div>
  );
}