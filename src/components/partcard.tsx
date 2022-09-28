import { Card, Row, Col } from 'antd';

const PartCard = (props: any) => {
    const part = props.part;
    return(
        <Card>
            <Row>
                <Col xl={6}>
                    <img className="part-img" src={part.part.part_img_url}></img>
                </Col>
                <Col xl={18} className="part-description">
                    <p className="part-description-paragraph">{part.part.name}</p>
                    <b>{part.part.part_num}</b>
                </Col>
            </Row>
        </Card>
    )
}

export default PartCard;