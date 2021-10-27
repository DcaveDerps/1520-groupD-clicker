import flask
from google.cloud import datastore
import ds
import game
import datetime
import urllib

app = flask.Flask(__name__)

"""
WEBPAGE ROUTING
"""
@app.route('/')
@app.route('/index')
@app.route('/index.html')
@app.route('/templates/index.html')
def root():
    return flask.render_template('/index.html', page_title='Homepage')

@app.route('/game')
@app.route('/game.html')
def game_page():
    return flask.render_template('/game.html', page_title='Game')

@app.route('/login')
@app.route('/login.html')
def login():
  return flask.render_template('/login.html', page_title='Login')

@app.route('/leaderboard')
@app.route('/leaderboard.html')
def leaderboard():
    player_list = ds.get_leaderboard()
    return flask.render_template('/leaderboard.html',page_title='Leaderboard',players=player_list)

@app.route('/marketplace')
@app.route('/marketplace.html')
def marketplace():
    #ds.del_all_img_entities()
    return flask.render_template('/marketplace.html', page_title='Marketplace',imgheader='User Images',items = ds.get_all_img_entities())

@app.route('/create')
@app.route('/create.html')
def createAcc():
    return flask.render_template('/create.html',page_title='Create Account')

@app.route('/upload-image', methods=['POST'])
def handle_upload_img():
    img_file = flask.request.files.get('img')

    if not img_file:
        return flask.render_template('/marketplace.html', page_title='Marketplace',status = 'No Image Selected', imgheader='User Images',items = ds.get_all_img_entities())
    
    title = flask.request.form.get('name')
    if title=="":
        return flask.render_template('/marketplace.html', page_title='Marketplace',status = 'No Name Provided',imgheader='User Images',items = ds.get_all_img_entities())    
    
    if not check_image(img_file.filename):
        return flask.render_template('/marketplace.html', page_title='Marketplace',status = 'Invalid File Type (use png, jpg, jpeg, gif)',imgheader='User Images',items = ds.get_all_img_entities())    
    
    img_file.filename = (str(datetime.datetime.now())+img_file.filename+" ")

    tmp = flask.request.form.get('temp-username')

    ds.upload_img(title,img_file,tmp)

    return flask.render_template('/marketplace.html', page_title='Marketplace',status = 'Upload Success!',imgheader='User Images',items = ds.get_all_img_entities())


@app.route('/image-search', methods=['GET'])
def search_image():
    search = flask.request.args['search']
    search.strip()
    if search=="":
        return flask.render_template('/marketplace.html', page_title='Marketplace',imgheader='User Images',items = ds.get_all_img_entities())    
    return flask.render_template('/marketplace.html', page_title='Marketplace',imgheader='Search Results For "'+search+'"',items = ds.get_img_entities_by_search(search.lower()))    





@app.route('/create-user', methods=['POST'])
def handle_create_account_request():

    if '' == flask.request.values['uname'] or '' == flask.request.values['password'] or '' == flask.request.values['password-confirm']:
        print("At least one field is blank!")
        return flask.render_template('/create.html', page_title = 'Create Account', err='At least one field left blank')

    user_name = flask.request.values['uname']

    # TODO enforce only having one account Entity per username
    #       - If there already exists an Entity (account) with a username, abort account creation
    if ds.get_user_account(user_name) != None:
        print("Username taken!")
        return flask.render_template('/create.html', page_title = 'Create Account',err='Username taken')

    user_password = flask.request.values['password']
    if user_password != flask.request.values['password-confirm']:
        # TODO Have a Passwords don't match message appear on the page
        print("Passwords don't match!")

        return flask.render_template('/create.html', page_title = 'Create Account',err='Passwords do not match') # if passwords don't match, abort account creation

    # Otherwise, create the new Entity
    new_user = ds.create_account_entity(user_name)
    new_user['uname'] = user_name
    new_user['password'] = user_password    # TODO hash the password before saving it
    new_user['collectibles'] = 0
    new_user['cps'] = 0
    new_user['left_game'] = datetime.datetime.now().isoformat(' ') # the exact time the player left the game screen
    new_user['factories'] = [0, 0, 0, 0, 0]

    print('Created the entity')
    
    # Could also add the date of account creation
    # either going to have to add time of logout or time of last cps change

    # add the created entity to the database
    ds.update_entity(new_user)

    print('New account for user %s created successfully!' % new_user['uname'])

    ds.list_account_entities()

    # NEED a return statement that goes to another page (or the same page)

    # Essentially, when a request is processed, it takes the user away from the page,
    # so you need to send them somewhere or else it will give a server error

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
    if user_account['password'] != flask.request.values['password']:
        print('Password doesn\'t match!')
        return flask.render_template('/login.html', page_title='Login', err="Password incorrect")

    
    # otherwise, the login is successful, pass the username to the game page
    print("Login successful!")

    return flask.render_template('/game.html', page_title='Game', user=ds.get_user_account(flask.request.values['uname']))

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

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
