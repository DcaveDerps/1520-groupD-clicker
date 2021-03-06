import math
import ds
import flask
import json


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

def leaveGame():
    print("\n\nThe update function in GAME the python runs!")
    for val in flask.request.values:
        print(f"{val} = {flask.request.values[val]}")
    return flask.jsonify({'success': True, 'message': 'It ran'})

def incCollectibles():
    acc = ds.get_user_account(flask.request.values['uname'])
    acc['collectibles'] = acc['collectibles'] + 1
    ds.update_entity(acc)
    print(f"{acc['uname']} now has {acc['collectibles']} collectibles")
    return flask.jsonify({'success': True, 'message': 'It ran'})

def updateAccountFromJson():
    
    accJson = flask.request.get_json(True, True)

    acc = ds.get_user_account(accJson['uname'])
    acc['collectibles'] = int(accJson['collectibles'])
    acc['cps'] = int(accJson['cps'])
    acc['left_game'] = accJson['left_game']
    acc['factories'] = accJson['factories']
    acc['saved_imgs'] = accJson['saved_imgs']
    acc['friend_list'] = accJson['friend_list']
    acc['collectible_label_s'] = accJson['collectible_label_s']
    acc['collectible_label_p'] = accJson['collectible_label_p']
    acc['sel_img'] = accJson['sel_img']
    acc['sel_template'] = accJson['sel_template']
    acc['colors'] = accJson['colors']
    ds.update_entity(acc)
    print(str(acc['uname']) + " now has " + str(acc['collectibles']) + " collectibles\n" + str(acc['cps']) + " cps\n" + str(acc['factories']))
    response = dict(success=True)

    return flask.Response(json.dumps(response), mimetype='application/json')

def getAccountJson():
    print("in game.py getAccountJson()")
    acc_dict = {}
    acc = ds.get_user_account(flask.request.values['uname'])
    acc_dict['uname'] = acc['uname']
    # acc_dict['password'] = acc['password']
    acc_dict['collectibles'] = acc['collectibles']
    acc_dict['cps'] = acc['cps']
    acc_dict['left_game'] = acc['left_game']
    acc_dict['factories'] = acc['factories']
    acc_dict['saved_imgs'] = acc['saved_imgs']
    acc_dict['friend_list'] = acc['friend_list']
    acc_dict['collectible_label_s'] = acc['collectible_label_s']
    acc_dict['collectible_label_p'] = acc['collectible_label_p']
    acc_dict['sel_img'] = acc['sel_img']
    acc_dict['sel_template'] = acc['sel_template']
    acc_dict['colors'] = acc['colors']
    #print("gonna try and return " + acc_dict)
    return flask.Response(json.dumps(acc_dict), mimetype='application/json')

# returns a dictionary of a user account without the user password hash
def getAccountDict(userName: str):
    print("in game.py getAccountJsonNoReq()")
    acc_dict = {}
    acc = ds.get_user_account(userName)
    if acc == None:
        acc_dict['uname'] = None
        return acc_dict
    acc_dict['uname'] = acc['uname']
    # acc_dict['password'] = acc['password']
    acc_dict['collectibles'] = acc['collectibles']
    acc_dict['cps'] = acc['cps']
    acc_dict['left_game'] = acc['left_game']
    acc_dict['factories'] = acc['factories']
    acc_dict['saved_imgs'] = acc['saved_imgs']
    acc_dict['friend_list'] = acc['friend_list']
    acc_dict['collectible_label_s'] = acc['collectible_label_s']
    acc_dict['collectible_label_p'] = acc['collectible_label_p']
    acc_dict['sel_img'] = acc['sel_img']
    acc_dict['sel_template'] = acc['sel_template']
    acc_dict['colors'] = acc['colors']
    #print("gonna try and return " + acc_dict.__str__())
    return acc_dict