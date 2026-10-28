import Link from "next/link";

const inlineRedirectScript = `
(function() {
  try {
    var p = window.location.pathname;
    var b = "${process.env.NEXT_PUBLIC_BASE_PATH || ""}";
    var c = (b && p.indexOf(b) === 0) ? p.slice(b.length) : p;
    var pm = c.match(/^\\/posts\\/([^/]+)/);
    if (pm && pm[1] && pm[1] !== "_fallback") {
      var s = window.location.search;
      var q = s ? "&" + s.slice(1) : "";
      window.location.replace(b + "/posts/_fallback?slug=" + encodeURIComponent(decodeURIComponent(pm[1])) + q + window.location.hash);
      return;
    }
    var nm2 = c.match(/^\\/novel\\/([^/]+)\\/([^/]+)/);
    if (nm2 && nm2[1] && nm2[2] && nm2[1] !== "_fallback") {
      var s2 = window.location.search;
      var q2 = s2 ? "&" + s2.slice(1) : "";
      window.location.replace(b + "/novel/_fallback/0?bookUrl=" + encodeURIComponent(decodeURIComponent(nm2[1])) + "&chapter=" + encodeURIComponent(decodeURIComponent(nm2[2])) + q2 + window.location.hash);
      return;
    }
    var nm1 = c.match(/^\\/novel\\/([^/]+)/);
    if (nm1 && nm1[1] && nm1[1] !== "_fallback" && nm1[1] !== "search") {
      var s1 = window.location.search;
      var q1 = s1 ? "&" + s1.slice(1) : "";
      window.location.replace(b + "/novel/_fallback?bookUrl=" + encodeURIComponent(decodeURIComponent(nm1[1])) + q1 + window.location.hash);
      return;
    }
  } catch(e) {}
})();
`;

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <script dangerouslySetInnerHTML={{ __html: inlineRedirectScript }} />
      <h1 className="text-7xl font-bold font-serif mb-4 text-zinc-800 dark:text-zinc-100">404</h1>
      <h2 className="text-xl font-medium text-zinc-600 dark:text-zinc-300 mb-6 font-sans">
        哎呀，所请求的页面不存在或已被移除
      </h2>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
}
