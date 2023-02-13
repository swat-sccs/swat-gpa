import logo from '../logo.svg';
import { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function FormattingErrorToast() {
    const [show, setShow] = useState(true);
    const toggleShow = () => setShow(!show);

    return (
        <ToastContainer className="p-3 position-fixed">
            <Toast show={show} onClose={toggleShow} position="bottom-start">
                <Toast.Header closeButton={true}>
                    <img
                        src={logo}
                        height="20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Error: Grade Formatting</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body>Sorry, we couldn't quite find the grades in your paste. Please make sure you copy the entire page!</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default FormattingErrorToast;