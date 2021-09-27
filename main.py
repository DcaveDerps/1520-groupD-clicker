import flask

app = flask.Flask(__name__)

@app.route('/')
@app.route('/index')
@app.route('/index.html')
@app.route('/static-files/index.html')
def root():
    return flask.redirect('/s/index.html', code=302)

@app.route('/game')
@app.route('/game.html')
def game():
    return flask.render_template('game.html', page_title='Game')

@app.route('/login')
@app.route('/login.html')
def login():
  return flask.redirect('/s/login.html', code=302)

@app.route('/leaderboard')
@app.route('/leaderboard.html')
def leaderboard():
    return flask.redirect('/s/leaderboard.html',code=302)

@app.route('/marketplace')
@app.route('/marketplace.html')
def marketplace():
    return flask.redirect('/s/marketplace.html', code=302)

@app.route('/create')
@app.route('/create.html')
def createAcc():
    return flask.redirect('/s/create.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
