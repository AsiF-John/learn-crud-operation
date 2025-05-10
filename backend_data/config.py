import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:ASIFJOHN0163@localhost:5432/fullstack_data'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    






 