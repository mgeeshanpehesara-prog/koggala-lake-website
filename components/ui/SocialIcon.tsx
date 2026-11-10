export default function SocialIcon({ label }: { label: string }) {
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.2 3.6 15.1 3.5 13.8 3.5c-2.6 0-4.4 1.6-4.4 4.5v2H6.7v3.1h2.7v8h4.1z" />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (label === "TikTok") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M15.2 3h3.1c.2 1.7 1.1 3 2.7 3.8v3.1a8.4 8.4 0 0 1-2.7-1V15a5.9 5.9 0 1 1-5.9-5.9c.4 0 .8 0 1.2.1v3.2a2.8 2.8 0 1 0 1.6 2.6V3Z" />
      </svg>
    );
  }

  if (label === "WhatsApp") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
        <path d="M5.5 18.5 4 21l3-.9A8.5 8.5 0 1 0 5.5 18.5Z" />
        <path d="M8.5 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.5 1 1.3 1.7 2.3 2.2l.7-.6c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5-.1.7-.7 1.3-1.4 1.4-1.1.2-2.8-.6-4.2-1.9-1.4-1.3-2.1-3-1.7-4.9Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="13" r="2.2" />
      <circle cx="15.5" cy="13" r="2.2" />
      <path d="M8.5 10.8V9.5M15.5 10.8V9.5" />
    </svg>
  );
}
