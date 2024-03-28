from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import cvzone #pour diplay les detections avec des couleurs
import math
import datetime
import os
import sys

app = Flask(__name__)
CORS(app)

classNames = {
    4:"Alarm clock",
    6: "Ambulance",
    14: "Axe",
    15: "Backpack",
    19: "Ball",
    20: "Balloon",
    22: "Band-aid",
    26: "Baseball bat",
    28: "Bat",
    32: "Beaker",
    35: "Bee",
    36: "Beehive",
    37: "Beer",
    40: "Belt",
    41: "Bench",
    42: "Bicycle",
    43: "Bicycle helmet",
    45: "Bidet",
    46: "Billboard",
    47: "Billiard table",
    48: "Binoculars",
    49: "Bird",
    50: "Blender",
    53: "Bomb",
    54: "Book",
    55: "Bookcase",
    56: "Boot",
    57: "Bottle",
    58: "Bottle opener",
    59: "Bow and arrow",
    60: "Bowl",
    62: "Box",
    64: "Brassiere",
    65: "Bread",
    66: "Briefcase",
    68: "Bronze sculpture",
    72: "Burrito",
    75: "Butterfly",
    78: "Cake",
    80: "Calculator",
    82: "Camera",
    83: "Can opener",
    85: "Candle",
    86: "Candy",
    87: "Cannon",
    93: "Cart",
    94: "Cassette deck",
    96: "Cat",
    100:" Ceiling fan",
    103:" Chainsaw",
    108:" Chicken",
    110:" Chisel",
    111:" Chopsticks",
    112:" Christmas tree",
    113:" Clock",
    117:" Cocktail",
    119:" Coconut",
    121:" Coffee cup",
    123:" Coffeemaker",
    124:" Coin",
    127:" Computer keyboard",
    128:" Computer monitor",
    129:" Computer mouse",
    136:" Couch",
    138:" Cowboy hat",
    142:" Crocodile",
    145:" Crutch",
    148:" Curtain",
    149:" Cutting board",
    150:" Dagger",
    151:" Dairy Product",
    152:" Deer",
    153:" Desk",
    154:" Dessert",
    155:" Diaper",
    156:" Dice",
    157:" Digital clock",
    158:" Dinosaur",
    159:" Dishwasher",
    160:" Dog",
    161:" Dog bed",
    162:" Doll",
    163:" Dolphin",
    164:" Door",
    165:" Door handle",
    166:" Doughnut",
    167:" Dragonfly",
    168:" Drawer",
    169:" Dress",
    170:" Drill (Tool)",
    171:" Drink",
    172:" Drinking straw",
    173:" Drum",
    174:" Duck",
    175:" Dumbbell",
    176:" Eagle",
    177:" Earrings",
    178:" Egg (Food)",
    179:" Elephant",
    180:" Envelope",
    181:" Eraser",
    182:" Face powder",
    183:" Facial tissue holder",
    184:" Falcon",
    185:" Fashion accessory",
    186:" Fast food",
    187:" Fax",
    188:" Fedora",
    189:" Filing cabinet",
    190:" Fire hydrant",
    191:" Fireplace",
    192:" Fish",
    193:" Flag",
    194:" Flashlight",
    195:" Flower",
    196:" Flowerpot",
    197:" Flute",
    198:" Flying disc",
    199:" Food",
    200:" Food processor",
    201:" Football",
    202:" Football helmet",
    203:" Footwear",
    204:" Fork",
    205:" Fountain",
    206:" Fox",
    207:" French fries",
    208:" French horn",
    209:" Frog",
    210:" Fruit",
    211:" Frying pan",
    212:" Furniture",
    213:" Garden Asparagus",
    214:" Gas stove",
    215:" Giraffe",
    216:" Girl",
    217:" Glasses",
    218:" Glove",
    219:" Goat",
    220:" Goggles",
    221:" Goldfish",
    222:" Golf ball",
    223:" Golf cart",
    224:" Gondola",
    225:" Goose",
    226:" Grape",
    227:" Grapefruit",
    228:" Grinder",
    229:" Guacamole",
    230:" Guitar",
    231:" Hair dryer",
    232:" Hair spray",
    233:" Hamburger",
    234:" Hammer",
    235:" Hamster",
    236:" Hand dryer",
    237:" Handbag",
    238:" Handgun",
    239:" Harbor seal",
    240:" Harmonica",
    241:" Harp",
    242:" Harpsichord",
    243:" Hat",
    244:" Headphones",
    245:" Heater",
    246:" Hedgehog",
    247:" Helicopter",
    248:" Helmet",
    249:" High heels",
    250:" Hiking equipment",
    251:" Hippopotamus",
    252:" Home appliance",
    253:" Honeycomb",
    254:" Horizontal bar",
    255:" Horse",
    256:" Hot dog",
    257:" House",
    258:" Houseplant",
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
    272:" Humidifier",
    273:" Ice cream",
    274:" Indoor rower",
    275:" Infant bed",
    276:" Insect",
    277:" Invertebrate",
    278:" Ipod",
    279:" Isopod",
    280:" Jacket",
    281:" Jacuzzi",
    282:" Jaguar (Animal)",
    283:" Jeans",
    284:" Jellyfish",
    285:" Jet ski",
    286:" Jug",
    287:" Juice",
    288:" Kangaroo",
    289:" Kettle",
    290:" Kitchen & dining room table",
    291:" Kitchen appliance",
    292:" Kitchen knife",
    293:" Kitchen utensil",
    294:" Kitchenware",
    295:" Kite",
    296:" Knife",
    297:" Koala",
    298:" Ladder",
    299:" Ladle",
    300:" Ladybug",
    301:" Lamp",
    302:" Land vehicle",
    303:" Lantern",
    304:" Laptop",
    305:" Lavender (Plant)",
    306:" Lemon",
    307:" Leopard",
    308:" Light bulb",
    309:" Light switch",
    310:" Lighthouse",
    311:" Lily",
    312:" Limousine",
    313:" Lion",
    314:" Lipstick",
    315:" Lizard",
    316:" Lobster",
    317:" Loveseat",
    318:" Luggage and bags",
    319:" Lynx",
    320:" Magpie",
    321:" Mammal",
    322:" Man",
    323:" Mango",
    324:" Maple",
    325:" Maracas",
    326:" Marine invertebrates",
    327:" Marine mammal",
    328:" Measuring cup",
    329:" Mechanical fan",
    330:" Medical equipment",
    331:" Microphone",
    332:" Microwave oven",
    333:" Milk",
    334:" Miniskirt",
    335:" Mirror",
    336:" Missile",
    337:" Mixer",
    338:" Mixing bowl",
    339:" Mobile phone",
    340:" Monkey",
    341:" Moths and butterflies",
    342:" Motorcycle",
    343:" Mouse",
    344:" Muffin",
    345:" Mug",
    346:" Mule",
    347:" Mushroom",
    348:" Musical instrument",
    349:" Musical keyboard",
    350:" Nail (Construction)",
    351:" Necklace",
    352:" Nightstand",
    353:" Oboe",
    354:" Office building",
    355:" Office supplies",
    356:" Orange",
    357:" Organ (Musical Instrument)",
    358:" Ostrich",
    359:" Otter",
    360:" Oven",
    361:" Owl",
    362:" Oyster",
    363:" Paddle",
    364:" Palm tree",
    365:" Pancake",
    366:" Panda",
    367:" Paper cutter",
    368:" Paper towel",
    369:" Parachute",
    370:" Parking meter",
    371:" Parrot",
    372:" Pasta",
    373:" Pastry",
    374:" Peach",
    375:" Pear",
    376:" Pen",
    377:" Pencil case",
    378:" Pencil sharpener",
    379:" Penguin",
    380:" Perfume",
    381:" Person",
    382:" Personal care",
    383:" Personal flotation device",
    384:" Piano",
    385:" Picnic basket",
    386:" Picture frame",
    387:" Pig",
    388:" Pillow",
    389:" Pineapple",
    390:" Pitcher (Container)",
    391:" Pizza",
    392:" Pizza cutter",
    393:" Plant",
    394:" Plastic bag",
    395:" Plate",
    396:" Platter",
    397:" Plumbing fixture",
    398:" Polar bear",
    399:" Pomegranate",
    400:" Popcorn",
    401:" Porch",
    402:" Porcupine",
    403:" Poster",
    404:" Potato",
    405:" Power plugs and sockets",
    406:" Pressure cooker",
    407:" Pretzel",
    408:" Printer",
    409:" Pumpkin",
    410:" Punching bag",
    411:" Rabbit",
    412:" Raccoon",
    413:" Racket",
    414:" Radish",
    415:" Ratchet (Device)",
    416:" Raven",
    417:" Rays and skates",
    418:" Red panda",
    419:" Refrigerator",
    420:" Remote control",
    421:" Reptile",
    422:" Rhinoceros",
    423:" Rifle",
    424:" Ring binder",
    425:" Rocket",
    426:" Roller skates",
    427:" Rose",
    428:" Rugby ball",
    429:" Ruler",
    430:" Salad",
    431:" Salt and pepper shakers",
    432:" Sandal",
    433:" Sandwich",
    434:" Saucer",
    435:" Saxophone",
    436:" Scale",
    437:" Scarf",
    438:" Scissors",
    439:" Scoreboard",
    440:" Scorpion",
    441:" Screwdriver",
    442:" Sculpture",
    443:" Sea lion",
    444:" Sea turtle",
    445:" Seafood",
    446:" Seahorse",
    447:" Seat belt",
    448:" Segway",
    449:" Serving tray",
    450:" Sewing machine",
    451:" Shark",
    452:" Sheep",
    453:" Shelf",
    454:" Shellfish",
    455:" Shirt",
    456:" Shorts",
    457:" Shotgun",
    458:" Shower",
    459:" Shrimp",
    460:" Sink",
    461:" Skateboard",
    462:" Ski",
    463:" Skirt",
    464:" Skull",
    465:" Skunk",
    466:" Skyscraper",
    467:" Slow cooker",
    468:" Snack",
    469:" Snail",
    470:" Snake",
    471:" Snowboard",
    472:" Snowman",
    473:" Snowmobile",
    474:" Snowplow",
    475:" Soap dispenser",
    476:" Sock",
    477:" Sofa bed",
    478:" Sombrero",
    479:" Sparrow",
    480:" Spatula",
    481:" Spice rack",
    482:" Spider",
    483:" Spoon",
    484:" Sports equipment",
    485:" Sports uniform",
    486:" Squash (Plant)",
    487:" Squid",
    488:" Squirrel",
    489:" Stairs",
    490:" Stapler",
    491:" Starfish",
    492:" Stationary bicycle",
    493:" Stethoscope",
    494:" Stool",
    495:" Stop sign",
    496:" Strawberry",
    497:" Street light",
    498:" Stretcher",
    499:" Studio couch",
    500:" Submarine",
    501:" Submarine sandwich",
    502:" Suit",
    503:" Suitcase",
    504:" Sun hat",
    505:" Sunglasses",
    506:" Surfboard",
    507:" Sushi",
    508:" Swan",
    509:" Swim cap",
    510:" Swimming pool",
    511:" Swimwear",
    512:" Sword",
    513:" Syringe",
    514:" Table",
    515:" Table tennis racket",
    516:" Tablet computer",
    517:" Tableware",
    518:" Taco",
    519:" Tank",
    520:" Tap",
    521:" Tart",
    522:" Taxi",
    523:" Tea",
    524:" Teapot",
    525:" Teddy bear",
    526:" Telephone",
    527:" Television",
    528:" Tennis ball",
    529:" Tennis racket",
    530:" Tent",
    531:" Tiara",
    532:" Tick",
    533:" Tie",
    534:" Tiger",
    535:" Tin can",
    536:" Tire",
    537:" Toaster",
    538:" Toilet",
    539:" Toilet paper",
    540:" Tomato",
    541:" Tool",
    542:" Toothbrush",
    543:" Torch",
    544:" Tortoise",
    545:" Towel",
    546:" Tower",
    547:" Toy",
    548:" Traffic light",
    549:" Traffic sign",
    550:" Train",
    551:" Training bench",
    552:" Treadmill",
    553:" Tree",
    554:" Tree house",
    555:" Tripod",
    556:" Trombone",
    557:" Trousers",
    558:" Truck",
    559:" Trumpet",
    560:" Turkey",
    561:" Turtle",
    562:" Umbrella,",
    563:" Unicycle",
    564:" Van",
    565:" Vase",
    566:" Vegetable",
    567:" Vehicle",
    568:" Vehicle registration plate",
    569:" Violin",
    570:" Volleyball (Ball)",
    571:" Waffle",
    572:" Waffle iron",
    573:" Wall clock",
    574:" Wardrobe",
    575:" Washing machine",
    576:" Waste container",
    577:" Watch",
    578:" Watercraft",
    579:" Watermelon",
    580:" Weapon",
    581:" Whale",
    582:" Wheel",
    583:" Wheelchair",
    584:" Whisk",
    585:" Whiteboard",
    586:" Willow",
    587:" Window",
    588:" Window blind",
    589:" Wine",
    590:" Wine glass",
    591:" Wine rack",
    592:" Winter melon",
    593:" Wok",
    594:" Woman",
    595:" Wood-burning stove",
    596:" Woodpecker",
    597:" Worm",
    598:" Wrench",
    599:" Zebra",
    600:" Zucchini"}

