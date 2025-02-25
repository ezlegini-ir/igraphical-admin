export function calculateSum(values: any[], key: string) {
  return values.reduce((acc, curr) => acc + curr[key], 0);
}
