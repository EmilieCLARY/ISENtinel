from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO
import cvzone  
import math
import datetime
import os
import sys
import cv2
import time
import imageio
import numpy as np
import paramiko
from yolox.tracker.byte_tracker import BYTETracker, STrack
from onemetric.cv.utils.iou import box_iou_batch
from dataclasses import dataclass
import supervision
print("supervision.__version__:", supervision.__version__)
from supervision.draw.color import ColorPalette
from supervision.geometry.dataclasses import Point
from supervision.video.dataclasses import VideoInfo
from supervision.video.source import get_video_frames_generator
from supervision.video.sink import VideoSink
from supervision.notebook.utils import show_frame_in_notebook
from supervision.tools.detections import Detections, BoxAnnotator
from supervision.tools.line_counter import LineCounter, LineCounterAnnotator
from IPython import display
display.clear_output()
from typing import List
from dataclasses import dataclass
import pymongo

HOME = os.getcwd()
print(HOME)

import sys
sys.path.append(f"./ByteTrack")

import yolox
print("yolox.__version__:", yolox.__version__)


@dataclass(frozen=True)
class BYTETrackerArgs:
    track_thresh: float = 0.25
    track_buffer: int = 30
    match_thresh: float = 0.9
    aspect_ratio_thresh: float = 3.0
    min_box_area: float = 10.0
    mot20: bool = False

@dataclass
class Notification:
    tracker_id: str
    end_time: str
    anomaly_type: str
    path: str
    camera_id: int = 1


app = Flask(__name__)
CORS(app)

classNames = {
  #6: "Ambulance",
  14: "Axe",
  #15: "Backpack",
  19: "Ball",
  #20: "Balloon",
  #22: "Band-aid",
  26: "Baseball bat",
  28: "Bat",
  37: "Beer",
  42: "Bicycle",
  49: "Bird",
  53: "Bomb",
  #54: "Book",
  #56: "Boot",
  57: "Bottle",
  59: "Bow and arrow",
  62: "Box",
  64: "Brassiere",
  66: "Briefcase",
  82: "Camera",
  #85: "Candle",
  87: "Cannon",
  93: "Cart",
  96: "Cat",
  100:" Ceiling fan",
  103:" Chainsaw",
  108:" Chicken",
  110:" Chisel",
  117:" Cocktail",
  142:" Crocodile",
  150:" Dagger",
  152:" Deer",
  160:" Dog",
  170:" Drill (Tool)",
  174:" Duck",
  176:" Eagle",
  179:" Elephant",
  184:" Falcon",
  191:" Fireplace",
  198:" Flying disc",
  201:" Football",
  204:" Fork",
  206:" Fox",
  #208:" French horn",
  #209:" Frog",
  #211:" Frying pan",
  215:" Giraffe",
  219:" Goat",
  #220:" Goggles",
  223:" Golf cart",
  225:" Goose",
  228:" Grinder",
  234:" Hammer",
  #235:" Hamster",
  238:" Handgun",
  246:" Hedgehog",
  #247:" Helicopter",
  #249:" High heels",
  250:" Hiking equipment",
  251:" Hippopotamus",
  255:" Horse",
  259:" Human arm",
  260:" Human beard",
  261:" Human body",
  262:" Human ear",
  263:" Human eye",
  264:" Human face",
  265:" Human foot",
  266:" Human hair",
  267:" Human hand",
  268:" Human head",
  269:" Human leg",
  270:" Human mouth",
  271:" Human nose",
  276:" Insect",
  277:" Invertebrate",
  279:" Isopod",
  282:" Jaguar (Animal)",
  288:" Kangaroo",
  292:" Kitchen knife",
  296:" Knife",
  297:" Koala",
  299:" Ladle",
  307:" Leopard",
  313:" Lion",
  #315:" Lizard",
  318:" Luggage and bags",
  319:" Lynx",
  322:" Man",
  329:" Mechanical fan",
  334:" Miniskirt",
  #335:" Mirror",
  336:" Missile",
  340:" Monkey",
  #341:" Moths and butterflies",
  343:" Mouse",
  346:" Mule",
  #350:" Nail (Construction)",
  358:" Ostrich",
  359:" Otter",
  361:" Owl",
  366:" Panda",
  379:" Penguin",
  381:" Person",
  387:" Pig",
  398:" Polar bear",
  411:" Rabbit",
  412:" Raccoon",
  416:" Raven",
  418:" Red panda",
  421:" Reptile",
  422:" Rhinoceros",
  423:" Rifle",
  425:" Rocket",
  426:" Roller skates",
  #427:" Rose",
  440:" Scorpion",
  448:" Segway",
  452:" Sheep",
  455:" Shirt",
  456:" Shorts",
  457:" Shotgun",
  #458:" Shower",
  #460:" Sink",
  461:" Skateboard",
  462:" Ski",
  463:" Skirt",
  #464:" Skull",
  #469:" Snail",
  470:" Snake",
  479:" Sparrow",
  488:" Squirrel",
  492:" Stationary bicycle",
  #501:" Submarine sandwich",
  508:" Swan",
  512:" Sword",
  #513:" Syringe",
  519:" Tank",
  530:" Tent",
  534:" Tiger",
  536:" Tire",
  542:" Toothbrush",
  543:" Torch",
  544:" Tortoise",
  560:" Turkey",
  561:" Turtle",
  563:" Unicycle",
  564:" Van",
  567:" Vehicle",
  568:" Vehicle registration plate",
  580:" Weapon",
  582:" Wheel",
  583:" Wheelchair",
  589:" Wine",
  594:" Woman",
  #597:" Worm",
  599:" Zebra"}


