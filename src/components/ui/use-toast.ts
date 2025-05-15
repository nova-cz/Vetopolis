import { create } from "zustand"
import { nanoid } from "nanoid"

type ToastType = {
    id: string
    title?: string
    description?: string
    duration?: number
    action?: React.ReactNode
    variant?: "default" | "destructive"
}

type ToastStore = {
    toasts: ToastType[]
    addToast: (toast: ToastType) => void
    dismiss: (id: string) => void
}

export const useToast = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) =>
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id: toast.id ?? nanoid() }],
        })),
    dismiss: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}))

// Para uso directo en componentes
export const toast = {
    dismiss: (id: string) => useToast.getState().dismiss(id),
    // shortcut para mostrar toast con datos mínimos
    success: (title: string, description?: string) =>
        useToast.getState().addToast({
            id: nanoid(),
            title,
            description,
            variant: "default",
            duration: 5000,
        }),
}
