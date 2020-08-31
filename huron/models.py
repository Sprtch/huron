from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Part(db.Model):
    __tablename__ = 'part'
    barcode = db.Column(db.String(120), primary_key=True)
    name = db.Column(db.String(50))
    counter = db.Column(db.Integer)

    def __init__(self, name=None, barcode=None):
        self.name = name
        self.barcode = barcode
        self.counter = 0

    def __repr__(self):
        return '<Part %r>' % (self.name)

    def printed(self):
        self.counter += 1

    def to_dict(self):
        return {
            'barcode': self.barcode,
            'name': self.name,
            'counter': self.counter,
        }
