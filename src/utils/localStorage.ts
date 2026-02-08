// Set Item In Local Storage

export function setItemInLocalStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
}

// Get Item From Local Storage

export function getItemFromLocalStorage<T>(key: string, initialValue: T) {
  try {
    const value = window.localStorage.getItem(key);

    return value ? JSON.parse(value) : initialValue;
  } catch (error) {}
}

// Delete Item In Local Storage

export function removeItemInLocalStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {}
}

// Clear Local Storage

export function clearLocalStorage() {
  try {
    window.localStorage.clear();
  } catch (error) {}
}
