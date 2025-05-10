from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    legal_name = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    office_email = db.Column(db.String(100), nullable=False)
    contact_no = db.Column(db.String(15), nullable=False)
    reg_no = db.Column(db.String(10), nullable=False)
    gst_no = db.Column(db.String(20), nullable=False)
    sign_date = db.Column(db.Date, nullable=False)
    agreement_filename = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=False)
