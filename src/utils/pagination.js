export function getPaginationMeta(response) {
  return (
    response.meta ?? {
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total,
      from: response.from,
      to: response.to,
    }
  );
}
