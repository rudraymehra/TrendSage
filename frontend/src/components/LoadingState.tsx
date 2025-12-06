'use client';

export default function LoadingState() {
  return (
    <div className="animate-fade-in">
      {/* Main loading card */}
      <div className="card-glass rounded-3xl overflow-hidden">
        {/* Header skeleton */}
        <div className="p-8 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="skeleton w-6 h-6 rounded-lg" />
            <div className="skeleton w-32 h-5 rounded-lg" />
            <div className="skeleton w-20 h-5 rounded-lg" />
          </div>
          <div className="skeleton w-2/3 h-10 rounded-xl mb-6" />
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="skeleton w-full h-3 rounded mb-2" />
              <div className="skeleton w-full h-3 rounded" />
            </div>
          </div>
        </div>

        {/* Overview skeleton */}
        <div className="p-8 border-b border-zinc-800">
          <div className="skeleton w-28 h-7 rounded-lg mb-5" />
          <div className="space-y-3">
            <div className="skeleton w-full h-5 rounded" />
            <div className="skeleton w-full h-5 rounded" />
            <div className="skeleton w-3/4 h-5 rounded" />
          </div>
        </div>

        {/* Takeaways skeleton */}
        <div className="p-8 border-b border-zinc-800">
          <div className="skeleton w-36 h-7 rounded-lg mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30">
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="skeleton w-full h-5 rounded mb-2" />
                  <div className="skeleton w-2/3 h-5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart skeleton */}
        <div className="p-8 border-b border-zinc-800">
          <div className="skeleton w-40 h-7 rounded-lg mb-6" />
          <div className="skeleton w-full h-56 rounded-xl" />
        </div>

        {/* Sources skeleton */}
        <div className="p-8">
          <div className="skeleton w-28 h-7 rounded-lg mb-6" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30">
                <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="skeleton w-3/4 h-5 rounded mb-2" />
                  <div className="skeleton w-1/2 h-4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading message with animated dots */}
      <div className="mt-10 text-center">
        <div className="inline-flex flex-col items-center">
          {/* Animated rings */}
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          {/* Status text */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Analyzing Market Trends
            </h3>
            <div className="flex items-center gap-2 text-zinc-400">
              <span>Searching scholarly databases</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
            <p className="text-sm text-zinc-500">
              Synthesizing findings with AI
            </p>
          </div>

          {/* Progress steps */}
          <div className="mt-8 flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-emerald-400">Sources found</span>
            </div>
            <div className="w-8 h-px bg-zinc-700" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 animate-pulse">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-xs text-cyan-400">Generating insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
