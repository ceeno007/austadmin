import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-white/90",
          actionButton: "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:rounded-xl hover:bg-white/30",
          cancelButton: "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:rounded-xl hover:bg-white/30",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
