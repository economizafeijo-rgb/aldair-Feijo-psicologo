// Comportamento do site: contagem regressiva do pré-lançamento e lista de interesse.

/** Número de WhatsApp do consultório: só dígitos, com 55 + DDD (ex.: "5568999999999").
 *  Vazio: o WhatsApp abre para a pessoa escolher o contato. */
export const WHATSAPP = "";

/** Pré-lançamento: 21 de dezembro, aniversário de Feijó (horário do Acre, UTC-5). */
export const ALVO = new Date("2026-12-21T00:00:00-05:00");

// Lista de pré-lançamento no Supabase. A chave publicável pode ficar no site:
// a tabela só aceita inserções (ver docs/supabase-lista-pre-lancamento.sql).
const SUPABASE_URL = "https://fqcwqjrkhouhxjhsjdgq.supabase.co";
const SUPABASE_KEY = "sb_publishable_NaC_Jzfz8JLxNBUpWZbLHA_OKAh3Rfc";

type Inscricao = {
  nome: string;
  atendimento_para: string;
  interesse: string;
  cidade: string | null;
  consentimento: true;
};

async function salvarInscricao(dados: Inscricao) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/lista_pre_lancamento`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(dados),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

const pad = (n: number) => String(n).padStart(2, "0");

function iniciarContagem(): () => void {
  const el = (id: string) => document.getElementById(id);
  const tick = () => {
    const ms = ALVO.getTime() - Date.now();
    if (ms <= 0) {
      const label = el("cd-label");
      if (label) label.textContent = "O pré-lançamento começou";
      for (const k of ["d", "h", "m", "s"]) {
        const n = el("cd-" + k);
        if (n) n.textContent = "00";
      }
      return;
    }
    const s = Math.floor(ms / 1000);
    const set = (k: string, v: string) => {
      const n = el("cd-" + k);
      if (n) n.textContent = v;
    };
    set("d", String(Math.floor(s / 86400)));
    set("h", pad(Math.floor((s % 86400) / 3600)));
    set("m", pad(Math.floor((s % 3600) / 60)));
    set("s", pad(s % 60));
  };
  tick();
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}

function iniciarFormulario(): () => void {
  const form = document.getElementById("form") as HTMLFormElement | null;
  const ok = document.getElementById("ok");
  if (!form || !ok) return () => {};
  const campo = <T extends HTMLElement>(name: string) => form.elements.namedItem(name) as T;

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const nomeEl = campo<HTMLInputElement>("nome");
    const consent = campo<HTMLInputElement>("consent");
    const para = campo<HTMLSelectElement>("para").value;
    const tipo = campo<HTMLSelectElement>("tipo").value;
    const nome = nomeEl.value.trim();
    const cidade = campo<HTMLInputElement>("cidade").value.trim();
    ok.hidden = false;
    if (!nome) {
      ok.textContent = "Escreva seu nome para entrar na lista.";
      nomeEl.focus();
      return;
    }
    if (!consent.checked) {
      ok.textContent = "Marque a autorização de uso dos dados para continuar.";
      consent.focus();
      return;
    }
    const msg = `Olá, Aldeir! Sou ${nome}${cidade ? ", de " + cidade : ""}. Quero entrar na lista do pré-lançamento de 21 de dezembro. Atendimento para: ${para}. Interesse: ${tipo}.`;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    const btn = form.querySelector<HTMLButtonElement>("button[type=submit]");
    if (btn) btn.disabled = true;
    let salvo = false;
    try {
      await salvarInscricao({
        nome,
        atendimento_para: para,
        interesse: tipo,
        cidade: cidade || null,
        consentimento: true,
      });
      salvo = true;
    } catch (err) {
      console.warn("Lista não salva:", err);
    }
    if (btn) btn.disabled = false;
    window.open(url, "_blank", "noopener");
    ok.textContent =
      (salvo ? "Pronto, você está na lista do pré-lançamento! " : "") +
      "Abrimos o WhatsApp com sua mensagem pronta. Se ele não abrir, copie o texto: " +
      msg;
    if (salvo) form.reset();
  };

  form.addEventListener("submit", onSubmit);
  return () => form.removeEventListener("submit", onSubmit);
}

/** Liga a contagem e o formulário; devolve a função de limpeza. */
export function iniciarSite(): () => void {
  const pararContagem = iniciarContagem();
  const pararFormulario = iniciarFormulario();
  return () => {
    pararContagem();
    pararFormulario();
  };
}
