from flask import Flask, Response
from flask_cors import CORS
import cv2

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}, r"/video_feed": {"origins": "*"}}) # "*" permet à toutes les origines, vous pourriez vouloir limiter à "http://localhost:3000"

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            # Votre traitement d'image ici
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