selected_classes = [];
is_recording = False
video_writer = None  # Initialize video_writer variable
trackers_info = {};
notifications_table = [];

hostname = '192.168.1.98'
port = 22
username = 'user'
password = 'user'

model = YOLO("Yolo-Weights/yolov8n-oiv7.pt")

@app.route('/class_names')
def class_names():
    return jsonify(classNames)

@app.route('/update_table', methods=['POST'])
def update_table():
    selected_classes_table = request.json.get('selectedClassesTable')
    
    # Update the table based on the received data
    # Example: Update the selected_classes list
    global selected_classes
    selected_classes = selected_classes_table

    # Print the updated table
    print(selected_classes)
    return jsonify({'message': 'Table updated successfully'})

def generate_thumbnail(video_path, thumbnail_path):
    # Utilisez OpenCV pour lire la vidéo
    cap = cv2.VideoCapture(video_path)
    
    
    # Lire la dixième frame de la vidéo
    for i in range(1):
        ret, frame = cap.read()
        if frame is None:
               print("Failed to capture frame for thumbnail.")
               cap.release()
               return
    # Créez une miniature de la vidéo sans réduire la taille
    thumbnail = cv2.resize(frame, (frame.shape[1], frame.shape[0]))
    
    # Enregistrez la miniature
    cv2.imwrite(thumbnail_path, thumbnail)
    
    # Libérez les ressources de la vidéo
    cap.release()

def defineThumbnailPath(video_path): # Create a dir in date folder called thumbnails and save the thumbnail there with the same name as the video _thumbnail.jpg
    # Obtenez le répertoire de la vidéo
    video_dir = os.path.dirname(video_path)
    
    # Obtenez le nom de la vidéo sans extension
    video_name = os.path.splitext(os.path.basename(video_path))[0]
    
    # Créez le répertoire des miniatures
    thumbnail_dir = os.path.join(video_dir, 'thumbnails')
    if not os.path.exists(thumbnail_dir):
        os.makedirs(thumbnail_dir)

    # Définissez le chemin de la miniature
    thumbnail_path = os.path.join(thumbnail_dir, video_name + '_thumbnail.jpg')
    return thumbnail_path


def defineFilePath():
    if not os.path.exists('videos'):
        os.makedirs('videos')

    if not os.path.exists('videos/'+datetime.datetime.now().strftime("%Y%m%d")):
        os.makedirs('videos/'+datetime.datetime.now().strftime("%Y%m%d"))

    date = datetime.datetime.now().strftime("%Y%m%d")
    time = datetime.datetime.now().strftime("%H%M%S")
    video_path = f'videos/{date}/{date}_{time}.mp4'

    return video_path

def transferToServerSSH(localFilePath, remoteFilePath):
    # Créez une connexion SSH
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("Connexion au serveur SSH...")
    ssh.connect(hostname, port, username, password)
    print("Connexion réussie!")
    # Transférez le fichier local vers le serveur
    sftp = ssh.open_sftp()
    print(localFilePath)
    sftp.put(localFilePath, remoteFilePath)
    sftp.close()

    # Fermez la connexion SSH
    ssh.close()

    print("Fichier transféré avec succès!")

def insertEventInMongoDB(event):
    # Insérez l'événement dans la base de données MongoDB
    print(event)
    myClient = pymongo.MongoClient("mongodb+srv://admin:admin@isentinel.fw6fyxk.mongodb.net/")
    myDb = myClient["ISENtinel"]
    myCol = myDb["EVENT"]
    myCol.insert_one(event)


