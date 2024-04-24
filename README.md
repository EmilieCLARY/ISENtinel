# ISENtinel

Commands to install the project :

- If you are on Ubuntu or Debian, install libgtk2.0-dev and pkg-config
- In client/api, create a virtual environment : python -m venv venv
- Activate it :
   - On Linux : source ./venv/bin/activate
   - On Windows : .\venv\Scripts\Activate (you need to enable script first : Set-ExecutionPolicy RemoteSigned -Scope Process)
- git clone https://github.com/ifzhang/ByteTrack.git
- Now go to client/api/ByteTrack
- sed -i -e 's/onnx==1.8.1/onnx==1.16.0/g' -e 's/onnxruntime==1.8.0/onnxruntime==1.16.0/g' requirements.txt
- pip3 install -q -r requirements.txt 
- pip install -e .
- Install python plugins : pip install flask python-dotenv scikit-learn flask-cors ultralytics cvzone imageio[ffmpeg] paramiko cython_bbox onemetric supervision==0.1.0 pymongo IPython protobuf==3.20.0 ipywidgets
- Search np.float) in all files and replace it with float) (The ByteTrack library is using deprecated syntax)

Commands to launch the project :

- In /server : npm start dev
- In /api in your venv : flask run --port 8000
- In /client : npm start

Server-side :

To launch it with the server, you need to change the IP adress of it in the code to match it with the local adress of the server.
To launch Snort on the server, you need to launch : sudo snort -q -A console -c snort.conf
