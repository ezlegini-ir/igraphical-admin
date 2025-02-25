export const detectInputType = (input: string): "phone" | "email" => {
  const phoneRegex = /^0\d{10}$/; // Starts with 0, followed by 10 digits
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

  if (phoneRegex.test(input)) {
    return "phone";
  } else {
    return "email";
  }
};
