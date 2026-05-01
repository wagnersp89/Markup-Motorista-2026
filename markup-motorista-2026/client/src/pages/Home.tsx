/**
 * Design note: neo-brutalismo técnico noturno, composição assimétrica, superfícies escuras,
 * números protagonistas e contraste controlado em âmbar e azul para reforçar o caráter operacional.
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CarFront,
  Clock3,
  Fuel,
  Gauge,
  Landmark,
  MapPinned,
  Route,
  Shield,
  Sparkles,
  TrendingUp,
  WalletCards,
  Wrench,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";

type CityPreset = {
  name: string;
  iss: number;
};

type StatePreset = {
  uf: string;
  name: string;
  gas: number;
  ipva: number;
  icms: number;
  cities: CityPreset[];
};

type FormState = {
  kmDia: number;
  diasSemana: number;
  horasDia: number;
  margem: number;
  faturamentoSemana: number;
  fipe: number;
  depreciacao: number;
  parcela: number;
  seguro: number;
  licenciamento: number;
  consumoKm: number;
  trocaOleo: number;
  pneus: number;
  manutencao: number;
  lavagem: number;
  alimentacao: number;
  inss: number;
  celular: number;
  iss: number;
  icms: number;
  ipva: number;
  precoGas: number;
  ipca: number;
  corridaKm: number;
  corridaMin: number;
  corridaValorPago: number;
};

type CostRow = {
  section: string;
  name: string;
  annual: number;
};

const WEEKS_PER_YEAR = 52;
const WEEKS_PER_MONTH = WEEKS_PER_YEAR / 12;
const ANNUAL_OIL_INTERVAL_KM = 10000;
const ANNUAL_TIRE_INTERVAL_KM = 60000;

const statePresets: StatePreset[] = [
  { uf: "AC", name: "Acre", gas: 7.24, ipva: 2, icms: 12, cities: [{ name: "Rio Branco", iss: 5 }] },
  { uf: "AL", name: "Alagoas", gas: 6.03, ipva: 3, icms: 12, cities: [{ name: "Maceió", iss: 5 }] },
  { uf: "AP", name: "Amapá", gas: 6.29, ipva: 3, icms: 12, cities: [{ name: "Macapá", iss: 5 }] },
  { uf: "AM", name: "Amazonas", gas: 7.02, ipva: 3, icms: 12, cities: [{ name: "Manaus", iss: 5 }] },
  { uf: "BA", name: "Bahia", gas: 6.41, ipva: 2.5, icms: 12, cities: [{ name: "Salvador", iss: 5 }] },
  { uf: "CE", name: "Ceará", gas: 6.17, ipva: 3, icms: 12, cities: [{ name: "Fortaleza", iss: 5 }] },
  { uf: "DF", name: "Distrito Federal", gas: 6.49, ipva: 3.5, icms: 12, cities: [{ name: "Brasília", iss: 5 }] },
  { uf: "ES", name: "Espírito Santo", gas: 6.38, ipva: 2, icms: 12, cities: [{ name: "Vitória", iss: 5 }] },
  { uf: "GO", name: "Goiás", gas: 6.44, ipva: 3.75, icms: 12, cities: [{ name: "Goiânia", iss: 5 }] },
  { uf: "MA", name: "Maranhão", gas: 5.94, ipva: 2.5, icms: 12, cities: [{ name: "São Luís", iss: 5 }] },
  { uf: "MT", name: "Mato Grosso", gas: 6.44, ipva: 3, icms: 12, cities: [{ name: "Cuiabá", iss: 5 }] },
  { uf: "MS", name: "Mato Grosso do Sul", gas: 6.03, ipva: 4, icms: 12, cities: [{ name: "Campo Grande", iss: 5 }] },
  { uf: "MG", name: "Minas Gerais", gas: 6.18, ipva: 4, icms: 12, cities: [{ name: "Belo Horizonte", iss: 5 }] },
  { uf: "PA", name: "Pará", gas: 6.27, ipva: 2.5, icms: 12, cities: [{ name: "Belém", iss: 5 }] },
  { uf: "PB", name: "Paraíba", gas: 5.98, ipva: 2.5, icms: 12, cities: [{ name: "João Pessoa", iss: 5 }] },
  { uf: "PR", name: "Paraná", gas: 6.53, ipva: 3.5, icms: 12, cities: [{ name: "Curitiba", iss: 5 }] },
  { uf: "PE", name: "Pernambuco", gas: 6.38, ipva: 3, icms: 12, cities: [{ name: "Recife", iss: 5 }] },
  { uf: "PI", name: "Piauí", gas: 5.91, ipva: 2.5, icms: 12, cities: [{ name: "Teresina", iss: 5 }] },
  { uf: "RJ", name: "Rio de Janeiro", gas: 6.21, ipva: 4, icms: 12, cities: [{ name: "Rio de Janeiro", iss: 5 }] },
  { uf: "RN", name: "Rio Grande do Norte", gas: 6.35, ipva: 3, icms: 12, cities: [{ name: "Natal", iss: 5 }] },
  { uf: "RS", name: "Rio Grande do Sul", gas: 6.35, ipva: 3, icms: 12, cities: [{ name: "Porto Alegre", iss: 5 }] },
  { uf: "RO", name: "Rondônia", gas: 6.96, ipva: 2, icms: 12, cities: [{ name: "Porto Velho", iss: 5 }] },
  { uf: "RR", name: "Roraima", gas: 6.7, ipva: 3, icms: 12, cities: [{ name: "Boa Vista", iss: 5 }] },
  { uf: "SC", name: "Santa Catarina", gas: 6.41, ipva: 2, icms: 12, cities: [{ name: "Florianópolis", iss: 5 }] },
  { uf: "SP", name: "São Paulo", gas: 6.13, ipva: 4, icms: 12, cities: [{ name: "São Paulo", iss: 5 }] },
  { uf: "SE", name: "Sergipe", gas: 6.5, ipva: 2.5, icms: 12, cities: [{ name: "Aracaju", iss: 5 }] },
  { uf: "TO", name: "Tocantins", gas: 6.55, ipva: 2, icms: 12, cities: [{ name: "Palmas", iss: 5 }] },
];

const defaultState = statePresets.find((item) => item.uf === "SP") ?? statePresets[0];
const defaultCity = defaultState.cities[0]?.name ?? "";

const initialForm: FormState = {
  kmDia: 230,
  diasSemana: 6,
  horasDia: 10,
  margem: 20,
  faturamentoSemana: 2340,
  fipe: 62333,
  depreciacao: 24,
  parcela: 1660,
  seguro: 4200,
  licenciamento: 175,
  consumoKm: 10,
  trocaOleo: 350,
  pneus: 1800,
  manutencao: 350,
  lavagem: 70,
  alimentacao: 140,
  inss: 178.31,
  celular: 180,
  iss: defaultState.cities[0]?.iss ?? 5,
  icms: defaultState.icms,
  ipva: defaultState.ipva,
  precoGas: defaultState.gas,
  ipca: 4.14,
  corridaKm: 20.6,
  corridaMin: 28,
  corridaValorPago: 23.43,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value: number) {
  return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`;
}

function toMonthly(annualValue: number) {
  return annualValue / 12;
}

function clampNumber(value: number) {
  if (!Number.isFinite(value)) return 0;
  return value;
}

function calcMonthlyIrpf(monthlyTaxableIncome: number) {
  if (monthlyTaxableIncome <= 2428.8) return 0;
  if (monthlyTaxableIncome <= 2826.65) return monthlyTaxableIncome * 0.075 - 182.16;
  if (monthlyTaxableIncome <= 3751.05) return monthlyTaxableIncome * 0.15 - 394.16;
  if (monthlyTaxableIncome <= 4664.68) return monthlyTaxableIncome * 0.225 - 675.49;
  return monthlyTaxableIncome * 0.275 - 908.73;
}

function sectionMeta(section: string) {
  if (section.includes("FIXOS")) return "text-[#f5af46]";
  if (section.includes("VARIÁVEIS")) return "text-[#8dc6ff]";
  if (section.includes("ISS")) return "text-[#f5af46]";
  return "text-[#7ec7ff]";
}

function Home() {
  const [selectedState, setSelectedState] = useState(defaultState.uf);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [form, setForm] = useState<FormState>(initialForm);

  const activeState = useMemo(
    () => statePresets.find((item) => item.uf === selectedState) ?? defaultState,
    [selectedState],
  );

  const activeCity = useMemo(
    () => activeState.cities.find((item) => item.name === selectedCity) ?? activeState.cities[0],
    [activeState, selectedCity],
  );

  const calculations = useMemo(() => {
    const annualKm = clampNumber(form.kmDia * form.diasSemana * WEEKS_PER_YEAR);
    const monthlyKm = annualKm / 12;
    const annualHours = clampNumber(form.horasDia * form.diasSemana * WEEKS_PER_YEAR);
    const monthlyHours = annualHours / 12;
    const annualGross = clampNumber(form.faturamentoSemana * WEEKS_PER_YEAR);

    const fixedCosts: CostRow[] = [
      {
        section: "CUSTOS FIXOS",
        name: `Depreciação do Veículo (${formatPercent(form.depreciacao)})`,
        annual: clampNumber(form.fipe * (form.depreciacao / 100)),
      },
      {
        section: "CUSTOS FIXOS",
        name: `IPVA (${formatPercent(form.ipva)})`,
        annual: clampNumber(form.fipe * (form.ipva / 100)),
      },
      {
        section: "CUSTOS FIXOS",
        name: "Licenciamento e taxas anuais",
        annual: clampNumber(form.licenciamento),
      },
      {
        section: "CUSTOS FIXOS",
        name: "Seguro do Veículo",
        annual: clampNumber(form.seguro),
      },
      {
        section: "CUSTOS FIXOS",
        name: "Financiamento ou aluguel",
        annual: clampNumber(form.parcela * 12),
      },
      {
        section: "CUSTOS FIXOS",
        name: "INSS ou contribuição previdenciária",
        annual: clampNumber(form.inss * 12),
      },
      {
        section: "CUSTOS FIXOS",
        name: "Celular e internet",
        annual: clampNumber(form.celular * 12),
      },
    ];

    const variableCosts: CostRow[] = [
      {
        section: "CUSTOS VARIÁVEIS",
        name: "Alimentação",
        annual: clampNumber(form.alimentacao * WEEKS_PER_YEAR),
      },
      {
        section: "CUSTOS VARIÁVEIS",
        name: "Combustível",
        annual: annualKm > 0 ? clampNumber((annualKm / Math.max(form.consumoKm, 0.1)) * form.precoGas) : 0,
      },
      {
        section: "CUSTOS VARIÁVEIS",
        name: `Óleo e filtro (cada ${ANNUAL_OIL_INTERVAL_KM.toLocaleString("pt-BR")} km)`,
        annual: annualKm > 0 ? clampNumber((annualKm / ANNUAL_OIL_INTERVAL_KM) * form.trocaOleo) : 0,
      },
      {
        section: "CUSTOS VARIÁVEIS",
        name: "Troca de pneus",
        annual: annualKm > 0 ? clampNumber((annualKm / ANNUAL_TIRE_INTERVAL_KM) * form.pneus) : 0,
      },
      {
        section: "CUSTOS VARIÁVEIS",
        name: "Manutenção preventiva",
        annual: clampNumber(form.manutencao * 12),
      },
      {
        section: "CUSTOS VARIÁVEIS",
        name: "Lavagem do veículo",
        annual: clampNumber(form.lavagem * WEEKS_PER_YEAR),
      },
    ];

    const operationalBaseAnnual = [...fixedCosts, ...variableCosts].reduce((sum, row) => sum + row.annual, 0);
    const inflationAnnual = clampNumber(operationalBaseAnnual * (form.ipca / 100));
    const issAnnual = clampNumber(annualGross * (form.iss / 100));
    const icmsAnnual = clampNumber(annualGross * (form.icms / 100));
    const taxableMonthlyIncome = Math.max(0, (annualGross - operationalBaseAnnual - issAnnual) / 12);
    const irpfAnnual = clampNumber(calcMonthlyIrpf(taxableMonthlyIncome) * 12);

    const totalIssAnnual = operationalBaseAnnual + inflationAnnual + issAnnual + irpfAnnual;
    const totalIcmsAnnual = operationalBaseAnnual + inflationAnnual + icmsAnnual + irpfAnnual;

    const totalBasePerKmIss = annualKm > 0 ? totalIssAnnual / annualKm : 0;
    const totalBasePerKmIcms = annualKm > 0 ? totalIcmsAnnual / annualKm : 0;
    const totalBasePerHourIss = annualHours > 0 ? totalIssAnnual / annualHours : 0;
    const totalBasePerHourIcms = annualHours > 0 ? totalIcmsAnnual / annualHours : 0;

    const markupFactor = 1 + form.margem / 100;
    const markupKmUrban = totalBasePerKmIss * markupFactor;
    const markupHourUrban = totalBasePerHourIss * markupFactor;
    const markupMinUrban = markupHourUrban / 60;

    const markupKmInter = totalBasePerKmIcms * markupFactor;
    const markupHourInter = totalBasePerHourIcms * markupFactor;
    const markupMinInter = markupHourInter / 60;

    const comparisonTripByKm = markupKmUrban * form.corridaKm;
    const comparisonTripByTime = markupMinUrban * form.corridaMin;
    const comparisonTripTotal = comparisonTripByKm + comparisonTripByTime;
    const comparisonDifference = form.corridaValorPago - comparisonTripTotal;

    const taxRows: CostRow[] = [
      {
        section: "CUSTOS PERCENTUAIS — BASE ISS (URBANO)",
        name: "IRPF estimado (simplificação)",
        annual: irpfAnnual,
      },
      {
        section: "CUSTOS PERCENTUAIS — BASE ISS (URBANO)",
        name: `ISS — Imposto sobre Serviço (${formatPercent(form.iss)})`,
        annual: issAnnual,
      },
      {
        section: "CUSTOS PERCENTUAIS — BASE ISS (URBANO)",
        name: `Inflação IPCA (${formatPercent(form.ipca)})`,
        annual: inflationAnnual,
      },
      {
        section: "CUSTO EXTRA — BASE ICMS (INTERMUNICIPAL)",
        name: `ICMS (${formatPercent(form.icms)})`,
        annual: icmsAnnual,
      },
    ];

    const allRows = [...fixedCosts, ...variableCosts, ...taxRows];

    return {
      annualKm,
      monthlyKm,
      annualHours,
      monthlyHours,
      annualGross,
      operationalBaseAnnual,
      inflationAnnual,
      issAnnual,
      icmsAnnual,
      irpfAnnual,
      totalIssAnnual,
      totalIcmsAnnual,
      totalBasePerKmIss,
      totalBasePerKmIcms,
      totalBasePerHourIss,
      totalBasePerHourIcms,
      markupKmUrban,
      markupMinUrban,
      markupKmInter,
      markupMinInter,
      comparisonTripByKm,
      comparisonTripByTime,
      comparisonTripTotal,
      comparisonDifference,
      allRows,
      taxableMonthlyIncome,
    };
  }, [form]);

  function updateField<K extends keyof FormState>(field: K, value: number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleNumberChange<K extends keyof FormState>(field: K) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value.replace(",", "."));
      updateField(field, next);
    };
  }

  function handleStateChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextState = statePresets.find((item) => item.uf === event.target.value) ?? defaultState;
    const nextCity = nextState.cities[0]?.name ?? "";

    setSelectedState(nextState.uf);
    setSelectedCity(nextCity);
    setForm((current) => ({
      ...current,
      precoGas: nextState.gas,
      ipva: nextState.ipva,
      icms: nextState.icms,
      iss: nextState.cities[0]?.iss ?? current.iss,
    }));
  }

  function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextCity = activeState.cities.find((item) => item.name === event.target.value) ?? activeState.cities[0];
    setSelectedCity(nextCity?.name ?? "");
    if (nextCity) {
      setForm((current) => ({ ...current, iss: nextCity.iss }));
    }
  }

  function scrollToCalculator() {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetDefaults() {
    setSelectedState(defaultState.uf);
    setSelectedCity(defaultCity);
    setForm(initialForm);
  }

  const introStats = [
    {
      label: "Salário mínimo 2026",
      value: formatCurrency(1621),
      note: "base previdenciária atualizada",
    },
    {
      label: "IPCA 12 meses",
      value: formatPercent(4.14),
      note: "referência oficial até mar/2026",
    },
    {
      label: "Gasolina média Brasil",
      value: formatCurrency(6.29),
      note: "levantamento ANP em jan/2026",
    },
  ];

  const summaryCards = [
    {
      title: "Markup / km",
      value: calculations.markupKmUrban,
      subtitle: "Corridas urbanas",
      tone: "amber",
      badge: "ISS",
    },
    {
      title: "Markup / minuto",
      value: calculations.markupMinUrban,
      subtitle: "Corridas urbanas",
      tone: "amber",
      badge: "ISS",
    },
    {
      title: "Markup / km",
      value: calculations.markupKmInter,
      subtitle: "Intermunicipais",
      tone: "blue",
      badge: "ICMS",
    },
    {
      title: "Markup / minuto",
      value: calculations.markupMinInter,
      subtitle: "Intermunicipais",
      tone: "blue",
      badge: "ICMS",
    },
  ];

  const statusPositive = calculations.comparisonDifference >= 0;
  const coverageRatio = Math.min(
    100,
    calculations.comparisonTripTotal > 0 ? (form.corridaValorPago / calculations.comparisonTripTotal) * 100 : 0,
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-hero-2026-HXWj87hTbiAVJ44gbTrBG2.webp"
            alt="Ambiente urbano noturno com linguagem visual de mobilidade e operação profissional"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,6,0.95)_0%,rgba(5,5,6,0.83)_44%,rgba(5,5,6,0.55)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(245,175,70,0.22),transparent_30%),radial-gradient(circle_at_right_center,rgba(96,165,250,0.18),transparent_30%)]" />
        </div>

        <div className="container relative z-10 py-10 md:py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl space-y-7">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#f5af46]" />
                Markup Motorista 2026
              </div>

              <div className="space-y-5">
                <p className="max-w-2xl text-sm font-medium uppercase tracking-[0.32em] text-[#f5af46]">
                  Atualização econômica, visual e operacional do simulador original
                </p>
                <h1 className="max-w-4xl font-heading text-4xl uppercase leading-[0.95] md:text-6xl xl:text-7xl">
                  Descubra o valor mínimo que sua corrida precisa pagar para fazer sentido em 2026.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  Esta nova versão mantém a essência direta do site original, mas atualiza a leitura para 2026 com
                  referências de inflação, combustível e contribuição previdenciária mais recentes, além de uma
                  interface mais clara para analisar sua operação como negócio.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={scrollToCalculator}
                  className="h-12 rounded-none border border-[#f5af46]/50 bg-[#f5af46] px-6 font-semibold uppercase tracking-[0.22em] text-[#111111] shadow-[0_0_40px_rgba(245,175,70,0.18)] transition hover:bg-[#ffc46a]"
                >
                  Calcular meu markup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={resetDefaults}
                  className="h-12 rounded-none border-white/15 bg-white/5 px-6 font-semibold uppercase tracking-[0.22em] text-white hover:bg-white/10"
                >
                  Restaurar cenário base
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {introStats.map((stat) => (
                <article
                  key={stat.label}
                  className="relative overflow-hidden border border-white/12 bg-black/35 p-5 backdrop-blur-md"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(245,175,70,0.95),transparent)]" />
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{stat.label}</p>
                  <p className="mt-3 font-heading text-3xl uppercase text-white">{stat.value}</p>
                  <p className="mt-2 text-sm text-white/58">{stat.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="calculator" className="relative">
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[url('https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-surface-panel-2026-VH4jDpaGauBXjXZfbG8hfz.webp')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.15)_0%,rgba(9,9,11,1)_45%,rgba(9,9,11,1)_100%)]" />

        <div className="container relative z-10 py-10 md:py-14 lg:py-16">
          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <article className="border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3 text-[#f5af46]">
                    <Gauge className="h-4 w-4" />
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Rodagem anual</p>
                  </div>
                  <p className="mt-3 font-heading text-3xl uppercase text-white">
                    {calculations.annualKm.toLocaleString("pt-BR")}
                  </p>
                  <p className="mt-2 text-sm text-white/55">km/ano projetados pela sua operação.</p>
                </article>
                <article className="border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3 text-[#8dc6ff]">
                    <Clock3 className="h-4 w-4" />
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Horas mensais</p>
                  </div>
                  <p className="mt-3 font-heading text-3xl uppercase text-white">
                    {calculations.monthlyHours.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </p>
                  <p className="mt-2 text-sm text-white/55">base horária usada para custo por minuto.</p>
                </article>
                <article className="border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3 text-[#f5af46]">
                    <WalletCards className="h-4 w-4" />
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Base operacional</p>
                  </div>
                  <p className="mt-3 font-heading text-3xl uppercase text-white">
                    {formatCurrency(calculations.operationalBaseAnnual)}
                  </p>
                  <p className="mt-2 text-sm text-white/55">custos anuais antes de inflação e tributos percentuais.</p>
                </article>
                <article className="border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3 text-[#8dc6ff]">
                    <TrendingUp className="h-4 w-4" />
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Custo real por km</p>
                  </div>
                  <p className="mt-3 font-heading text-3xl uppercase text-white">
                    {formatCompactCurrency(calculations.annualKm > 0 ? calculations.operationalBaseAnnual / calculations.annualKm : 0)}
                  </p>
                  <p className="mt-2 text-sm text-white/55">quanto custa rodar 1 km sem adicionar lucro.</p>
                </article>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <section className="border border-white/10 bg-[#0f1014]/88 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5af46]">Configurações gerais</p>
                      <h2 className="mt-2 font-heading text-3xl uppercase text-white">Operação</h2>
                    </div>
                    <Calculator className="h-5 w-5 text-white/45" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <LabelledField label="KM por dia" help="Base da sua rodagem diária.">
                      <Input type="number" value={form.kmDia} onChange={handleNumberChange("kmDia")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Dias por semana" help="Dias efetivamente trabalhados.">
                      <Input type="number" value={form.diasSemana} onChange={handleNumberChange("diasSemana")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Horas por dia" help="Base para cálculo do custo por minuto.">
                      <Input type="number" value={form.horasDia} onChange={handleNumberChange("horasDia")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Margem desejada" help="Lucro desejado sobre o custo total.">
                      <Input type="number" value={form.margem} onChange={handleNumberChange("margem")} className="field-input" />
                    </LabelledField>
                    <div className="sm:col-span-2">
                      <LabelledField
                        label="Faturamento bruto por semana"
                        help="Usado para estimativa dos tributos percentuais sobre a operação."
                      >
                        <Input
                          type="number"
                          value={form.faturamentoSemana}
                          onChange={handleNumberChange("faturamentoSemana")}
                          className="field-input"
                        />
                      </LabelledField>
                    </div>
                  </div>
                </section>

                <section className="border border-white/10 bg-[#0f1014]/88 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5af46]">Veículo</p>
                      <h2 className="mt-2 font-heading text-3xl uppercase text-white">Base patrimonial</h2>
                    </div>
                    <CarFront className="h-5 w-5 text-white/45" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <LabelledField label="Valor FIPE" help="Usado para depreciação e IPVA.">
                      <Input type="number" value={form.fipe} onChange={handleNumberChange("fipe")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Depreciação anual (%)" help="Percentual anual estimado do veículo.">
                      <Input
                        type="number"
                        value={form.depreciacao}
                        onChange={handleNumberChange("depreciacao")}
                        className="field-input"
                      />
                    </LabelledField>
                    <LabelledField label="Parcela ou aluguel mensal" help="Financiamento ou locação do carro.">
                      <Input type="number" value={form.parcela} onChange={handleNumberChange("parcela")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Seguro anual" help="Seguro do veículo em 12 meses.">
                      <Input type="number" value={form.seguro} onChange={handleNumberChange("seguro")} className="field-input" />
                    </LabelledField>
                    <div className="sm:col-span-2">
                      <LabelledField label="Licenciamento e taxas anuais" help="Inclua licenciamento e outras taxas fixas do carro.">
                        <Input
                          type="number"
                          value={form.licenciamento}
                          onChange={handleNumberChange("licenciamento")}
                          className="field-input"
                        />
                      </LabelledField>
                    </div>
                  </div>
                </section>

                <section className="border border-white/10 bg-[#0f1014]/88 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8dc6ff]">Combustível e manutenção</p>
                      <h2 className="mt-2 font-heading text-3xl uppercase text-white">Rodagem</h2>
                    </div>
                    <Fuel className="h-5 w-5 text-white/45" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <LabelledField label="Consumo em km/l" help="Quanto o carro rende por litro.">
                      <Input type="number" value={form.consumoKm} onChange={handleNumberChange("consumoKm")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Preço da gasolina por litro" help="Valor inicial automático por estado, mas totalmente editável.">
                      <Input type="number" value={form.precoGas} onChange={handleNumberChange("precoGas")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Troca de óleo" help="Custo a cada 10 mil km.">
                      <Input type="number" value={form.trocaOleo} onChange={handleNumberChange("trocaOleo")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="4 pneus" help="Custo do jogo com vida útil considerada em 60 mil km.">
                      <Input type="number" value={form.pneus} onChange={handleNumberChange("pneus")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Manutenção preventiva / mês" help="Peças e revisões recorrentes.">
                      <Input type="number" value={form.manutencao} onChange={handleNumberChange("manutencao")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Lavagem / semana" help="Valor médio semanal para manter o carro rodando bem.">
                      <Input type="number" value={form.lavagem} onChange={handleNumberChange("lavagem")} className="field-input" />
                    </LabelledField>
                    <div className="sm:col-span-2">
                      <LabelledField label="Alimentação / semana" help="Custo básico da jornada de trabalho.">
                        <Input type="number" value={form.alimentacao} onChange={handleNumberChange("alimentacao")} className="field-input" />
                      </LabelledField>
                    </div>
                  </div>
                </section>

                <section className="border border-white/10 bg-[#0f1014]/88 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#8dc6ff]">Localização e impostos</p>
                      <h2 className="mt-2 font-heading text-3xl uppercase text-white">Contexto 2026</h2>
                    </div>
                    <MapPinned className="h-5 w-5 text-white/45" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <LabelledField label="Estado" help="Preenche gasolina, IPVA e ICMS sugeridos.">
                      <select value={selectedState} onChange={handleStateChange} className="field-select">
                        {statePresets.map((item) => (
                          <option key={item.uf} value={item.uf}>
                            {item.name} ({item.uf})
                          </option>
                        ))}
                      </select>
                    </LabelledField>
                    <LabelledField label="Cidade" help="Seleciona o ISS sugerido da cidade-base.">
                      <select value={selectedCity} onChange={handleCityChange} className="field-select">
                        {activeState.cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </LabelledField>
                    <LabelledField label="INSS mensal" help="Base inicial alinhada ao piso de 2026, mas editável.">
                      <Input type="number" value={form.inss} onChange={handleNumberChange("inss")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="Celular e internet / mês" help="Aplicativos, dados móveis e comunicação.">
                      <Input type="number" value={form.celular} onChange={handleNumberChange("celular")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="ISS (%)" help="Pode ser ajustado manualmente se sua prefeitura aplicar outra lógica.">
                      <Input type="number" value={form.iss} onChange={handleNumberChange("iss")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="ICMS (%)" help="Mantido como valor editável para cenários intermunicipais.">
                      <Input type="number" value={form.icms} onChange={handleNumberChange("icms")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="IPVA (%)" help="Valor sugerido por estado, também editável.">
                      <Input type="number" value={form.ipva} onChange={handleNumberChange("ipva")} className="field-input" />
                    </LabelledField>
                    <LabelledField label="IPCA (%)" help="Referência oficial recente: 4,14% em 12 meses até mar/2026.">
                      <Input type="number" value={form.ipca} onChange={handleNumberChange("ipca")} className="field-input" />
                    </LabelledField>
                  </div>

                  <div className="mt-5 border-l border-[#f5af46]/45 pl-4 text-sm leading-6 text-white/64">
                    <p>
                      <strong className="text-white">Base sugerida em 2026:</strong> salário mínimo de {formatCurrency(1621)},
                      gasolina média nacional em {formatCurrency(6.29)} e IPCA acumulado de {formatPercent(4.14)}.
                      Todos os campos continuam livres para ajuste conforme sua realidade.
                    </p>
                  </div>
                </section>
              </div>
            </section>

            <aside className="space-y-6 xl:sticky xl:top-6">
              <section className="overflow-hidden border border-white/12 bg-[#0d0e12] shadow-[0_40px_90px_rgba(0,0,0,0.4)]">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5af46]">Resultado do cálculo</p>
                  <h2 className="mt-2 font-heading text-3xl uppercase text-white">Seu markup necessário</h2>
                </div>
                <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-2">
                  {summaryCards.map((card) => (
                    <article key={`${card.title}-${card.subtitle}-${card.badge}`} className="bg-[#101117] p-5">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">{card.title}</p>
                      <p className="mt-3 font-heading text-4xl uppercase text-white">{formatCompactCurrency(card.value)}</p>
                      <p className="mt-2 text-sm text-white/58">{card.subtitle}</p>
                      <span
                        className={`mt-4 inline-flex border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${
                          card.tone === "amber"
                            ? "border-[#f5af46]/35 bg-[#f5af46]/10 text-[#f5af46]"
                            : "border-[#8dc6ff]/35 bg-[#8dc6ff]/10 text-[#8dc6ff]"
                        }`}
                      >
                        {card.badge}
                      </span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#8dc6ff]">Leitura rápida</p>
                    <h3 className="mt-2 font-heading text-2xl uppercase text-white">Raio-X da operação</h3>
                  </div>
                  <BarChart3 className="h-5 w-5 text-white/35" />
                </div>

                <div className="mt-5 space-y-4 text-sm leading-6 text-white/64">
                  <div className="flex items-start gap-3 border-b border-white/8 pb-4">
                    <WalletCards className="mt-1 h-4 w-4 text-[#f5af46]" />
                    <div>
                      <p className="font-semibold text-white">Custo total anual com base ISS</p>
                      <p>{formatCurrency(calculations.totalIssAnnual)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-b border-white/8 pb-4">
                    <Route className="mt-1 h-4 w-4 text-[#8dc6ff]" />
                    <div>
                      <p className="font-semibold text-white">Custo base por km sem lucro</p>
                      <p>
                        {formatCompactCurrency(
                          calculations.annualKm > 0 ? calculations.totalBasePerKmIss : 0,
                        )} <span className="text-white/35">com impostos e inflação na base ISS</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-b border-white/8 pb-4">
                    <Shield className="mt-1 h-4 w-4 text-[#f5af46]" />
                    <div>
                      <p className="font-semibold text-white">Tributação estimada</p>
                      <p>
                        ISS: {formatCurrency(calculations.issAnnual)} · ICMS: {formatCurrency(calculations.icmsAnnual)} · IRPF estimado: {formatCurrency(calculations.irpfAnnual)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Landmark className="mt-1 h-4 w-4 text-[#8dc6ff]" />
                    <div>
                      <p className="font-semibold text-white">Lucro tributável mensal estimado</p>
                      <p>{formatCurrency(calculations.taxableMonthlyIncome)}</p>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <section className="border-t border-white/10 bg-[#08090c]">
        <div className="container py-10 md:py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5af46]">Detalhamento de custos</p>
              <h2 className="mt-2 font-heading text-3xl uppercase text-white md:text-4xl">Valores por km, por hora, mensais e anuais</h2>
            </div>
            <p className="max-w-md text-right text-sm leading-6 text-white/55">
              A tabela abaixo organiza a operação do mesmo jeito que o site original fazia, mas com leitura refinada para
              2026 e cálculo contínuo.
            </p>
          </div>

          <div className="overflow-hidden border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-left text-[11px] uppercase tracking-[0.24em] text-white/46">
                    <th className="px-4 py-4">Item</th>
                    <th className="px-4 py-4">Por km</th>
                    <th className="px-4 py-4">Por hora</th>
                    <th className="px-4 py-4">Mensal</th>
                    <th className="px-4 py-4">Anual</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.allRows.map((row, index) => {
                    const previous = calculations.allRows[index - 1];
                    const showSection = !previous || previous.section !== row.section;
                    const annual = row.annual;
                    const monthly = toMonthly(annual);
                    const perKm = calculations.annualKm > 0 ? annual / calculations.annualKm : 0;
                    const perHour = calculations.annualHours > 0 ? annual / calculations.annualHours : 0;

                    return (
                      <FragmentRow
                        key={`${row.section}-${row.name}`}
                        showSection={showSection}
                        section={row.section}
                        sectionClass={sectionMeta(row.section)}
                        name={row.name}
                        perKm={perKm}
                        perHour={perHour}
                        monthly={monthly}
                        annual={annual}
                      />
                    );
                  })}
                  <SummaryRow
                    label="TOTAL DOS CUSTOS (base ISS)"
                    perKm={calculations.totalBasePerKmIss}
                    perHour={calculations.totalBasePerHourIss}
                    monthly={toMonthly(calculations.totalIssAnnual)}
                    annual={calculations.totalIssAnnual}
                  />
                  <SummaryRow
                    label="TOTAL DOS CUSTOS (base ICMS)"
                    perKm={calculations.totalBasePerKmIcms}
                    perHour={calculations.totalBasePerHourIcms}
                    monthly={toMonthly(calculations.totalIcmsAnnual)}
                    annual={calculations.totalIcmsAnnual}
                  />
                  <SummaryRow
                    label={`MARKUP FINAL (+ ${formatPercent(form.margem)} margem, base ISS)`}
                    perKm={calculations.markupKmUrban}
                    perHour={calculations.markupMinUrban * 60}
                    monthly={toMonthly(calculations.totalIssAnnual) * (1 + form.margem / 100)}
                    annual={calculations.totalIssAnnual * (1 + form.margem / 100)}
                    highlight
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-comparison-2026-XfUMMG7y65ovsCb2bBCVgJ.webp"
            alt="Interior de carro em cenário noturno sugerindo comparação entre custo e rentabilidade"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.95)_0%,rgba(9,9,11,0.78)_52%,rgba(9,9,11,0.96)_100%)]" />
        </div>

        <div className="container relative z-10 py-10 md:py-16">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
            <div className="max-w-2xl space-y-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5af46]">Comparativo</p>
              <h2 className="font-heading text-4xl uppercase text-white md:text-5xl">
                Compare o que a corrida paga com o que ela realmente precisa render.
              </h2>
              <p className="text-base leading-7 text-white/66">
                O simulador abaixo conserva a lógica didática do site original: você testa uma corrida real, observa quanto
                seu markup pediria por quilômetro e por tempo, e compara isso com o valor efetivamente recebido.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="border border-white/10 bg-black/40 p-5 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8dc6ff]">Corrida de teste</p>
                <div className="mt-5 grid gap-4">
                  <LabelledField label="Distância da corrida (km)" help="Exemplo original: 20,6 km.">
                    <Input type="number" value={form.corridaKm} onChange={handleNumberChange("corridaKm")} className="field-input" />
                  </LabelledField>
                  <LabelledField label="Tempo da corrida (min)" help="Exemplo original: 28 min.">
                    <Input type="number" value={form.corridaMin} onChange={handleNumberChange("corridaMin")} className="field-input" />
                  </LabelledField>
                  <LabelledField label="Valor pago pelo app" help="Quanto entrou para você nessa corrida.">
                    <Input
                      type="number"
                      value={form.corridaValorPago}
                      onChange={handleNumberChange("corridaValorPago")}
                      className="field-input"
                    />
                  </LabelledField>
                </div>
              </section>

              <section className="border border-white/10 bg-black/45 p-5 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5af46]">Leitura do markup</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <article className="border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-white/42">Ganho por km</p>
                    <p className="mt-3 font-heading text-3xl uppercase text-white">{formatCurrency(calculations.comparisonTripByKm)}</p>
                  </article>
                  <article className="border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-white/42">Ganho por tempo</p>
                    <p className="mt-3 font-heading text-3xl uppercase text-white">{formatCurrency(calculations.comparisonTripByTime)}</p>
                  </article>
                </div>

                <article className="mt-4 border border-white/10 bg-gradient-to-br from-[#f5af46]/14 to-white/[0.02] p-5">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-white/48">Valor total pelo seu markup</p>
                  <p className="mt-3 font-heading text-5xl uppercase text-white">{formatCurrency(calculations.comparisonTripTotal)}</p>
                </article>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-sm text-white/62">
                    <span>Cobertura do valor pago</span>
                    <span>{coverageRatio.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden bg-white/8">
                    <div
                      className={`h-full ${statusPositive ? "bg-[#8dc6ff]" : "bg-[#f5af46]"}`}
                      style={{ width: `${coverageRatio}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`mt-5 border px-4 py-4 text-sm leading-6 ${
                    statusPositive
                      ? "border-[#8dc6ff]/35 bg-[#8dc6ff]/10 text-[#d7ebff]"
                      : "border-[#f5af46]/35 bg-[#f5af46]/10 text-[#ffe5b7]"
                  }`}
                >
                  <p className="font-semibold uppercase tracking-[0.16em]">
                    {statusPositive ? "A corrida cobre o markup calculado" : "A corrida está abaixo do markup calculado"}
                  </p>
                  <p className="mt-2">
                    {statusPositive
                      ? `Nesse cenário, a corrida supera sua necessidade mínima em ${formatCurrency(
                          calculations.comparisonDifference,
                        )}.`
                      : `Nesse cenário, a corrida fica ${formatCurrency(
                          Math.abs(calculations.comparisonDifference),
                        )} abaixo do valor necessário para cobrir sua meta e seus custos.`}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 bg-[#090a0e]">
        <div className="absolute inset-0 bg-[url('https://d2xsxph8kpxj0f.cloudfront.net/310419663030663751/fkHFhYuyUVnAAYLW9xoEJz/markup-urban-grid-2026-AP3xmpTcctCiR6WoMuXgXm.webp')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,14,0.92)_0%,rgba(9,10,14,0.95)_100%)]" />

        <div className="container relative z-10 py-10 md:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-[#f5af46]">
                <Route className="h-5 w-5" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/58">Como ler o km</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/68">
                O valor por quilômetro condensa depreciação, combustível, pneus, manutenção e tributos sobre a operação.
                Ele mostra quanto o carro precisa gerar só para continuar saudável financeiramente.
              </p>
            </article>
            <article className="border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-[#8dc6ff]">
                <Clock3 className="h-5 w-5" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/58">Como ler o minuto</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/68">
                O custo por minuto evita que corridas longas e lentas pareçam boas apenas pela distância. Ele traduz sua
                jornada diária em tempo operacional real, preservando a rentabilidade da hora trabalhada.
              </p>
            </article>
            <article className="border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-[#f5af46]">
                <Wrench className="h-5 w-5" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/58">Como decidir</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/68">
                Se o valor real da corrida não encosta no markup necessário, você pode estar girando faturamento sem gerar
                margem. O objetivo deste painel é transformar sensação em número e número em decisão.
              </p>
            </article>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
            <p>
              Referências usadas na atualização: Senado Federal, INSS, IBGE e ANP reproduzida por fonte setorial em janeiro de 2026.
            </p>
            <p>Markup Motorista 2026 — releitura visual e funcional da calculadora original.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

type LabelledFieldProps = {
  label: string;
  help: string;
  children: ReactNode;
};

function LabelledField({ label, help, children }: LabelledFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/48">{label}</span>
      {children}
      <span className="block text-xs leading-5 text-white/42">{help}</span>
    </label>
  );
}

type FragmentRowProps = {
  showSection: boolean;
  section: string;
  sectionClass: string;
  name: string;
  perKm: number;
  perHour: number;
  monthly: number;
  annual: number;
};

function FragmentRow({ showSection, section, sectionClass, name, perKm, perHour, monthly, annual }: FragmentRowProps) {
  return (
    <>
      {showSection ? (
        <tr className="border-t border-white/10 bg-white/[0.015]">
          <td colSpan={5} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] ${sectionClass}`}>
            {section}
          </td>
        </tr>
      ) : null}
      <tr className="border-t border-white/6 text-sm text-white/72 transition hover:bg-white/[0.025]">
        <td className="px-4 py-3 text-white/84">{name}</td>
        <td className="px-4 py-3">{formatCompactCurrency(perKm)}</td>
        <td className="px-4 py-3">{formatCurrency(perHour)}</td>
        <td className="px-4 py-3">{formatCurrency(monthly)}</td>
        <td className="px-4 py-3">{formatCurrency(annual)}</td>
      </tr>
    </>
  );
}

type SummaryRowProps = {
  label: string;
  perKm: number;
  perHour: number;
  monthly: number;
  annual: number;
  highlight?: boolean;
};

function SummaryRow({ label, perKm, perHour, monthly, annual, highlight = false }: SummaryRowProps) {
  return (
    <tr
      className={`border-t ${
        highlight
          ? "border-[#f5af46]/35 bg-[#f5af46]/10 text-[#fff3df]"
          : "border-white/10 bg-white/[0.03] text-white"
      } font-semibold`}
    >
      <td className="px-4 py-4 uppercase tracking-[0.08em]">{label}</td>
      <td className="px-4 py-4">{formatCompactCurrency(perKm)}</td>
      <td className="px-4 py-4">{formatCurrency(perHour)}</td>
      <td className="px-4 py-4">{formatCurrency(monthly)}</td>
      <td className="px-4 py-4">{formatCurrency(annual)}</td>
    </tr>
  );
}

export default Home;
