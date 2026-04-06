/**
 * Call this after any action that creates a backend notification.
 * The header listens for this event and refreshes the notification list.
 * Delay gives the backend time to persist the notification before fetching.
 */
export function triggerNotificationRefresh(delayMs = 800) {
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent("notification:refresh"))
    }, delayMs)
}