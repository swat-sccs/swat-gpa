import logo from './logo.svg';
import './App.scss';
import React, { useState } from 'react';

import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Table, Row, Col, Nav, Navbar } from 'react-bootstrap';


const ExampleToast = ({ children }) => {
  const [show, toggleShow] = useState(true);

  return (
    <Toast show={show} onClose={() => toggleShow(!show)}>
      <Toast.Header>
        <strong className="mr-auto">React-Bootstrap</strong>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};


function App() {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" >
        <Navbar.Brand href="#home">
          SCCS
        </Navbar.Brand>
        <Nav activeKey="/">
          <Nav.Item>
            <Nav.Link href="https://sccs.swarthmore.edu">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="https://sccs.swarthmore.edu/docs">Docs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/">GPA Calculator</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>


      <Container className="p-3">
        <h1 className="header">Swarthmore College GPA Calculator</h1>
        <p>
          Instructions: Go to <a href="https://myswat.swarthmore.edu/" target="_blank">mySwat</a>, copy the entirety of the "Grades at a Glance" page (CTRL + A), then paste it into the text box below. Finally, click "Calculate GPA" to see your GPA.
        </p>

      </Container>
      <h1 id="gpa"></h1>
      <header className="App-header">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Important Text Box</Form.Label>
            <Form.Control id="eval-text" as="textarea" rows={3} />
          </Form.Group>
        </Form>
        <Row>
          <Col>
            <Button id="calcbtn" variant="primary" size="lg" as="input" type="submit" value="Calculate Grades" onClick={calculate} />
          </Col>
          <Col>
            <Button variant="primary" size="lg" as="input" type="submit" value="Clear Text Box" onClick={clearBox} />
          </Col>
          <Col>
            <Button variant="primary" size="lg" as="input" type="submit" value="Fill with Sample" onClick={fillSample} />
          </Col>
          <Col>
            <Button variant="primary" size="lg" as="input" type="submit" value="ddd" onClick={calculategpa} />
          </Col>
        </Row>


        <Table striped borderless hover className="Table">
          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col">Title</th>
              <th scope="col">Credits Attempted</th>
              <th scope="col">Credits Earned</th>
              <th scope="col">Grade</th>
              <th scope="col">Division</th>
              <th scope="col">Instructor</th>
              <th scope="col">Affects GPA</th>
            </tr>
          </thead>
          <tbody id="grades-table">

          </tbody>
        </Table>

        <ExampleToast>
          We now have Toasts
          <span role="img" aria-label="tada">
            🎉
          </span>
        </ExampleToast>
      </header>
    </div>
  );

  function SubmitButton() {
    function calculate() {
      var raw_str = document.getElementById("eval-text").value;

      var course_list = parse_grade(raw_str);
      generate_table(course_list);
    };

    return (
      <div className="d-grid gap-2">

        <Button variant="primary" size="lg" as="input" type="submit" value="Calculate!" onClick={calculate} />
      </div>
    );
  }

}

function clearBox() {
  document.getElementById("eval-text").value = "";
}

function fillSample() {
  document.getElementById("eval-text").value = "Grades at a Glance\n" +
    "Unofficial Grade Report - including PE courses	\n" +
    "Name	College ID	Class Year	Majors	Minors	Honors\n" +
    "John A. Doe	123456789	2025	Computer Science	 	 \n" +
    "Term	Course	Course Title	Credits Attempted	Credits Earned	Grade	Distribution	Instructor\n" +
    "202202 Spring 2022	LING 050 01W	Syntax (W)	1	1	A-	SS, W	Irwin, Patricia\n" +
    " 	CPSC 075 01	Compilers	1	1	D	NS, NSEP	Palmer, Zachary\n" +
    " 	THEA 004E 01	Sound Design	1	1	B	HU	Atkinson, Elizabeth\n" +
    " 	ENGL 028 01	Milton	1	1	A	HU	Song, Eric\n" +
    "Credits Earned	 	 	 	4	 	 	 \n" +
    "202104 Fall 2021	ENGL 035 01	Rise of the Novel(W)	1	1	A-	HU, W	Buurma, Rachel\n" +
    " 	ENGR 015 01	Fund Digital&Embedded System	1	1	A-	NS, NSEP	Phillips, Stephen\n" +
    " 	PHED 071CS 01	CS: Fencing	0	0	1	PE	 \n" +
    " 	CPSC 073 01	Programming Languages	1	1	A	NS, NSEP	Palmer, Zachary\n" +
    " 	MATH 027 02	Linear Algebra	1	1	C	NS	Lorman, Vitaly\n" +
    "Credits Earned	 	 	 	4	 	 	 \n" +
    "202102 Spring 2021	PSYC 001 01	R:Introduction to Psychology	1	1	A	SS	Blanchar, John\n" +
    " 	CPSC 031 01	R:Intro to Computer Systems	1	1	A	NS, NSEP	Newhall, Tia\n" +
    " 	ENGL 046 01	R:Tolkien & Pullman: Lit Roots	1	1	A-	HU	Williamson, Craig\n" +
    " 	MATH 029 01	R:Discrete Mathematics	1	1	B	NS	Crawford, Thomas\n" +
    " 	PHED 071CS 01	CS: Fencing	0	0	1	PE	 \n" +
    "Credits Earned	 	 	 	4	 	 	 \n" +
    "Total Credits Earned	 	 	 	12	 	 	 \n" +
    "release 1.0 Set Screen Reader Mode On\n";
}

