#! ../env/bin/python

from flask import Flask

from huron.models import db
from huron.controllers.main import main

def create_app(object_name = 'huron.settings.DevConfig'):
    app = Flask(
        __name__,
        static_folder="./view/static",
        template_folder="./view",
    )

    app.config.from_object(object_name)

    # initialize SQLAlchemy
    db.init_app(app)

    # register our blueprints
    app.register_blueprint(main)

    return app
