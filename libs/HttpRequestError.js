export function HttpRequestError(status, message) {
    this.status = status
    this.message = message
}