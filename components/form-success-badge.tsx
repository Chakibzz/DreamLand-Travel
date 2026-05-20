"use client";

type FormSuccessBadgeProps = {
  message: string;
};

export function FormSuccessBadge({ message }: FormSuccessBadgeProps) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-md border border-[#3b2b16] bg-[#15110c] px-3 py-2 text-[12px] text-[#d9c9ab]">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c89a4b] text-[#12100c] animate-bounce">
        ✓
      </span>
      <span>{message}</span>
    </div>
  );
}

