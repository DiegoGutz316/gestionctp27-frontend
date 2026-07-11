/**
 * Layout base del grupo de rutas privadas.
 * Aquí se agregará la protección de sesión y la navegación (sidebar, header)
 * cuando se implementen las features.
 */
export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
