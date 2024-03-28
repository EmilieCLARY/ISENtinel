import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ClipModal = ({ show, onHide, date, time }) => {
    // Generate the path of the video based on date and time
    //const videoPath = `client/src/resources/videos/${date.replace(/-/g, '')}/${date.replace(/-/g, '_')}_${time.replace(/:/g, '')}.avi`;
    const videoPath = `../resources/videos/20240328/20240328_103653.avi`;
  
    return (
        <Modal show={show} onHide={onHide} centered >
        <Modal.Header closeButton>
            <Modal.Title>Video Clip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <video controls style={{ width: '100%' }}>
            <source src={videoPath} type="video/x-msvideo" />
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
