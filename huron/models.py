from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Part(db.Model):
    __tablename__ = 'part'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    barcode = db.Column(db.String(120), unique=True)
    counter = db.Column(db.Integer)

    def __init__(self, name=None, barcode=None):
        self.name = name
        self.barcode = barcode
        self.counter = 0

    def __repr__(self):
        return '<Part %r>' % (self.name)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'barcode': self.barcode,
            'counter': self.counter,
        }
