from travel_time_model import a, b, TravelTime, VelocityAt, GetCruiseSpeed, GetDistance


def IntegrateDistance(d, v, a, b, dt):
  T = TravelTime(d, v, a, b)
  total_distance = 0.0
  t = 0.0

  while t < T:
    step = min(dt, T - t)  # Prevents overshooting T on the final slice
    total_distance += VelocityAt(t, d, v, a, b) * step
    t += dt

  return total_distance


if __name__ == "__main__":
  sLine = "VERMELHA"
  station = "ARTUR ALVIM"
  
  
  d = GetDistance(station, sLine)
  v = GetCruiseSpeed(sLine)


  print(f"IntegrateDistance Test: {IntegrateDistance(d, v, a, b, dt=0.1)}")
  print(f"IntegrateDistance Test: {IntegrateDistance(d, v, a, b, dt=0.01)}")
  print(f"IntegrateDistance Test: {IntegrateDistance(d, v, a, b, dt=0.001)}")