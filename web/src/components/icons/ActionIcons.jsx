// Small line icons for the saved-trip actions. Same style as BookmarkIcon:
// 24×24 grid, 2px round strokes, drawn in currentColor (they take the button's color and hover).
function Icon({ className = 'h-4 w-4', children }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  )
}

export function PencilIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </Icon>
  )
}

export function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M10 3h4" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </Icon>
  )
}

export function CheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Icon>
  )
}

export function CloseIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  )
}
