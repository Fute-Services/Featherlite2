import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * Last line of defence around the router, for the app only.
 *
 * In a browser a crashed screen is survivable - there is an address bar and a
 * reload button. On a kiosk tablet locked to landscape with no system bars,
 * a throw in any screen (or a chunk that fails to load, which is what a
 * half-written APK install looks like at runtime) leaves a white page and no
 * way back: the demo is over until someone kills the app. This turns that into
 * a branded card with two ways out.
 *
 * Injected by `scripts/app-ui-plugin.mjs`; `web/` is not edited.
 */
interface Props {
  children: ReactNode;
  /** changing this clears a caught error - used to recover on navigation */
  resetKey?: string;
}

interface State {
  error: Error | null;
  /** the resetKey the current error was caught under */
  seenKey?: string;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  /* Navigating away clears the error, without a second render pass. */
  static getDerivedStateFromProps(props: Props, state: State): State | null {
    if (!state.error) return { error: null, seenKey: props.resetKey };
    if (state.seenKey === undefined) return { ...state, seenKey: props.resetKey };
    return state.seenKey === props.resetKey
      ? null
      : { error: null, seenKey: props.resetKey };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // shows up in `adb logcat -s chromium` on a device
    console.error("[featherlite] screen crashed", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-5 bg-[#0D2D43] px-8 text-center">
        <span className="block h-[2px] w-12 bg-[#C89D54]" />
        <div>
          <h1 className="font-serif text-3xl text-[#C89D54]">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
            This screen could not be shown. Nothing is lost - go back to the
            home screen and carry on.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="cursor-pointer rounded-full border border-[#C89D54] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C89D54] transition-colors hover:bg-[#C89D54] hover:text-black"
          >
            Try again
          </button>
          <button
            type="button"
            /* a hard load, not a router push: it also re-fetches any chunk that
               failed to arrive the first time */
            onClick={() => window.location.assign("/")}
            className="cursor-pointer rounded-full border border-white/25 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white/60 hover:text-white"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }
}

/**
 * What the patched Router renders. It reads the location itself so the plugin
 * only has to wrap a pair of tags, and so moving to another screen clears the
 * error without the user doing anything.
 */
const AppErrorBoundary = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
};

export default AppErrorBoundary;
