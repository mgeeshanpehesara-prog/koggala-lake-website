import type { TimeSlotCutoff } from "@/lib/types";

export const BUSINESS_TIMEZONE = "Asia/Colombo";

function parseTimeSlot(slot: string) {
  const match = slot.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "AM" && hour === 12) hour = 0;
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

export function isTimeSlotBookable(date: string, slot: string, cutoff?: TimeSlotCutoff, now = new Date()) {
  if (!cutoff || cutoff.unit === "none" || !cutoff.value || cutoff.value < 0) return true;
  const parsed = parseTimeSlot(slot);
  if (!parsed || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return true;
  const activity = new Date(`${date}T${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")}:00+05:30`);
  const multiplier = cutoff.unit === "days" ? 24 * 60 * 60 * 1000 : cutoff.unit === "hours" ? 60 * 60 * 1000 : 60 * 1000;
  return now.getTime() < activity.getTime() - cutoff.value * multiplier;
}

export function getTimeSlotCutoff(cutoffs: Record<string, TimeSlotCutoff> | undefined, slot: string): TimeSlotCutoff {
  return cutoffs?.[slot] || { value: 0, unit: "none" };
}
