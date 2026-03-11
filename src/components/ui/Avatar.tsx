import { Profile } from "@/src/lib/mappers";
import Image from 'next/image';

export default function Avatar({ 
    profile, 
    size = 32 
}: { profile?: Profile | null; size?: number }) {
    if (profile?.avatarUrl) {
        return (
            <Image
                src={profile.avatarUrl}
                alt={profile.fullName ?? 'Member'}
                width={size}
                height={size}
                className="rounded-full ring-2 ring-slate-200 dark:ring-slate-600 object-cover shrink-0"
                style={{ width: size, height: size }}
                title={profile.fullName}
            />
        );
    }
    return (
        <div
            className="rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
            {profile?.fullName?.charAt(0).toUpperCase() ?? '?'}
        </div>
    );
}