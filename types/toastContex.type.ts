export type ToastMessage = {
    id: number;
    message: string;
    type: "success" | "error";
    // you can extend with meta (duration, title, etc.) if needed
};

export type ToastContextType = {
    toasts: ToastMessage[];
    showToast: (message: string, type?: "success" | "error") => number; // returns id
    dismissToast: (id: number) => void;
    clearToasts: () => void;
};