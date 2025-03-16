import prisma from "@/prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeUrl(url: string) {
  return url.split(" ").join("-").trim();
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = minutes / 60;
    const roundedHours = Math.round(hours * 2) / 2;

    return roundedHours % 1 === 0
      ? `${roundedHours} hour`
      : `${roundedHours} hours`;
  }
}

export async function generateUniqueSerial(): Promise<string> {
  let isUnique = false;
  let serial = "";

  while (!isUnique) {
    // Step 1: Generate a random 8-digit serial
    serial = `ig-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Step 2: Check if the serial exists in the database
    const existingCertificate = await prisma.certificate.findUnique({
      where: { serial },
    });

    // Step 3: If no duplicate found, it's unique
    if (!existingCertificate) {
      isUnique = true;
    }
  }

  return serial;
}

export function formatPrice(
  price: number | undefined,
  options?: { noValuePlaceholder?: string; showNumber?: boolean }
) {
  if (!price)
    return options?.showNumber ? 0 + " t" : options?.noValuePlaceholder || "--";

  return price.toLocaleString("en-US") + " t";
}

export function handleError(error: unknown): { error: string } {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return { error: `Error 500: ${errorMessage}` };
}

export function truncateFileName(name: string, maxLength = 20) {
  if (name.length <= maxLength) return name;

  const extIndex = name.lastIndexOf(".");
  const extension = extIndex !== -1 ? name.slice(extIndex) : "";
  const baseName = name.slice(0, extIndex);

  return baseName.slice(0, 10) + "....." + baseName.slice(-10) + extension;
}
