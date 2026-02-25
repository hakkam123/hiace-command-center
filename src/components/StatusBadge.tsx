import { cn } from "@/lib/utils";

type BadgeVariant = "menunggu" | "lunas" | "checkedin" | "dibatalkan" | "normal" | "warning" | "alert";

const variantMap: Record<BadgeVariant, string> = {
  menunggu: "bg-warning/15 text-warning border-warning/20",
  lunas: "bg-success/15 text-success border-success/20",
  checkedin: "bg-info/15 text-info border-info/20",
  dibatalkan: "bg-destructive/15 text-destructive border-destructive/20",
  normal: "bg-success/15 text-success border-success/20",
  warning: "bg-warning/15 text-warning border-warning/20",
  alert: "bg-destructive/15 text-destructive border-destructive/20",
};

const labelMap: Record<BadgeVariant, string> = {
  menunggu: "Menunggu Pembayaran",
  lunas: "Lunas",
  checkedin: "Checked In",
  dibatalkan: "Dibatalkan",
  normal: "Normal",
  warning: "Warning",
  alert: "Alert",
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border",
        variantMap[variant]
      )}
    >
      {label || labelMap[variant]}
    </span>
  );
}
