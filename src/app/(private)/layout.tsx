import { RequerirAuth } from "@/features/auth/components/requerir-auth";

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RequerirAuth>{children}</RequerirAuth>;
}
