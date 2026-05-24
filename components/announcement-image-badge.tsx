type AnnouncementImageBadgeProps = {
  label?: string;
};

export function AnnouncementImageBadge({ label }: AnnouncementImageBadgeProps) {
  if (!label?.trim()) return null;

  return (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-[#a97b32] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#12100c] shadow-[0_10px_28px_rgba(0,0,0,0.28)]">
      {label}
    </span>
  );
}