def generate_unique_id(class_id, datetime_obj):
    #generate a unique ID for each tracker based on the time, class ID and bounding box
    date = datetime.datetime.now().strftime("%Y%m%d")
    time = datetime.datetime.now().strftime("%H%M%S")
    
    video_name = f'{date}_{time}'
    return video_name

# converts Detections into format that can be consumed by match_detections_with_tracks function
def detections2boxes(detections: Detections) -> np.ndarray:
    return np.hstack((
        detections.xyxy,
        detections.confidence[:, np.newaxis]
    ))


# converts List[STrack] into format that can be consumed by match_detections_with_tracks function
def tracks2boxes(tracks: List[STrack]) -> np.ndarray:
    return np.array([
        track.tlbr
        for track
        in tracks
    ], dtype=float)


# matches our bounding boxes with predictions
def match_detections_with_tracks(
    detections: Detections,
    tracks: List[STrack],
    frame_number: int
) -> Detections:
    if not np.any(detections.xyxy) or len(tracks) == 0:
        print("No detections or tracks available for matching.")
        return np.empty((0,))

    tracks_boxes = tracks2boxes(tracks=tracks)
    iou = box_iou_batch(tracks_boxes, detections.xyxy)
    track2detection = np.argmax(iou, axis=1)

    tracker_ids = [None] * len(detections)
    print(f"detections: {detections.xyxy}")
    for tracker_index, detection_index in enumerate(track2detection):
        if iou[tracker_index, detection_index] != 0:
            #tracker_ids[detection_index] = tracks[tracker_index].track_id
            tracker_id = tracks[tracker_index].track_id
            tracker_ids[detection_index] = tracker_id
            # Extract the individual attributes of the detection for this index
            xyxy = detections.xyxy[detection_index]
            confidence = detections.confidence[detection_index]
            class_id = detections.class_id[detection_index]
            update_tracker_info(tracker_id, xyxy, confidence, class_id, frame_number)
        else:
            print(f"Rejected match for tracker {tracker_index} to detection {detection_index} with IoU {iou[tracker_index, detection_index]}")

    return tracker_ids

def filter_detections_by_class(detections, class_ids):
    """
    Filter detections to only include specified classes using numpy operations.

    Parameters:
    - detections: Detections object containing numpy arrays for 'xyxy', 'confidence', and 'class_id'.
    - class_ids: Set or list of class IDs to include.

    Returns:
    - Detections: Filtered Detections object.
    """
    class_ids = np.array(list(class_ids))  # Ensure class_ids is a numpy array for efficient operation
    class_mask = np.isin(detections.class_id, class_ids)  # Create a mask of bools where class_id is in class_ids
    confidence_mask = detections.confidence >=0.25
    combined_mask = class_mask & confidence_mask
    # Apply the mask to each array in the Detections object
    filtered_xyxy = detections.xyxy[combined_mask]
    filtered_confidence = detections.confidence[combined_mask]
    filtered_class_id = detections.class_id[combined_mask]

    # Return a new Detections object with the filtered data
    return Detections(
        xyxy=filtered_xyxy,
        confidence=filtered_confidence,
        class_id=filtered_class_id
    )

def formateEndTIme(end_time):
    newEndTime = end_time.strftime("%H%M%S")
    return newEndTime

def update_tracker_info(tracker_id, xyxy, confidence, class_id, frame_number):
    detection_info = {
        'xyxy': xyxy,
        'confidence': confidence,
        'class_id': class_id
    }
    if tracker_id not in trackers_info:
        trackers_info[tracker_id] = {
            'complete_id': generate_unique_id(class_id, datetime.datetime.now()),
            'created_at': datetime.datetime.now(),
            'last_seen': formateEndTIme(datetime.datetime.now()),
            'initial_detection': detection_info,
            'detections': [detection_info],
            'class' : detection_info['class_id']
        }
    else:
        trackers_info[tracker_id]['last_seen'] = formateEndTIme(datetime.datetime.now())
        trackers_info[tracker_id]['detections'].append(detection_info)

def release_resources(cap):
    cap.release()
    cv2.destroyAllWindows()



