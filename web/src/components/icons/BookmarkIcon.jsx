// Bookmark with a small star: "saved trips". Drawn in currentColor like StationIcon.
export default function BookmarkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
      <path d="M12 7.2l1.1 2.2 2.4.35-1.75 1.7.42 2.4L12 12.7l-2.17 1.15.42-2.4L8.5 9.75l2.4-.35z"
            fill="currentColor" stroke="none" />
    </svg>
  )
}
