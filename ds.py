from google.cloud import datastore
import datetime

"""
DATA STORAGE FUNCTIONS
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