selected_classes = [];

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


main_folder_path = "../src/resources/videos"

def video_builder():

    fourcc = cv2.VideoWriter_fourcc(*'XVID')

    # Get the current date and time
    now = datetime.datetime.now()
    date_string = now.strftime("%Y%m%d")
    time_string = now.strftime("%H%M%S")
    
    # Create the folder path with the current date
    folder_path = os.path.join(main_folder_path, date_string)
    
    # Create the folder if it does not exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Create the file name with the current time
    file_name = date_string + "_" + time_string + ".avi"

    # Create the complete file path
    file_path = os.path.join(folder_path, file_name)
    out = cv2.VideoWriter(file_path, fourcc, 20.0, (640, 480))

    return out, file_path

def check_video_frame_count(video_path):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    return total_frames

def generate_frames():
    
    cap = cv2.VideoCapture(0)
    model = YOLO("../Yolo-Weights/yolov8n-oiv7.pt") #chargement du model
    out, file_path = video_builder()

    recording = False
    is_object_detected = False

    while True:
        #out = video_builder()
        success, frame = cap.read()

        if not success:
            break
        else:
            results = model(frame, stream=True) #detection des objets dans la frame
            if not results:
                recording = False
                print("No object detected")
            else:
                recording = True
                for r in results : 
                    boxes = r.boxes
                    for box in boxes : # on va chercher le x et y de toutes les binding boxes
                        x1, y1, x2, y2 = box.xyxy[0]
                        x1, y1, w, h = int(x1), int(y1), int(x2-x1), int(y2-y1)
                        bbox = [x1, y1,w,h] #pour convertir les valeurs en int
                        #print(x1, y1, w, h)
                        cvzone.cornerRect(frame,bbox,colorC= (0,0,255), colorR=(10,10,10),rt=2) #affichage des bounding boxes

                        conf = math.ceil(box.conf[0]*100)/100 #pour afficher la confiance de guess
                        print(conf)

                        class_name = int(box.cls[0]) #pour afficher le nom de la classe
                        cvzone.putTextRect(frame, f'{conf}{classNames.get(class_name)}', (max(0,x1),max(y1-20,40))) #affichage de la confiance de guess

                        is_object_detected = True
                        recording = True

            if recording:
                out.write(frame)
            if is_object_detected:
                cv2.putText(frame, "Recording", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                out.write(frame)
            else:
                cv2.putText(frame, "Not recording", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                out.release()
                total_frames = check_video_frame_count(file_path)
                if(total_frames < 10):
                    os.remove(file_path)
                out, file_path = video_builder()
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            is_object_detected = False

    cap.release()


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)