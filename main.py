import flask
from google.cloud import datastore
import ds
import datetime

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
def game():
    return flask.render_template('/game.html', page_title='Game')

@app.route('/login')
@app.route('/login.html')
def login():
  return flask.render_template('/login.html', page_title='Login')

@app.route('/leaderboard')
@app.route('/leaderboard.html')
def leaderboard():
    return flask.render_template('/leaderboard.html',page_title='Leaderboard')

@app.route('/marketplace')
@app.route('/marketplace.html')
def marketplace():
    return flask.render_template('/marketplace.html', page_title='Marketplace')

@app.route('/create')
@app.route('/create.html')
def createAcc():
    return flask.render_template('/create.html',page_title='Create Account')

"""
DATA STORAGE
"""

"""
# Returns an instance of the datastore Client for the application
def get_datastore_client():
    return datastore.Client('cs1520-group-d')

# Creates and returns a new instance of an Entity of the given kind
def create_entity(kind):

    ds_client = get_datastore_client()

    key = ds_client.key(kind) # ID will be generated automatically. Will be an int.
    return datastore.Entity(key)

# Creates and returns a new instance of an Entity that will hold account information
def create_account_entity(username):

    ds_client = get_datastore_client()

    key = ds_client.key('user_account', username) # id will be the given username
    return datastore.Entity(key)

# Stores/Updates the entity in the cloud database
def update_entity(entity):
    ds_client = get_datastore_client()
    ds_client.put(entity)

# Removes an account entity from the cloud database
def remove_account_entity(id):
    ds_client = get_datastore_client()
    key = ds_client.key('user_account', id)
    ds_client.delete(key)

# Returns the database Entity whose id is 'username'
# Returns None if the Entity does not exist
def get_user_account(username):
    ds_client = get_datastore_client()
    key = ds_client.key('user_account', username)
    return ds_client.get(key)

# incredibly unsafe debug function
def list_account_entities():

    ds_client = get_datastore_client()
    query = ds_client.query(kind='user_account')

    print('\nUSER ACCOUNTS:')

    for acc in query.fetch():
        print('running')
        print(f"username: {acc['uname']} | password: {acc['password']} | collectibles: {acc['collectibles']} | cps: {acc['cps']}")
    
    print('-=-=-=-=-=-=-=-=-=-=-=-=-\n')

"""

@app.route('/create-user', methods=['POST'])
def handle_create_account_request():

    if '' == flask.request.values['uname'] or '' == flask.request.values['password'] or '' == flask.request.values['password-confirm']:
        print("At least one field is blank!")
        return flask.render_template('/create.html', page_title = 'Create Account')

    user_name = flask.request.values['uname']

    # TODO enforce only having one account Entity per username
    #       - If there already exists an Entity (account) with a username, abort account creation
    if ds.get_user_account(user_name) != None:
        print("Username taken!")
        return flask.render_template('/create.html', page_title = 'Create Account')

    user_password = flask.request.values['password']
    if user_password != flask.request.values['password-confirm']:
        # TODO Have a Passwords don't match message appear on the page
        print("Passwords don't match!")

        return flask.render_template('/create.html', page_title = 'Create Account') # if passwords don't match, abort account creation

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

        return flask.render_template('/login.html', page_title='Login')

    # check if there's an account for the given username
    user_account = ds.get_user_account(flask.request.values['uname'])

    # print(f"Tried to get account data for user {flask.request.values['uname']} and got {type(user_account)}")

    # if user_account is None, abort login. User doesn't exist
    if user_account == None:
        print("User doesn't exist!")
        return flask.render_template('/login.html', page_title='Login')

    # If the user does exist, make sure they are using the right password
    if user_account['password'] != flask.request.values['password']:
        print('Password doesn\'t match!')
        return flask.render_template('/login.html', page_title='Login')

    
    # otherwise, the login is successful, pass the username to the game page
    print("Login successful!")

    return flask.render_template('/game.html', page_title='Game', user=ds.get_user_account(flask.request.values['uname']))

"""
HELPER FUNCTIONS
"""
# Returns true if there exists a blank field in values
# Intended to be used with flask.response.values
"""
def containsBlankField(values):
    print("Is there a blank in values?: %s" % '' in values)
    return '' in values['uname'] or '' in values['password'] or '' in values['password-confirm']
"""


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
