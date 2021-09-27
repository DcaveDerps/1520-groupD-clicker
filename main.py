import flask

app = flask.Flask(__name__)

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

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
