import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ClipModal = ({ show, onHide, date, time }) => {
    //const videoPath = "/videos/20240328_151244.mp4";
    const videoPath = "";
  
    return (
        <Modal show={show} onHide={onHide} centered >
        <Modal.Header closeButton>
            <Modal.Title>Video Clip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <video controls style={{ width: '100%' }}>
            <source src={videoPath} type="video/mp4" />
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
