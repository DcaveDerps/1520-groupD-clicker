from google.cloud import datastore
import datetime
from google.cloud import storage

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

def create_img_entity(title,url,username):
    ds_client = get_datastore_client()
    key = ds_client.key('image',(url))
    entity = datastore.Entity(key)
    entity['url'] = url
    entity['title']=title
    entity['username']=username
    ds_client.put(entity)

def upload_img(title,img_file,username):
    gcs_client = storage.Client()
    bucket = gcs_client.get_bucket('1520-img-bucket')
    blob = bucket.blob(img_file.filename)

    c_type = img_file.content_type
    blob.upload_from_string(img_file.read(),content_type=c_type)
    create_img_entity(title,blob.public_url,username)


def get_img_entity(filename):
    ds_client = get_datastore_client()
    key = ds_client.key('image',filename)
    entity = ds_client.get(key)
    if entity:
        return entity
    else:
        return None

def append_if_unique(list, newval):
    for val in list:
        if val==newval:
            return
    
    list.append(newval)


def get_img_entities_by_search(s):
    results = []

    ds_client = get_datastore_client()

    #USERNAME QUERY
    query = ds_client.query(kind='image')
    
    for img in query.fetch():
        imguser = img['username'].lower()

        if(imguser.startswith(s) or s.startswith(imguser)):
            append_if_unique(results,img)
        else:
            for u in imguser.split(' '):        
                if(u.startswith(s)):
                    append_if_unique(results,img)

    #TITLE QUERY
    query = ds_client.query(kind='image')
    
    for img in query.fetch():
        imgtitle = img['title'].lower()

        if(imgtitle.startswith(s) or s.startswith(imgtitle)):
                append_if_unique(results,img)
        else:
            for u in imgtitle.split(' '):
                #print(u + " " + s)
                if(u.startswith(s)):
                    append_if_unique(results,img)
    
    
    return results

def get_all_img_entities():
    results = []

    ds_client = get_datastore_client()
    query = ds_client.query(kind='image')
    

    for img in query.fetch():
        results.append(img)
    
    return results

def del_all_img_entities():
    results = []

    ds_client = get_datastore_client()
    query = ds_client.query(kind='image')

    for img in query.fetch():
        ds_client.delete(img)
    
    return results


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

#Get leaderboard list
def get_leaderboard():
    results = []
    client = get_datastore_client()
    query = client.query(kind="user_account")
    query.order = ['-collectibles', '-cps']
    for entity in query.fetch():
        results.append(entity)
    return results

# incredibly unsafe debug function
def list_account_entities():

    ds_client = get_datastore_client()
    query = ds_client.query(kind='user_account')

    print('\nUSER ACCOUNTS:')

    for acc in query.fetch():
        print('running')
        print(f"username: {acc['uname']} | password: {acc['password']} | collectibles: {acc['collectibles']} | cps: {acc['cps']}")
    
    print('-=-=-=-=-=-=-=-=-=-=-=-=-\n')

