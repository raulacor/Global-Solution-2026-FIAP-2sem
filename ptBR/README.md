🌐 **Português** · [English](../enUS/README.md)

# CitizenTech — Metrô SP

> Global Solution 2026.2 · FIAP · Engenharia de Software · 1º ano

## Ficha da CitizenTech

| Campo | Conteúdo |
|---|---|
| **Nome da CitizenTech** | _a definir_ |
| **Cidade e bairro** | São Paulo — rede do Metrô |
| **Cidadão beneficiado** | Passageiro que depende do metrô no dia a dia |
| **Problema, em uma frase** | _a definir_ |
| **Como funciona** | Mapa da rede do metrô com a situação real das linhas; o usuário escolhe origem e destino e vê a rota mais rápida desenhada no mapa |
| **O que cada parte faz** | Ver [Estrutura do repositório](#estrutura-do-repositório) |
| **Link do repositório** | _a definir_ |
| **Indicador de impacto** | _a definir_ |
| **ODS conectados** | _a definir_ |

**Dados:** somente dados reais e públicos.
- Estações e traçados: GeoSampa (Prefeitura de São Paulo), versão de 26/11/2024
- Velocidade comercial e intervalo mínimo entre trens por linha: Portal da Transparência do Metrô, dataset "oferta" (linhas 1, 2, 3 e 15)
- Ambos obtidos via [viniciusoike/metrosp](https://github.com/viniciusoike/metrosp) (licença MIT)
- Situação das linhas em tempo real: Direto do Metrô (a incorporar)

## Estrutura do repositório

```
python/          Lógica — Computational Thinking with Python
  metro/         núcleo compartilhado (rede, tempo de viagem, status, rota)
  main.py        CLI com menu
  data/          dados reais usados pela aplicação
data-prep/       script único que transforma os dados públicos brutos em python/data/network.json
math/            Matemática — Differentiated Problem Solving
  models/        modelos e gráficos em Python
  report/        relatório técnico (PDF)
web/             Interface + Interação — Front-end Design e Web Development
  src/components componentes React
  src/hooks      custom hooks
  src/services   acesso a dados e APIs
  src/lib        regras de negócio do front-end
assets/3d/       modelo 3D do mapa
AI.md            uso de IA (Front-end / Web Development)
ptBR/ · enUS/    cada documento nos dois idiomas (em todas as pastas)
```

O pacote `python/metro` é a mesma lógica nas duas pontas: a CLI importa direto, e o navegador o executa via [Pyodide](https://pyodide.org).

## Como rodar

**Web**

```bash
cd web
npm install
npm run dev
```

**CLI**

```bash
cd python
python3 main.py
```

## Autor

Raul Azzi Corsi — RM569022
