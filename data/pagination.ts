export const globalPageSize = 15;

export function pagination(page: string) {
  return {
    skip: (+page || 1) * globalPageSize - globalPageSize,
    take: globalPageSize,
  };
}
