import { marked } from "marked";

/**
 * Parses Talarius-style Markdown Timelines (::: timeline ... :::) into HTML.
 * Spec: https://wiki.talarius.org/guides/markdown-timelines
 */
export function parseTimelines(markdown: string): string {
  if (!markdown || !markdown.includes("::: timeline")) {
    return markdown;
  }

  // Matches ::: timeline ... ::: blocks with optional modifiers like {.squish-left}
  const timelineBlockRegex = /^:::[\t ]*timeline(?:[\t ]+\{([^}]+)\})?[\t ]*\r?\n([\s\S]*?)\r?\n:::[\t ]*$/gm;

  return markdown.replace(timelineBlockRegex, (_, classAttr, blockBody) => {
    let extraClasses = "";
    if (classAttr) {
      const classes = classAttr
        .split(/\s+/)
        .map((c: string) => c.replace(/^\./, "").trim())
        .filter(Boolean);
      if (classes.length) {
        extraClasses = " " + classes.join(" ");
      }
    }

    // Split body into items and breaks
    const rawChunks = blockBody.split(/\r?\n\s*\r?\n/);

    type TimelineItem =
      | { type: "break"; title: string }
      | { type: "date"; content: string }
      | { type: "event"; title: string; label?: string; paragraphs: string[] };

    const items: TimelineItem[] = [];

    for (const chunk of rawChunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      // Break: --- Title ---
      const breakMatch = trimmed.match(/^---\s*(.+?)\s*---$/);
      if (breakMatch) {
        items.push({ type: "break", title: breakMatch[1] });
        continue;
      }

      const lines = trimmed.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;

      const detailLines = lines.filter((l: string) => l.startsWith(":"));
      if (detailLines.length === 0) {
        // Date item (single line or lines without ':')
        items.push({ type: "date", content: lines.join(" ") });
      } else {
        // Event item
        const titleLines: string[] = [];
        const details: string[] = [];
        for (const line of lines) {
          if (line.startsWith(":")) {
            details.push(line.replace(/^:\s*/, ""));
          } else if (details.length === 0) {
            titleLines.push(line);
          } else {
            details.push(line);
          }
        }
        const title = titleLines.join(" ");
        if (details.length === 1) {
          items.push({
            type: "event",
            title,
            paragraphs: [details[0]],
          });
        } else {
          items.push({
            type: "event",
            title,
            label: details[0],
            paragraphs: details.slice(1),
          });
        }
      }
    }

    function renderItem(item: TimelineItem): string {
      if (item.type === "date") {
        const renderedDate =
          item.content === "&nbsp;"
            ? "&nbsp;"
            : (marked.parseInline(item.content) as string);
        return `<div class="year-item"><span class="year">${renderedDate}</span></div>`;
      }
      if (item.type === "event") {
        const slug = item.title
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const renderedTitle = marked.parseInline(item.title) as string;
        const labelHtml = item.label
          ? `<div class="item-date">${marked.parseInline(item.label) as string}</div>`
          : "";
        const descHtml = item.paragraphs
          .map((p) => `<p>${marked.parseInline(p) as string}</p>`)
          .join("");

        return `<section class="timeline-item">${labelHtml}<h3 class="toc-header" id="${slug}">${renderedTitle}</h3>${descHtml}</section>`;
      }
      return "";
    }

    let html = `<div class="timeline${extraClasses}"><div class="wrapper-timeline">`;
    let pendingPair: TimelineItem[] = [];

    function flushPair() {
      if (pendingPair.length === 0) return;
      const left = renderItem(pendingPair[0]);
      const right =
        pendingPair.length > 1
          ? renderItem(pendingPair[1])
          : `<div class="year-item"><span class="year">&nbsp;</span></div>`;

      html += `<div class="wrapper-item">${left}<section class="divider"><span class="dot"></span></section>${right}</div>`;
      pendingPair = [];
    }

    for (const item of items) {
      if (item.type === "break") {
        flushPair();
        html += `<div class="break"><span class="title">${item.title}</span><hr></div>`;
      } else {
        pendingPair.push(item);
        if (pendingPair.length === 2) {
          flushPair();
        }
      }
    }
    flushPair();

    html += `</div></div>`;
    return html;
  });
}
