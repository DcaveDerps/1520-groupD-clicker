import ds
import flask
import json

def get_all_claimed_images(selections):
    image_list = ds.get_img_entities_by_url_list(selections)
    image_list.append({'url':"EOI",'title':"EOI",'username':"EOI"})
    
    return flask.Response(json.dumps(image_list), mimetype='application/json')

def get_x_images(low, high):
    image_list = []  
    items = ds.get_all_img_entities()
    if high>len(items):
        high = len(items)
    
    for i in range(0,high-low):
        image_list.append({'url':items[low+i]['url'],'title':items[low+i]['title'],'username':items[low+i]['username']})

    if high == len(items):
        image_list.append({'url':"EOI",'title':"EOI",'username':"EOI"})
    
    return flask.Response(json.dumps(image_list), mimetype='application/json')

def search_image(low,high,search):
    image_list = [] 

    if search=="":
        items = ds.get_all_img_entities()
    else:
        items = ds.get_img_entities_by_search(search)

    low = int(flask.request.values['low'])
    high = int(flask.request.values['high'])
    if high>len(items):
        high = len(items)
    
    for i in range(0,high-low):
        image_list.append({'url':items[low+i]['url'],'title':items[low+i]['title'],'username':items[low+i]['username']})

    if high == len(items):
        image_list.append({'url':"EOI",'title':"EOI",'username':"EOI"})

    print(image_list)
    
    return flask.Response(json.dumps(image_list), mimetype='application/json')

def claimed_images(low,high,selections):
    image_list = [] 
    
    items = ds.get_img_entities_by_url_list(selections)

    low = int(flask.request.values['low'])
    high = int(flask.request.values['high'])
    if high>len(items):
        high = len(items)
    
    for i in range(0,high-low):
        image_list.append({'url':items[low+i]['url'],'title':items[low+i]['title'],'username':items[low+i]['username']})

    if high == len(items):
        image_list.append({'url':"EOI",'title':"EOI",'username':"EOI"})
    
    return flask.Response(json.dumps(image_list), mimetype='application/json')

def search_claimed_images(low,high,selections,search):
    image_list = []

    if search=="":
        items = ds.get_img_entities_by_url_list(selections)
    else:
        items = ds.search_claimed_img_entities(selections,search)

    low = int(flask.request.values['low'])
    high = int(flask.request.values['high'])
    if high>len(items):
        high = len(items)
    
    for i in range(0,high-low):
        image_list.append({'url':items[low+i]['url'],'title':items[low+i]['title'],'username':items[low+i]['username']})

    if high == len(items):
        image_list.append({'url':"EOI",'title':"EOI",'username':"EOI"})
    
    return flask.Response(json.dumps(image_list), mimetype='application/json')