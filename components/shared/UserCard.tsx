// Kartu info user singkat — avatar initials, nama, no HP untuk WA

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Props = {
  label: string   // "Penitip" atau "Jastiper"
  profile: {
    full_name: string
    phone?: string | null
    avg_rating?: number | null
  }
}

// Ambil 2 huruf pertama dari nama untuk avatar initials
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export function UserCard({ label, profile }: Props) {
  const waLink = profile.phone
    ? `https://wa.me/62${profile.phone.replace(/^0/, "")}`
    : null

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>

      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
            {getInitials(profile.full_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{profile.full_name}</p>
          {profile.avg_rating != null && (
            <p className="text-sm text-muted-foreground">
              ⭐ {profile.avg_rating.toFixed(1)}
            </p>
          )}
        </div>

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
          >
            WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
