import Kavenegar from "kavenegar";

export const kavenegar = Kavenegar.KavenegarApi({
  apikey: process.env.NEXT_PUBLIC_KAVENEGAR_API!,
});
