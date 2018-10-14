from sqlalchemy import Column, Integer, String
from models.database import Base


class Part(Base):
    __tablename__ = 'part'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    barcode = Column(String(120), unique=True)

    def __init__(self, name=None, barcode=None):
        self.name = name
        self.barcode = barcode

    def __repr__(self):
        return '<Part %r>' % (self.name)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'barcode': self.barcode,
        }
