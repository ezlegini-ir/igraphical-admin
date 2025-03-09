export const globalPageSize = 15;

export function pagination(page: string, pageSize?: number) {
  return {
    skip:
      (+page || 1) * (pageSize || globalPageSize) -
      (pageSize || globalPageSize),
    take: pageSize || globalPageSize,
  };
}
