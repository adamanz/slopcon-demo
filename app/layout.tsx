export const metadata = { title: "Slop Con NYC", description: "Built by slop cannons" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
