import { ImageResponse } from "next/og";
import { findCompanyBySlug } from "@/lib/data";
import type { Company } from "@/lib/types";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const VISIBLE_SHORTCUT_COUNT = 3;

const KEY_LABELS: Record<string, string> = {
  "⌘": "Cmd",
  "⌃": "Ctrl",
  "⌥": "Opt",
  "⇧": "Shift",
  "⏎": "Enter",
  "⌫": "Del",
  "⌦": "Del",
  "⇥": "Tab",
  "⎋": "Esc",
  "⇪": "Caps",
  "␣": "Space",
  "↑": "Up",
  "↓": "Down",
  "←": "Left",
  "→": "Right",
};

type Params = { slug: string };

function renderKey(key: string) {
  return KEY_LABELS[key] ?? key;
}

async function fetchCompanyIconDataUrl(
  company: Pick<Company, "website">,
): Promise<string | null> {
  try {
    const hostname = new URL(company.website).hostname.replace(/^www\./, "");
    const response = await fetch(
      `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
      { cache: "force-cache", redirect: "follow" },
    );
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);

  if (!company) {
    return new ImageResponse(
      <div
        style={{
          alignItems: "center",
          background: "#000000",
          color: "#ffffff",
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

  const iconDataUrl = await fetchCompanyIconDataUrl(company);

  const shortcutRows = company.shortcuts.flatMap((shortcut) =>
    shortcut.bindings.map((binding) => ({ binding, shortcut })),
  );
  const visibleShortcuts = shortcutRows.slice(0, VISIBLE_SHORTCUT_COUNT);
  const hiddenShortcutCount = Math.max(
    shortcutRows.length - VISIBLE_SHORTCUT_COUNT,
    0,
  );

  return new ImageResponse(
    <div
      style={{
        background: "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "64px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 28,
        }}
      >
        <div
          style={{
            alignItems: "center",
            borderRadius: 16,
            display: "flex",
            height: 76,
            justifyContent: "center",
            width: 76,
          }}
        >
          {iconDataUrl ? (
            // biome-ignore lint/performance/noImgElement: next/image is unavailable in next/og.
            <img
              alt=""
              height={68}
              src={iconDataUrl}
              style={{ borderRadius: 12 }}
              width={68}
            />
          ) : (
            <div
              style={{
                color: "#ffffff",
                fontSize: 60,
                fontWeight: 700,
              }}
            >
              {company.name.charAt(0)}
            </div>
          )}
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {company.name}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          marginTop: 40,
          minHeight: 0,
        }}
      >
        {visibleShortcuts.map(({ binding, shortcut }, index) => (
          <div
            key={`${shortcut.id}-${binding.context}`}
            style={{
              alignItems: "center",
              borderTop:
                index === 0 ? "1px solid #1f1f23" : "1px solid transparent",
              borderBottom: "1px solid #1f1f23",
              display: "flex",
              justifyContent: "space-between",
              padding: "18px 0",
            }}
          >
            <div
              style={{
                color: "#fafafa",
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: -0.5,
                lineHeight: 1.1,
              }}
            >
              {shortcut.action}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {binding.keys.map((key, keyIndex) => (
                <div
                  key={`${binding.context}-${key}-${keyIndex}`}
                  style={{
                    alignItems: "center",
                    background: "#0a0a0a",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                    color: "#fafafa",
                    display: "flex",
                    fontSize: 22,
                    fontWeight: 600,
                    height: 46,
                    justifyContent: "center",
                    minWidth: 46,
                    padding: "0 14px",
                  }}
                >
                  {renderKey(key)}
                </div>
              ))}
            </div>
          </div>
        ))}

        {hiddenShortcutCount > 0 ? (
          <div
            style={{
              color: "#71717a",
              display: "flex",
              fontSize: 20,
              marginTop: 16,
            }}
          >
            {`+ ${hiddenShortcutCount} more shortcut${hiddenShortcutCount === 1 ? "" : "s"}`}
          </div>
        ) : null}
      </div>

      <div
        style={{
          alignItems: "center",
          color: "#a1a1aa",
          display: "flex",
          fontSize: 24,
          fontWeight: 500,
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <div>
          {`${shortcutRows.length} ${shortcutRows.length === 1 ? "shortcut" : "shortcuts"}`}
        </div>
        <div>hotkeys.dominikkoch.dev</div>
      </div>
    </div>,
    size,
  );
}
