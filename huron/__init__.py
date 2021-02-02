from flask import Flask, send_from_directory
from despinassy.db import db
from huron.core.executor import executor
from huron.api.main import api
import logging
import os


def create_app(object_name='huron.settings.DevConfig', log_file=None):
    app = Flask(
        __name__,
        static_folder="view",
    )

    app.config.from_object(object_name)

    if app.config['ENV'] == 'prod':
        gunicorn_error_logger = logging.getLogger('gunicorn.error')
        app.logger.handlers.extend(gunicorn_error_logger.handlers)
        app.logger.setLevel(logging.DEBUG)

    # initialize SQLAlchemy
    db.init_app(app)

    try:
        with app.app_context():
            db.create_all()
    except Exception as e:
        app.logger.error("Tables already exists %s" % (str(e)))

    executor.init_app(app)

    # register our blueprints
    app.register_blueprint(api)

    @app.route('/static/<path:filename>')
    def serve_static(filename):
        return send_from_directory(os.path.join('view', 'static'), filename)

    @app.route('/')
    def index():
        return send_from_directory('view', 'index.html')

    return app
