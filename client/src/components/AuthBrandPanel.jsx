import { MessageCircle, Shield, Zap } from "lucide-react";

function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 xl:p-14 border-r theme-border theme-surface-subtle">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center justify-center size-11 rounded-lg bg-accent-soft ring-1 ring-accent-ring">
            <MessageCircle className="size-5 text-accent-muted" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight theme-text">SyncChat</h1>
            <p className="text-sm theme-text-muted">Team messaging</p>
          </div>
        </div>

        <h2 className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight mb-4 theme-text">
          Clear, focused
          <br />
          <span className="text-accent-muted">conversations</span>
        </h2>

        <p className="max-w-sm text-sm theme-text-muted leading-relaxed">
          A clean workspace for real-time messaging — built for clarity, not clutter.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-10">
        <div className="glass-panel-subtle rounded-xl p-4">
          <Zap className="size-4 text-accent-muted mb-2.5" strokeWidth={1.5} />
          <h3 className="text-sm font-medium theme-text-secondary mb-1">Real-time</h3>
          <p className="text-xs theme-text-muted leading-relaxed">
            Instant delivery over WebSocket.
          </p>
        </div>
        <div className="glass-panel-subtle rounded-xl p-4">
          <Shield className="size-4 theme-text-faint mb-2.5" strokeWidth={1.5} />
          <h3 className="text-sm font-medium theme-text-secondary mb-1">Secure</h3>
          <p className="text-xs theme-text-muted leading-relaxed">
            Protected sessions and auth.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthBrandPanel;
