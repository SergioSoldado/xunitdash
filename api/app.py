import json

from flask import Flask, request
from flask_cors import CORS

from database.models import create_api
from settings import db
from sdk.xunit import xml_deserialize

app = Flask(__name__)
CORS(app)
app.config.update(DEBUG=False)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://xunitdash:xunitdash@172.18.0.2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_SIZE'] = 5000
app.config['SQLALCHEMY_POOL_RECYCLE'] = 2
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 5
# app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
#     'pool_size': 128,
#     'max_overflow': 128,
#     'pool_recycle': 300,
# }


@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()


@app.route('/', methods=['POST'])
def post_xml():
    content = request.data
    args = dict(request.args)
    try:
        xml_deserialize(db, app, content, args)
    except Exception as e:
        print(str(e))
        return str(e)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


if __name__ == "__main__":
    port = 5000
    host = '0.0.0.0'

    db.init_app(app)

    with app.app_context():
        db.create_all()
        create_api(app, port=port, host=host)
    app.run(port=5000, host='0.0.0.0', debug=False, threaded=True)
