import Image from "next/image";
import Link from "next/link";
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/2026"
      className={`brand ${light ? "light" : ""}`}
      aria-label="Cavic Festival home"
    >
      <Image src="/logo.png" width={42} height={42} alt="" />
      <span>
        Cavic Festival<small>Creativity & Technology</small>
      </span>
    </Link>
  );
}
export function Poster() {
  return (
    <Image
      src="/2026-festival-artwork.png"
      alt="Cavic Festival 2026 — Infinite Realms: Beyond Imagination"
      width={1528}
      height={1346}
      className="festival-poster"
    />
  );
}
