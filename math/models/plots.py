import matplotlib.pyplot as plt

from travel_time_model import a, b, GetDistance, GetCruiseSpeed, VelocityAt, TravelTime

sLine = "VERMELHA"
station = "ARTUR ALVIM"
slug = station.replace(" ", "_").lower()

d = GetDistance(station, sLine)
v = GetCruiseSpeed(sLine)


plt.figure()
xs = []
ys = []
t = 0
T = TravelTime(d, v, a, b)
while t <= T:
    xs.append(t)
    ys.append(VelocityAt(t, d, v, a, b))
    t += 0.1

xs.append(T)  
ys.append(0)  

plt.plot(xs, ys)
plt.xlabel("Tempo (s)")
plt.ylabel("Velocidade (m/s)")
plt.title(f"Perfil de velocidade v(t) — {station.title()}, Linha {sLine.title()}")

plt.savefig(f"../plotOutputs/velocity_profile_{slug}.png") # integral 


plt.figure()
xs = []
ys = []
v = 20
while v <= 87:
    xs.append(v)
    ys.append(TravelTime(d, v/3.6, a, b))
    v +=1

plt.plot(xs, ys)
plt.xlabel("Velocidade máxima (km/h)")
plt.ylabel("Tempo de viagem (s)")
plt.title(f"Tempo de viagem × velocidade máxima — {station.title()}, Linha {sLine.title()}")
plt.savefig(f"../plotOutputs/travel_time_vs_top_speed_{slug}.png")


plt.figure()
xs = []
ys = []
d = 50
v = GetCruiseSpeed(sLine)
while d <= 1500:
    xs.append(d)
    ys.append(TravelTime(d, v, a, b))
    d += 1


switch = v**2 / (2 * a) + v**2 / (2 * b)
plt.axvline(switch, linestyle="--", label="transição ≈ 509 m")
plt.legend()

plt.plot(xs, ys)
plt.xlabel("Distância do trecho (m)")
plt.ylabel("Tempo de viagem (s)")
plt.title("Tempo de viagem × distância — transição triângulo/trapézio a 87 km/h")
plt.savefig(f"../plotOutputs/travel_time_vs_distance_{slug}.png")