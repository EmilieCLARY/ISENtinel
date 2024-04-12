import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function getVideoPath(date, time){

    const dateStr = date.replaceAll("-", "");
    const timeStr = time.replaceAll(":", "");
    //const videoPath = `videos/${dateStr}/${dateStr}_${timeStr}.mp4`;
    const videoPath = `videos/20240405_100408.mp4`;
    //console.log("videoPath: ", videoPath);
    return videoPath;
}


const ClipModal = ({ show, onHide, date, time }) => {
      
    return (
        <Modal show={show} onHide={onHide} centered >
        <Modal.Header closeButton>
            <Modal.Title>Video Clip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <video controls style={{ width: '100%' }}>
            <source src={getVideoPath(date,time)} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Close
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default ClipModal;
