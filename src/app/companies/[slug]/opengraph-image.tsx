import { ImageResponse } from "next/og";
import { findCompanyBySlug } from "@/lib/data";
import { getCompanyIconUrl } from "@/utils/icons";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const visibleShortcutCount = 4;

type Params = { slug: string };

function pluralize(count: number, label: string) {
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);

  if (!company) {
    return new ImageResponse(
      <div
        style={{
          alignItems: "center",
          background: "#09090b",
          color: "#fafafa",
          display: "flex",
          fontSize: 64,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        Company not found
      </div>,
      size,
    );
  }

  const shortcutRows = company.shortcuts.flatMap((shortcut) =>
    shortcut.bindings.map((binding) => ({ binding, shortcut })),
  );
  const visibleShortcuts = shortcutRows.slice(0, visibleShortcutCount);
  const hiddenShortcutCount = Math.max(
    shortcutRows.length - visibleShortcutCount,
    0,
  );

  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        color: "#fafafa",
        display: "flex",
        height: "100%",
        padding: 64,
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 44,
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: 48,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div
              style={{
                alignItems: "center",
                background: "#ffffff",
                borderRadius: 24,
                display: "flex",
                height: 96,
                justifyContent: "center",
                width: 96,
              }}
            >
              {/* ImageResponse supports img for generated OG images. */}
              {/* biome-ignore lint/performance/noImgElement: next/image is not supported in next/og output. */}
              <img
                alt=""
                height="64"
                src={getCompanyIconUrl(company)}
                style={{ borderRadius: 14 }}
                width="64"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#a1a1aa",
                  fontSize: 26,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                {company.category}
              </div>
              <div
                style={{
                  fontSize: 76,
                  fontWeight: 700,
                  letterSpacing: -3.2,
                  lineHeight: 1,
                  marginTop: 8,
                }}
              >
                {company.name}
              </div>
            </div>
          </div>

          <div
            style={{
              alignItems: "flex-end",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                color: "#fafafa",
                fontSize: 36,
                fontWeight: 650,
                lineHeight: 1,
              }}
            >
              {pluralize(shortcutRows.length, "shortcut")}
            </div>
            <div style={{ color: "#a1a1aa", fontSize: 24 }}>hotkeys</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 44,
          }}
        >
          {visibleShortcuts.map(({ binding, shortcut }) => (
            <div
              key={`${shortcut.id}-${binding.context}`}
              style={{
                alignItems: "center",
                background: "rgba(0,0,0,0.34)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                display: "flex",
                justifyContent: "space-between",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: "#fafafa",
                    fontSize: 30,
                    fontWeight: 650,
                    lineHeight: 1.2,
                  }}
                >
                  {shortcut.action}
                </div>
                <div
                  style={{
                    color: "#a1a1aa",
                    fontSize: 22,
                    marginTop: 6,
                  }}
                >
                  {binding.contextLabel}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginLeft: 24 }}>
                {binding.keys.map((key) => (
                  <div
                    key={`${binding.context}-${key}`}
                    style={{
                      alignItems: "center",
                      background: "#18181b",
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: 12,
                      color: "#fafafa",
                      display: "flex",
                      fontSize: 24,
                      fontWeight: 650,
                      height: 46,
                      justifyContent: "center",
                      minWidth: 46,
                      padding: "0 14px",
                    }}
                  >
                    {key}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            alignItems: "center",
            color: "#a1a1aa",
            display: "flex",
            fontSize: 24,
            justifyContent: "space-between",
            marginTop: 36,
          }}
        >
          <div>hotkeys by dominik</div>
          {hiddenShortcutCount > 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 999,
                color: "#fafafa",
                display: "flex",
                flexShrink: 0,
                marginLeft: 24,
                padding: "10px 18px",
              }}
            >
              +{hiddenShortcutCount} more
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    size,
  );
}
