import flask
from flask import session,redirect
from google.cloud import datastore
import ds
import game
import market
import datetime
import urllib
import hashlib
import json

app = flask.Flask(__name__)
app.secret_key = "f%@N!Qwf,><%&w4BA?':<REbea)98"

"""
WEBPAGE ROUTING
"""
@app.route('/')
@app.route('/index')
@app.route('/index.html')
@app.route('/templates/index.html')
def root():
    # Commenting this out for now, since we have a log out button now
    # session.pop('username',None)
    player_list = ds.get_leaderboard()
    if 'username' in session:
        return flask.render_template('/index.html', page_title='Boulangerie',user = ds.get_user_account(session['username']),players=player_list)
    return flask.render_template('/index.html', page_title='Boulangerie',players=player_list)


@app.route('/game')
@app.route('/game.html')
def game_page():
    if 'username' in session:
        alist = ds.get_user_account(session['username'])['friend_list']
        player_list = alist.split(',')        
        return flask.render_template('/game.html', page_title='Game',players=player_list, user = ds.get_user_account(session['username']))
    return flask.render_template('/game.html', page_title='Game Demo')    

@app.route('/login')
@app.route('/login.html')
def login():    
  return flask.render_template('/login.html', page_title='Login')

@app.route('/leaderboard')
@app.route('/leaderboard.html')
def leaderboard():
    player_list = ds.get_leaderboard()
    if 'username' in session:
        return flask.render_template('/leaderboard.html',page_title='Leaderboard',players=player_list, user = ds.get_user_account(session['username']))
    return flask.render_template('/leaderboard.html',page_title='Leaderboard',players=player_list)

@app.route('/marketplace')
@app.route('/marketplace.html')
def marketplace():
    #ds.del_all_img_entities()
    if 'username' in session:
        return flask.render_template('/marketplace.html', page_title='Marketplace', user = ds.get_user_account(session['username']))
    return flask.render_template('/marketplace.html', page_title='Marketplace')
    
@app.route('/upload')
@app.route('/upload.html')
@app.route('/image-upload')
@app.route('/upload-image')
def upload_image():
    if 'username' in session:
        return flask.render_template('/upload.html', page_title='Image Upload', user = ds.get_user_account(session['username']))
    return flask.render_template('/upload.html', page_title='Image Upload')

@app.route('/create')
@app.route('/create.html')
def createAcc():
    return flask.render_template('/create.html',page_title='Create Account')

@app.route('/visit')
@app.route('/visit/')
@app.route('/visit.html')
@app.route('/visit/<visit_user_name>')
@app.route('/visit/<visit_user_name>.html')
def visit_user(visit_user_name=''):
    
    session_user = None

    if 'username' in session:
        session_user = ds.get_user_account(session['username'])
    
    # no visit account given in URL
    if visit_user_name == '':
        print("ok so it got sent to visitUser even though there is no user given in the url")
        if session_user != None:
            return flask.render_template('/visit.html', page_title='Visit Page', user = session_user)
        return flask.render_template('/visit.html', page_title='Visit Page')
    # account user is trying to visit doesn't exist
    elif game.getAccountDict(visit_user_name)['uname'] == None:
        if session_user != None:
            return flask.render_template('visit.html', page_title='Visit Page', noUser=True, attemptedVisit=visit_user_name, user=session_user)
        return flask.render_template('/visit.html', page_title='Visit Page', noUser=True, attemptedVisit=visit_user_name, user=session_user)
    
    template = '/s/Null_Template.png'    
    tmp = game.getAccountDict(visit_user_name)
    if tmp['sel_template']!='':
        template=tmp['sel_template']

    img = '/s/click-object.png'
    if tmp['sel_img']!='':
        img=tmp['sel_img']

    if session_user != None:
        return flask.render_template('/visit.html', page_title=f'Visiting {visit_user_name}\'s Page', visiting=game.getAccountDict(visit_user_name), user = session_user,image=img,template=template,colors=tmp['colors'])
    return flask.render_template('/visit.html', page_title=f'Visiting {visit_user_name}\'s Page', visiting=game.getAccountDict(visit_user_name), user=session_user,image=img,template=template,colors=tmp['colors'])

