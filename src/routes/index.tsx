import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import siteCss from "../site/aldeir.css?url";
import siteHtml from "../site/aldeir-body.html?raw";
import { iniciarSite } from "../site/aldeir";

const SITE_URL = "https://aldair-feijo-mente-serena.lovable.app";
const TITULO = "Aldeir Paiva · Psicólogo Clínico em Feijó · CRP 24/03785";
const DESCRICAO =
  "Aldeir Paiva, psicólogo clínico em Feijó, Acre (CRP 24/03785). Escuta humanizada, Terapia Cognitivo-Comportamental, Intervenção em ABA e Neuropsicologia para crianças, adultos e idosos. Pré-lançamento em 21 de dezembro, aniversário de Feijó.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRICAO },
      { name: "author", content: "Franc D'nis · Feijó, Acre" },
      { name: "theme-color", content: "#16423C" },
      { property: "og:title", content: TITULO },
      {
        property: "og:description",
        content:
          "Pré-lançamento 21 de dezembro, aniversário de Feijó. Escuta humanizada, TCC, ABA e Neuropsicologia para crianças, adultos e idosos.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/assets/compartilhar-1200x630.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:image", content: `${SITE_URL}/assets/compartilhar-1200x630.png` },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: siteCss },
      { rel: "icon", href: "/assets/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => iniciarSite(), []);
  // O conteúdo do site fica em src/site/aldeir-body.html (HTML do layout aprovado).
  return <div className="aldeir-site" dangerouslySetInnerHTML={{ __html: siteHtml }} />;
}