function calculate() {
  var raw_str = document.getElementById("eval-text").value;

  var course_list = parse_grade(raw_str);
  generate_table(course_list);

  calculategpa();
  

  document.getElementById("calcbtn").value = "Reevaluate";
};

const ROUND_TO = 2;
// Official grade point equivalencies from the Swarthmore College registrar
const GRADE_POINT_EQUIVS = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.0,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.0,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.0,
  'D-': 0.67,
  'F': 0.0
};

const COURSE_FIELDS = ['course',
  'title',
  'credits_attemped',
  'credits_earned',
  'grade',
  'division',
  'instructor',
  'affects_gpa'];

function grade_point_equiv(grade) {
  if (grade in GRADE_POINT_EQUIVS) {
    return GRADE_POINT_EQUIVS[grade];
  } else {
    // Grade is already formatted as a grade point float (for Bryn Mawr and Haverford classes)
    // Or it's has no grade (for C/NC classes)
    var grade_point = parseFloat(grade);
    return isNaN(grade_point) ? 0.0 : grade_point;
  }
}

function parse_grade(raw_str) {
  var lines = raw_str.split('\n');

  // Remove term header lines
  var courses = lines.filter(function (line) {
    return line.trim().match(/[A-Z]{4}\s\d{3}/);
  });

  var course_list = [];

  courses.forEach(function (course) {
    var course_info = course.split('\t');
    course_info.shift();
    course_info.push(true);

    if (course_info.length == COURSE_FIELDS.length) {
      var dict = Object.fromEntries(course_info.map(function (field, i) {
        return [COURSE_FIELDS[i], course_info[i]];
      }));

      if (grade_point_equiv(dict['grade']) == 0.0) {
        dict['affects_gpa'] = false;
      }
      course_list.push(dict);
    }
  });

  return course_list;
}

function generate_table(course_list) {
  course_list.forEach(function (course) {
    if (document.getElementById(course['course']) == null) { // Don't add duplicate courses
      var row = document.createElement("tr");
      COURSE_FIELDS.forEach(function (field) {
        var cell = document.createElement("td");

        if (field == "affects_gpa" && course[field]) {
          cell.innerHTML = "<input type=\"checkbox\" id=\"" + course["course"] + "\" checked></input>";
        } else {
          cell.innerHTML = course[field];
        }
        row.appendChild(cell);
      });
      document.getElementById("grades-table").appendChild(row);
    }
  });
}


function calculategpa() {
  let courses = [];

  document.getElementById('grades-table').querySelectorAll('tr').forEach((row, i) => {
    if (i === 0) { return true; } 

    let course_data = {};
    let include = false;

    Array.from(row.children).forEach((cell, j) => {
      if (cell.getAttribute('class') === 'affects_gpa') {
        let checkbox = cell.children[0];
        if (checkbox && checkbox.checked) {
          include = true;
        }
      } else if (['grade', 'credits_earned'].includes(cell.getAttribute('class'))) {
        course_data[cell.getAttribute('class')] = cell.innerHTML;
      }

      if (include) {
        courses.push(course_data);
      }
    });

    let total_grade_points = 0;
    let total_credits = 0;

    courses.forEach(course => {
      total_grade_points += grade_point_equiv(course.grade) * course.credits_earned;
      total_credits += course.credits_earned;
    });

    let gpa = total_grade_points / total_credits;
    gpa = gpa.toFixed(ROUND_TO);

    document.querySelector('#gpa').innerHTML = gpa;
    // document.querySelector('#selected_count').innerHTML = " (" + courses.length + " courses selected)";
  });

  return true;
}
export default App;