@app.route('/upload-image', methods=['POST'])
def handle_upload_img():
    img_file = flask.request.files.get('img')

    if not img_file:
        return flask.render_template('/upload.html', page_title='Image Upload',status = 'No Image Selected', imgheader='User Images',user=ds.get_user_account(session['username']))
    
    title = flask.request.form.get('name')
    if title=="":
        return flask.render_template('/upload.html', page_title='Image Upload',status = 'No Name Provided',imgheader='User Images',user=ds.get_user_account(session['username']))    
    
    if not check_image(img_file.filename):
        return flask.render_template('/upload.html', page_title='Image Upload',status = 'Invalid File Type (use png, jpg, jpeg, gif)',imgheader='User Images',user=ds.get_user_account(session['username']))    
    
    img_file.filename = (str(datetime.datetime.now())+img_file.filename+" ")

    w = int(flask.request.form.get('hidden-width'))
    h = int(flask.request.form.get('hidden-height'))
    top = int(flask.request.form.get('hidden-top'))
    left = int(flask.request.form.get('hidden-left'))

    if 'gif' in img_file.content_type.lower():
        ds.upload_gif(title,img_file,session['username'])
    else:    
        ds.upload_img(title,img_file,session['username'],w,h,-top,-left) 
 
    return redirect("/marketplace.html", code=302)


@app.route('/create-user', methods=['POST'])
def handle_create_account_request():

    if '' == flask.request.values['uname'] or '' == flask.request.values['password'] or '' == flask.request.values['password-confirm']:
        print("At least one field is blank!")
        return flask.render_template('/create.html', page_title = 'Create Account', err='At least one field left blank')

    user_name = flask.request.values['uname']

    #       - If there already exists an Entity (account) with a username, abort account creation
    if ds.get_user_account(user_name) != None:
        print("Username taken!")
        return flask.render_template('/create.html', page_title = 'Create Account',err='Username taken')

    user_password = flask.request.values['password']
    if user_password != flask.request.values['password-confirm']:
        print("Passwords don't match!")

        return flask.render_template('/create.html', page_title = 'Create Account',err='Passwords do not match') # if passwords don't match, abort account creation

    # Otherwise, create the new Entity
    new_user = ds.create_account_entity(user_name)
    new_user['uname'] = user_name
    new_user['password'] = str(hashlib.pbkdf2_hmac('sha256', user_password.encode('utf-8'), b'saltPhrase', 100000))
    new_user['collectibles'] = 0
    new_user['cps'] = 0
    new_user['left_game'] = -1 # the exact time the player left the game screen, initialize it as -1 to signify new account
    new_user['factories'] = [0, 0, 0, 0, 0]
    new_user['saved_imgs']=''
    new_user['friend_list'] = ''
    new_user['collectible_label_s'] = 'Collectible'
    new_user['collectible_label_p'] = 'Collectibles'
    new_user['sel_img'] = ''
    new_user['sel_template'] = ''
    new_user['colors'] = '#-#-#-#-#'
    session['username'] = user_name

    print('Created the entity')
    
    # Could also add the date of account creation
    # either going to have to add time of logout or time of last cps change

    # add the created entity to the database
    ds.update_entity(new_user)

    print('New account for user %s created successfully!' % new_user['uname'])

    ds.list_account_entities()

    #return redirect("/game.html", code=302)
    return flask.render_template('/game.html', page_title='Game', user=ds.get_user_account(user_name))

