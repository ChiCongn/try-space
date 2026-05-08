export function getErrorMessage(caught: unknown, fallback = "Đã có lỗi xảy ra.") {
  if (caught instanceof Error) return caught.message;
  const responseMessage = (caught as { response?: { data?: { message?: string } } })
    .response?.data?.message;
  return responseMessage ?? fallback;
}

export function getErrorCode(caught: unknown) {
  return (caught as { response?: { data?: { code?: string } } }).response?.data?.code;
}
