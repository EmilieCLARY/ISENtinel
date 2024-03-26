import React from 'react';
import '../style/homepage.css';

import { BsArrowReturnRight } from "react-icons/bs";

export default function LogMessage({ message , type}) {
    return (
        <p className={`logMessage ${type}`} style={{marginInline: '1vw'}}><BsArrowReturnRight /> {message}</p>
    );
}

