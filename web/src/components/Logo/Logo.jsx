// "Detour" wordmark in a French script (Parisienne), drawn as a button.
// Props: onReset — called on click; App uses it to clear the current search
//        (no page reload, so Pyodide doesn't have to download again).
export default function Logo({ onReset }) {
  return (
    <button
      type="button"
      onClick={onReset}
      aria-label="Detour — nova busca"
      className="group shrink-0 cursor-pointer select-none px-1 font-logo text-4xl leading-none text-white
                 transition-colors duration-300 hover:text-[#00f0ff]
                 [text-shadow:0_0_1px_rgba(255,255,255,0.4)]
                 hover:[text-shadow:0_0_6px_rgba(0,240,255,0.9),0_0_18px_rgba(0,240,255,0.45)]
                 focus-visible:outline-none focus-visible:text-[#00f0ff]"
    >
      Detour
    </button>
  )
}