@app.route('/login', methods=['POST'])
def handle_login_request():

    # check if there are any empty fields
    if flask.request.values['uname'] == '' or flask.request.values['password'] == '':
        
        print("At least one field was blank!")

        return flask.render_template('/login.html', page_title='Login', err='At least one field left blank')

    # check if there's an account for the given username
    user_account = ds.get_user_account(flask.request.values['uname'])

    # print(f"Tried to get account data for user {flask.request.values['uname']} and got {type(user_account)}")

    # if user_account is None, abort login. User doesn't exist
    if user_account == None:
        print('No user exists')
        return flask.render_template('/login.html', page_title='Login', err="Username not found")

    # If the user does exist, make sure they are using the right password
    passAttempt = str(hashlib.pbkdf2_hmac('sha256', flask.request.values['password'].encode('utf-8'), b'saltPhrase', 100000))
    
    if user_account['password'] != passAttempt:
        print('Password doesn\'t match!')
        return flask.render_template('/login.html', page_title='Login', err="Password incorrect")

    
    # otherwise, the login is successful, pass the username to the game page
    session['username'] = user_account['uname']
    print("Login successful!")

    #return redirect("/game.html", code=302)
    alist = user_account['friend_list']
    player_list = alist.split(',')
    return flask.render_template('/game.html', page_title='Game',players=player_list, user = ds.get_user_account(session['username']))

"""
HELPER FUNCTIONS
"""
def check_image(filename):
    if filename.lower().endswith(('.jpg','.jpeg','.png','.gif','.tif','.pjp','.xbm','.jxl','.svgz','.ico','.tiff','.svg','.jfif','.webp','.bmp','.pjpeg','.avif')):
        return True
    else:
        return False



# Returns true if there exists a blank field in values
# Intended to be used with flask.response.values
"""
def containsBlankField(values):
    print("Is there a blank in values?: %s" % '' in values)
    return '' in values['uname'] or '' in values['password'] or '' in values['password-confirm']
"""

"""
GAME LOGIC REDIRECTION
"""
@app.route('/leaveGame', methods=['POST'])
def leaveGame():
    return game.leaveGame()

@app.route('/incCollectibles', methods=['POST'])
def incCollectibles():
    return game.incCollectibles()
"""
SITE HELPER FUNCTIONS
"""
@app.route('/updateAccountFromJson', methods=['POST'])
def updateAccountFromJson():
    #print("welp updateAccountFromJson in main.py runs")
    return game.updateAccountFromJson()

@app.route('/getAccountJson', methods=['POST'])
def getAccountJson():
    return game.getAccountJson()

@app.route('/logout')
@app.route('/logout.html')
def resetSessionUser():
    # session.pop() call here essentially logs the user out in terms of the local session
    session.pop('username', None)
    return flask.render_template('/login.html', page_title='Login')


"""
IMAGES
"""
@app.route('/getAllImages',methods=['POST'])
def getAllImages():
    images = ds.get_all_img_entities()
    urls = []
    for image in images:
        urls.append(image['url'])
    return flask.Response(json.dumps(urls), mimetype='application/json')

@app.route('/getAllClaimedImages',methods=['POST'])
def getAllClaimedImages():
    search = flask.request.values['search']
    selections = search.split(',')
    return market.get_all_claimed_images(selections)

@app.route('/getXImages',methods=['POST'])
def getXImages():
    return market.get_x_images(int(flask.request.values['low']),int(flask.request.values['high']))

@app.route('/searchXImages', methods=['POST'])
def search_image():
    search = flask.request.values['search']
    search.strip()
    return market.search_image(int(flask.request.values['low']),int(flask.request.values['high']),search)

@app.route('/claimedImages', methods=['POST'])
def claimed_images():
    search = flask.request.values['search']
    selections = search.split(',')
    return market.claimed_images(int(flask.request.values['low']),int(flask.request.values['high']),selections)

@app.route('/searchClaimedImages', methods=['POST'])
def search_claimed():
    search = flask.request.values['search']
    selections = flask.request.values['selections']
    selections = selections.split(',')
    return market.search_claimed_images(int(flask.request.values['low']),int(flask.request.values['high']),selections,search)


"""
FRIEND STUFF
"""

@app.route('/searchFriend', methods=['POST'])
def check_user_existence():
    username = flask.request.values['username']

    if ds.get_user_account(username) == None:
        print("Username doesn't exist!")
        return flask.Response(json.dumps(''), mimetype='application/json')
    
    return flask.Response(json.dumps(username), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