def generate_frames():
    input_video_path = f'videos/vehicle-counting.mp4'
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open video.")

    recording = False
    writer = None
    frame_number = 0
    box_annotator = BoxAnnotator(
                thickness=2,
                text_thickness=2,
                text_scale=1,
                color=ColorPalette(),
            )   

    byte_tracker = BYTETracker(BYTETrackerArgs())

    while True:
        success, frame = cap.read()
        object_detected = False
        frame_number = frame_number + 1
        #results = model(frame, stream=True)
    
        """for r in results:
            boxes = r.boxes
            for box in boxes:
                object_detected = True
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, w, h = int(x1), int(y1), int(x2-x1), int(y2-y1)
                bbox = [x1, y1, w, h]
                cvzone.cornerRect(frame, bbox, colorC=(0,0,255), colorR=(10,10,10), rt=2)
                conf = math.ceil(box.conf[0]*100)/100
                class_name = int(box.cls[0])
                cvzone.putTextRect(frame, f'{conf}{classNames.get(class_name)}', (max(0,x1),max(y1-20,40)))"""
        
        if success:
            # Run YOLOv8 tracking on the frame, persisting tracks between frames
            results = model(frame)
            original_frame = frame.copy()
            #detections = sv.Detections.from_yolov8(results)
            if len(results) == 0:
                detections = Detections(
                    xyxy=np.empty((0, 4)),
                    confidence=np.empty((0,)),
                    class_id=np.empty((0,), dtype=int)
                )
            else:
                detections = Detections(
                    xyxy=results[0].boxes.xyxy.cpu().numpy(),
                    confidence=results[0].boxes.conf.cpu().numpy(),
                    class_id=results[0].boxes.cls.cpu().numpy().astype(int)
                )
                detections = filter_detections_by_class(detections, selected_classes)
                if (detections) : object_detected = True
                tracks = byte_tracker.update(
                output_results=detections2boxes(detections=detections),
                img_info=frame.shape,
                img_size=frame.shape
                )
                tracker_id = match_detections_with_tracks(detections=detections, tracks=tracks, frame_number=frame_number)
                detections.tracker_id = np.array(tracker_id)
                #print all tracker id:
                print("tracker_id: ", tracker_id, file=sys.stdout)
                #print all detections:
                print("detections: ", detections, file=sys.stdout)
                #print all tracks:
                print("tracks: ", tracks, file=sys.stdout)
                if tracker_id:
                    labels = [
                        f"#{tracker_id} {model.model.names[class_id]} {confidence:0.2f}"
                        for _, confidence, class_id, tracker_id in zip(detections.xyxy, detections.confidence, detections.class_id, tracker_id)
                    ]
                    frame = box_annotator.annotate(frame=frame, detections=detections, labels=labels)
                else:
                    labels = []

            
        

            if object_detected and not recording:
                recording = True
                print("Début de l'enregistrement...")
                file_path = defineFilePath()
                writer = imageio.get_writer(file_path, fps=13)

            if not object_detected and recording :
                recording = False
                print("Fin de l'enregistrement...")
                writer.close()
                # Output tracker information
                for tracker_id, info in trackers_info.items():
                    # Enleve l'espace devant le nom de la classe
                    newClassName = classNames.get(info['class'])
                    if newClassName[0] == ' ':
                        newClassName = newClassName[1:]
                    notifications_table.append(Notification(tracker_id=info['complete_id'], end_time=info['last_seen'], anomaly_type=boule, camera_id=1, path=file_path))


                for notification in notifications_table:
                    print(f"Tracker ID: {notification.tracker_id}")
                    print(f"end_time: {notification.end_time}")
                    print(f"anomaly_type: {notification.anomaly_type}")
                    print(f"camera_id: {notification.camera_id}")
                    print(f"path: {notification.path}")
                    insertEventInMongoDB(notification.__dict__)

                notifications_table.clear()
                trackers_info.clear()

                # Générez la miniature
                thumbnail_path = defineThumbnailPath(file_path)
                generate_thumbnail(file_path, thumbnail_path)
                print(file_path)
                print(thumbnail_path)
                transferToServerSSH(file_path, f'/home/user/videos/{os.path.basename(file_path)}')
                transferToServerSSH(thumbnail_path, f'/home/user/videos/thumbnails/{os.path.basename(thumbnail_path)}')
                print("Fichiers transférés avec succès!")


            if recording:
                writer.append_data(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            text = "Objet detected" if object_detected else "No object detected"
            text_position = (int(frame.shape[1]/12), int(frame.shape[0]/12))
            cv2.putText(frame, text, text_position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            combined_frame = np.hstack((original_frame, frame))

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        else:
            # Break the loop if the end of the video is reached
            break

    release_resources(cap)

# (id, end_time, anomaly_type, camera_id, path)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == '__main__':
    app.run(debug=True)
