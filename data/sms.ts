export function paidSettlmentSmsText(fullName: string, amount: number) {
  const message = [
    `🔷 ${fullName} عزیز، مدرس محترم آی‌گرافیکال،`,
    `مبلغ ${amount.toLocaleString("en-US")} تومان، جهت تسویه این دوره از حق فروش شما در وبسایت آی‌گرافیکال در صف پرداخت قرار گرفت.`,
    "همکاری با شما، افتخار ماست.",
    "آی‌گرافیکال",
  ].join("\n");

  return message;
}
