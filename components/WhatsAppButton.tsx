import Link from "next/link";

const WHATSAPP_NUMBER = "213557010838";
const WHATSAPP_MESSAGE =
  "Bonjour, je souhaite obtenir des informations concernant vos offres de voyage.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function WhatsAppButton() {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] md:bottom-6 md:right-6">
      <Link
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter sur WhatsApp"
        className="pointer-events-auto group flex h-14 w-14 items-center justify-center rounded-full bg-[#1d9e58] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8c8fe]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 transition-transform duration-200 group-hover:rotate-6"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.48 0 .12 5.36.12 11.94c0 2.1.55 4.16 1.6 5.98L0 24l6.27-1.65a11.9 11.9 0 0 0 5.79 1.48h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.18-3.49-8.41Zm-8.46 18.3h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.72.98.99-3.63-.23-.37a9.86 9.86 0 0 1-1.51-5.22c0-5.48 4.46-9.94 9.95-9.94 2.66 0 5.17 1.03 7.04 2.91a9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94Zm5.45-7.44c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.47.13-.62.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.54 0 1.5 1.08 2.95 1.23 3.15.15.2 2.13 3.26 5.16 4.57.72.31 1.29.5 1.73.63.73.23 1.39.2 1.92.12.59-.09 1.78-.73 2.03-1.44.25-.71.25-1.31.17-1.43-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </Link>
    </div>
  );
}

export { WHATSAPP_NUMBER, WHATSAPP_MESSAGE };


