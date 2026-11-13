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
plt.xlabel("Time (s)")
plt.ylabel("Velocity (m/s)")
plt.title(f"Velocity profile at {station} line: {sLine}")

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
plt.xlabel("Top speed (km/h)")
plt.ylabel("Travel time (s)")
plt.title(f"Travel time vs top speed at {station} line: {sLine}")
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
plt.axvline(switch, linestyle="--", label="switch ≈ 509 m")
plt.legend()

plt.plot(xs, ys)
plt.xlabel("Segment distance (m)")
plt.ylabel("Travel time (s)")
plt.title("Travel time vs distance — triangle/trapezoid switch at 87 km/h")
plt.savefig(f"../plotOutputs/travel_time_vs_distance_{slug}.png")