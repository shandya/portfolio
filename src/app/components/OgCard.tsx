/** Shared 1200x630 layout for OpenGraph images (rendered by next/og, so inline styles only). */
export const OG_SIZE = { width: 1200, height: 630 };

export default function OgCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        color: '#ccdbe0',
        backgroundColor: '#05060f',
        backgroundImage:
          'radial-gradient(circle at 15% 85%, rgba(49,236,255,0.35), transparent 45%), radial-gradient(circle at 85% 10%, rgba(40,60,200,0.45), transparent 50%)',
      }}
    >
      <div style={{ fontSize: 28, color: '#31ecff', opacity: 0.8 }}>{eyebrow}</div>
      <div
        style={{
          fontSize: title.length > 60 ? 56 : 72,
          fontWeight: 700,
          color: '#31ecff',
          lineHeight: 1.1,
          display: 'flex',
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 28, opacity: 0.7 }}>{footer}</div>
    </div>
  );
}
