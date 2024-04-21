# ISENtinel

Commands to install the project :

- If you are on Ubuntu or Debian, install libgtk2.0-dev and pkg-config
- In client/api, create a virtual environment : python -m venv venv
- Activate it :
   - On Linux : source ./venv/bin/activate
   - On Windows : .\venv\Scripts\Activate (you need to enable script first : Set-ExecutionPolicy RemoteSigned -Scope Process)
- git clone https://github.com/ifzhang/ByteTrack.git
- cd ByteTrack
- sed -i -e 's/onnx==1.8.1/onnx==1.9.0/g' -e 's/onnxruntime==1.8.0/onnxruntime==1.16.0/g' requirements.txt
- pip3 install -q -r requirements.txt 
- pip install -e .
- Install python plugins : pip install flask python-dotenv scikit-learn flask-cors ultralytics cvzone imageio[ffmpeg] paramiko cython_bbox onemetric supervision==0.1.0 pymongo IPython protobuf==3.20.0 ipywidgets  ( + loguru lap thop si ça marche pas)
- Search np.float( in all files and replace it with float(

Commands to launch the project :

- In /server : npm start dev
- In /api in venv : flask run --port 8000
- In /client : npm start
