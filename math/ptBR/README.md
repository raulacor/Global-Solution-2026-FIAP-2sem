🌐 **Português** · [English](../enUS/README.md)

# CitizenTech — Metrô SP · Modelagem Matemática

Entrega de **Differentiated Problem Solving** (GS 2026.2).

Modelo do movimento do trem entre duas estações (aceleração, cruzeiro, frenagem), usando limites, derivadas e integrais para obter o tempo de viagem que alimenta o cálculo de rota da aplicação.

```
models/
  travel_time_model.py   modelo central: TravelTime, TravelTimeDerivative, VelocityAt
  validation.py          LineRunningTime, LineRealTime, LineOverhead (vs dados do Metrô)
  integral.py            IntegrateDistance + teste de convergência em dt
  plots.py               gera as três figuras
plotOutputs/             figuras (PNG) usadas no relatório
report/                  relatório técnico em PDF
```

**Executar** (a partir de `math/models/`, Python 3.12+, `pip install -r ../requirements.txt`):

```bash
python3 travel_time_model.py   # testes do modelo
python3 validation.py          # acréscimo por linha
python3 integral.py            # convergência de ∫v dt = d
python3 plots.py               # gera ../plotOutputs/*.png
```

## O modelo

O movimento do trem entre duas estações segue um perfil de velocidade trapezoidal: acelera com `a`, cruza com `v` e freia com `b`. Os três valores são dados publicados pelo Metrô: `a = 1,1 m/s²`, `b = 1,2 m/s²` e a velocidade máxima da linha (87 km/h na Azul e na Vermelha, 83 na Prata, 80 nas demais).

| Caso | Condição | Tempo de viagem |
|---|---|---|
| Trapézio (atinge o cruzeiro) | `d ≥ v²/(2a) + v²/(2b)` | `T = d/v + v/(2a) + v/(2b)` |
| Triângulo (curto demais para cruzar) | `d < v²/(2a) + v²/(2b)` | `v_pico = √(d / (1/(2a) + 1/(2b)))`, `T = v_pico/a + v_pico/b` |

Exemplo: Artur Alvim → Corinthians-Itaquera (Linha 3, 1397,5 m) leva **78,9 s**.

## Limites

A distância de transição `v²/(2a) + v²/(2b)` é de cerca de 509 m a 87 km/h. Aproximando-se dela por qualquer lado, as duas fórmulas tendem ao mesmo valor (cerca de 42,1 s), portanto `T(d)` é **contínua** na transição.

## Derivada — quanto custa a "Velocidade Reduzida"

```
dT/dv = −d/v² + 1/(2a) + 1/(2b)      (trapézio)
dT/dv = 0                             (triângulo: v_pico não depende de v)
```

- Artur Alvim → Corinthians: `dT/dv ≈ −1,52 s por m/s`, ou seja, **≈ 0,43 s por km/h** perdido (÷ 3,6).
- Igualar `dT/dv = 0` resulta exatamente na expressão de `v_pico`, então a derivada marca a mesma fronteira da seção de limites.
- **Não linearidade:** reduzindo a velocidade de 87 para 60 km/h, a estimativa linear é 27 × 0,43 ≈ 11,6 s, mas a diferença real é **19,5 s** (98,4 − 78,9). O termo `d/v²` cresce quando `v` cai: *cada km/h a menos acumulado acrescenta progressivamente mais tempo à viagem.*

## Integral — a distância é a área sob v(t)

`d = ∫₀ᵀ v(t) dt`. A área do trapézio se divide em três partes: rampa de aceleração `v²/(2a)`, retângulo de cruzeiro `d − v²/(2a) − v²/(2b)` e rampa de frenagem `v²/(2b)`. Somadas, dão exatamente `d`, então o modelo é autoconsistente. (As duas rampas juntas também formam a distância de transição da seção de limites.)

`VelocityAt(t, …)` retorna `a·t` na aceleração, `v_pico` no cruzeiro e `b·(T − t)` na frenagem. `IntegrateDistance` soma `v(t)·dt` numericamente (Artur Alvim → Corinthians, `d` real = 1397,52194 m):

| dt | Resultado (m) | Erro (m) |
|---|---|---|
| 0,1 | 1397,51845 | 0,0035 |
| 0,01 | 1397,52192 | 0,00003 |
| 0,001 | 1397,52194 | 0,0000003 |

Quando `dt → 0`, a soma de Riemann converge para `d`. Essa é a definição da integral definida como limite.

## Figuras

| Arquivo | Mostra | Seção |
|---|---|---|
| `plotOutputs/velocity_profile_artur_alvim.png` | trapézio `v(t)`; sua área é `d` | Integral |
| `plotOutputs/travel_time_vs_top_speed_artur_alvim.png` | `T` × velocidade máxima, 20–87 km/h; mais íngreme em baixa velocidade | Derivada |
| `plotOutputs/travel_time_vs_distance_artur_alvim.png` | `T` × `d` a 87 km/h; contínua na transição de 509 m | Limites |

## Validação com dados do Metrô

Tempo de percurso do modelo em cada linha (soma de `T` em todos os trechos) comparado com o tempo implícito na velocidade comercial publicada pelo Metrô (set/2026). A diferença, dividida igualmente entre os trechos, é o **acréscimo por parada**: tempo na plataforma mais circulação abaixo da velocidade máxima. O modelo não inclui nenhum dos dois.

| Linha | Velocidade comercial | Acréscimo por parada |
|---|---|---|
| 1-Azul | 30 km/h | 49,8 s |
| 2-Verde | 32 km/h | 55,2 s |
| 3-Vermelha | 32 km/h | 69,2 s |
| 15-Prata | 35 km/h | 60,3 s |

Linha 3-Vermelha: 2427 s reais contra 1251 s do modelo, ou seja, faltam 1176 s distribuídos em 17 trechos.

**Interpretação:** o acréscimo é maior na Linha 3-Vermelha, a linha que o próprio Metrô aponta como a de fluxo de passageiros mais concentrado. A Sé, onde as Linhas 1 e 3 se encontram, é a estação mais movimentada do sistema, e a maior parte do seu público está na Linha 3 (~199 mil/dia) e não na Linha 1 (~169 mil/dia). A lotação alonga o tempo em cada plataforma. No cálculo de rotas, o peso de cada trecho passa a ser `T + acréscimo(linha)`, o que calibra os tempos absolutos com dados reais, enquanto o modelo continua captando o formato de cada trecho e o efeito da velocidade reduzida.

**Fontes:** Portal da Transparência do Metrô (dataset "oferta"; relatórios do sistema e de planejamento); Gazeta SP (números da estação Sé); Diário do Transporte (ocorrência na Linha 3, 07/09/2026).

## Autor

Raul Azzi Corsi — RM569022
