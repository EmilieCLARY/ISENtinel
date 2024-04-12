# ISENtinel

Commands to install the project :

- In client/api, create a virtual environment : python -m venv venv
- Activate it :
   - On Linux : ./venv/bin/activate
   - On Windows : .\venv\Scripts\Activate (you need to enable script first : Set-ExecutionPolicy RemoteSigned -Scope Process)
- Install python plugins : pip install flask python-dotenv scikit-learn flask-cors ultralytics cvzone imageio[ffmpeg] paramiko

Commands to launch the project :

- In /server : npm start dev
- In /api in venv : flask run --port 8000
- In /client : npm start
