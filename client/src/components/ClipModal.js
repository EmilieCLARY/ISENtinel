import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function getVideoPath(path){
    let newpath = 'videos/' + path.split("/")[2];
    return newpath;
}

function getOriginalPath(){

}


const ClipModal = ({ show, onHide, path }) => {
      
    return (
        <Modal show={show} onHide={onHide} centered >
        <Modal.Header closeButton>
            <Modal.Title>Video Clip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <video controls style={{ width: '100%' }}>
            <source src={getVideoPath(path)} type="video/mp4" />
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
