import flask

app = flask.Flask(__name__)

@app.route('/')
@app.route('/index')
@app.route('/index.html')
@app.route('/static-files/index.html')
def root():
    return flask.render_template('/s/index.html', page_title='Login')

@app.route('/game')
@app.route('/game.html')
def game():
    return flask.render_template('game.html', page_title='Game')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)