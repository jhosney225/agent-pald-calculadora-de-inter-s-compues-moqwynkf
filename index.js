
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Sistema de herramientas para cálculos de interés compuesto
const tools = [
  {
    name: "calcular_interes_compuesto",
    description:
      "Calcula el monto final de una inversión con interés compuesto usando la fórmula A = P(1 + r/n)^(nt)",
    input_schema: {
      type: "object",
      properties: {
        capital_inicial: {
          type: "number",
          description:
            "El capital inicial invertido en moneda (por ejemplo, 1000)",
        },
        tasa_anual: {
          type: "number",
          description:
            "La tasa de interés anual en porcentaje (por ejemplo, 5 para 5%)",
        },
        periodo_años: {
          type: "number",
          description: "El número de años para los que se invierte el capital",
        },
        frecuencia_capitalizacion: {
          type: "string",
          enum: ["anual", "semestral", "trimestral", "mensual", "diario"],
          description: "Con qué frecuencia se capitaliza el interés",
        },
      },
      required: [
        "capital_inicial",
        "tasa_anual",
        "periodo_años",
        "frecuencia_capitalizacion",
      ],
    },
  },
  {
    name: "comparar_inversiones",
    description:
      "Compara dos escenarios de inversión diferentes y muestra cuál es más rentable",
    input_schema: {
      type: "object",
      properties: {
        capital: {
          type: "number",
          description: "El capital inicial para ambas inversiones",
        },
        tasa1: {
          type: "number",
          description: "Tasa de interés anual de la primera inversión en %",
        },
        tasa2: {
          type: "number",
          description: "Tasa de interés anual de la segunda inversión en %",
        },
        años: {
          type: "number",
          description: "Período en años",
        },
        frecuencia1: {
          type: "string",
          enum: ["anual", "semestral", "trimestral", "mensual", "diario"],
          description: "Frecuencia de capitalización de la primera inversión",
        },
        frecuencia2: {
          type: "string",
          enum: ["anual", "semestral", "trimestral", "mensual", "diario"],
          description: "Frecuencia de capitalización de la segunda inversión",
        },
      },
      required: [
        "capital",
        "tasa1",
        "tasa2",
        "años",
        "frecuencia1",
        "frecuencia2",
      ],
    },
  },
  {
    name: "calcular_tiempo_duplicacion",
    description:
      "Calcula cuánto tiempo tarda el capital en duplicarse con una tasa de interés dada",
    input_schema: {
      type: "object",
      properties: {
        capital_inicial: {
          type: "number",
          description: "El capital inicial invertido",
        },
        tasa_anual: {
          type: "number",
          description: "La tasa de interés anual en porcentaje",
        },
        frecuencia_capitalizacion: {
          type: "string",
          enum: ["anual", "semestral", "trimestral", "mensual", "diario"],
          description: "Frecuencia de capitalización",
        },
      },
      required: [
        "capital_inicial",
        "tasa_anual",
        "frecuencia_capitalizacion",
      ],
    },
  },
];

// Funciones de cálculo
function obtenerFrecuencia(frecuencia) {
  const frecuencias = {
    anual: 1,
    semestral: 2,
    trimestral: 4,
    mensual: 12,
    diario: 365,
  };
  return frecuencias[frecuencia] || 1;
}

function calcularInteresCompuesto(
  capitalInicial,
  tasaAnual,
  periodoAños,
  frecuenciaCapitalizacion
) {
  const n = obtenerFrecuencia(frecuenciaCapitalizacion);
  const r = tasaAnual / 100;
  const t = periodoAños;

  const montoFinal = capitalInicial * Math.pow(1 + r / n, n * t);
  const interesGenerado = montoFinal - capitalInicial;

  return {
    monto_final: Math.round(montoFinal * 100) / 100,
    interes_generado: Math.round(interesGenerado * 100) / 100,
    capital_inicial: capitalInicial,
    tasa_anual: tasaAnual,
    periodo_años: periodoAños,
    frecuencia: frecuenciaCapitalizacion,
  };
}

function compararInversiones(
  capital,
  tasa1,
  tasa2,
  años,
  frecuencia1,
  frecuencia2
) {
  const inv1 = calcularInteresCompuesto(capital, tasa1, años, frecuencia1);
  const inv2 = calcularInteresCompuesto(capital, tasa2, años, frecuencia2);

  const diferencia = inv1.monto_final - inv2.monto_final;
  const mejorOpcion = diferencia > 0 ? "Primera inversión" : "Segunda inversión";

  return {
    inversion_1: inv1,
    inversion_2: inv2,
    diferencia_