import { Button } from "react-bootstrap";

export function CustomButton(props) {
    return (
        <Button className="Button" size="lg" variant="primary" as="input" type="submit" onClick={props.onClick} value={props.value} />
    );
}