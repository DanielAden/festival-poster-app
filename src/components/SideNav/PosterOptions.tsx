import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Form,
  Row,
  Col,
  Label,
  FormGroup,
} from 'reactstrap';

interface PosterOptionsProps {}
const PosterOptions: React.FC<PosterOptionsProps> = () => {
  const renderDates = () => {
    return (
      <Form>
        <Row>
          <Col>
            <Label>Start</Label>
            <Input></Input>
          </Col>
          <Col>
            <Label>End</Label>
            <Input></Input>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <div>
      <Input placeholder='Festival Name' />
      <FormGroup check>
        <Label check>
          <Input type='checkbox' />
          Enable Festival Dates
        </Label>
      </FormGroup>

      {renderDates()}
    </div>
  );
};

export default PosterOptions;
