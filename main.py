#import datetime

import flask

app = flask.Flask(__name__)


@app.route('/')
@app.route('/index')
@app.route('/index.html')
def root():
    return flask.render_template('index.html', page_title='Login')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)