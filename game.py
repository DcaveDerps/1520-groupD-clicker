import math

class Building():

    name = ""
    cps_boost = 0
    base_price = 0
    scale_factor = 1

    def __init__(self, name, cps_boost, base_price, scale_factor):
        self.name = name
        self.cps_boost = cps_boost
        self.base_price = base_price
        self.scale_factor = scale_factor

    def current_price(self, num_owned):
        return math.floor(self.base_price + (self.base_price * ((num_owned ** 2) / 8)))


# Factory Constants
FACTORY_ASSEMBLYLINE = Building("Assembly Line", 111, 1000, 1.15)