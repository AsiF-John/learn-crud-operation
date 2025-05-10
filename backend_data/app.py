from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from werkzeug.utils import secure_filename
from datetime import datetime
import os


from config import Config
from models import db, Company

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
app.config.from_object(Config)

db.init_app(app)
@app.route("/", methods=["GET"])
def system_check():
    return jsonify({"message":"hello developer"})

@app.route("/api/submit", methods=["POST"])
def submit_form():
    try:
        data = request.form
        file = request.files.get('agreement')
        print(file)
        if not file:
            return jsonify({"error": "Signed agreement file is required"}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        company = Company(
            company=data['company'],
            legal_name=data['legalName'],
            website=data['website'],
            email=data['email'],
            office_email=data['officeEmail'],
            contact_no=data['contactNo'],
            reg_no=data['regNo'],
            gst_no=data['gstNo'],
            sign_date=datetime.strptime(data['signDate'], "%Y-%m-%d").date(),
            agreement_filename=filename,
            active=data.get('active') == 'true'
        )

        db.session.add(company)
        db.session.commit()

        return jsonify({"message": "Form submitted successfully!"}), 200

    except Exception as e:
        print(e)
        db.session.rollback()
   
    return jsonify({"message": "Received!"}), 400

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=8001)

