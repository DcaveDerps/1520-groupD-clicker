import math
import ds

class Building():

    name = ""
    cps_boost = 0
    base_price = 0
    scale_factor = 1
    ID = -1

    def __init__(self, name, cps_boost, base_price, scale_factor, ID):
        self.name = name
        self.cps_boost = cps_boost
        self.base_price = base_price
        self.scale_factor = scale_factor
        self.ID = ID

    def current_price(self, num_owned):
        return math.floor(self.base_price + (self.base_price * ((num_owned ** 2) / 8)))


# Factory Constants
FACTORY_ASSEMBLYLINE = Building("Assembly Line", 111, 1000, 1.15, 1)

def purchase(user, building):
    cur_price = building.current_price(user['factories'][building.ID])
    if user['collectibles'] >= cur_price:
        user['collectibles'] -= cur_price
        user['factories'][building.ID] += 1
    else:
        print("Can't afford the building!")