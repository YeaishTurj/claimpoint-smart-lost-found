export function Header({ authToken, onLogout }) {
  return (
    <header className="mx-auto max-w-5xl px-7 py-8">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md shadow-lg">
        <div className="text-lg font-bold tracking-tight text-white">
          ClaimPoint
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-gray-200">
            Smart Lost &amp; Found
          </span>
          {authToken ? (
            <button
              onClick={onLogout}
              className="rounded-lg border border-white/20 bg-transparent px-3 py-2 text-xs text-gray-200 transition hover:border-white/40 hover:bg-white/10"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
