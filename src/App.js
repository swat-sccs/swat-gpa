import logo from './logo.svg';
import './App.scss';
import React from 'react';
import ReactDOM from 'react-dom/client'

import { Button, Form, Container, Table, Nav, Navbar } from 'react-bootstrap';

import FormattingErrorToast from './Components/FormattingErrorToast';

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
  'credits_attempted',
  'credits_earned',
  'grade',
  'division',
  'instructor',
  'affects_gpa'];

function App() {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" >
        <Container>
          <Navbar.Brand href="https://sccs.swarthmore.edu">
            <img
              src={logo}
              width="65"
              height="65"
              className="d-inline-block align-top"
              alt="SCCS Logo"
            />
          </Navbar.Brand>
          <Nav>
            <Nav.Item>
              <Nav.Link href="/"><h4>Swarthmore College <br /> <strong>GPA Calculator</strong></h4></Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav activeKey="/">
            <Nav.Item>
              <Nav.Link href="https://sccs.swarthmore.edu/docs"><h4>Docs</h4></Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <div id="form-barrier" className="p-3">
            <div id="formatting-error"></div>
            <Form>
            <Form.Group className="mb-3">
                <Form.Control id="eval-text" as="textarea" rows={18}
                placeholder="Instructions: Go to mySwat, copy the entirety of the Grades at a Glance page (CTRL + A), then paste it into this text box." />
            </Form.Group>
            </Form>
            <CustomButton value="Calculate" onClick={populate_table} />
            <CustomButton value="Example" onClick={fill_sample} />
            <CustomButton value="Clear" onClick={clear} />
        </div>
      </Container>

      <Container className="p-3">
        <p className="instructionsText">
          Instructions: Go to <a href="https://myswat.swarthmore.edu/" target="_blank" rel="noreferrer">mySwat</a>, copy the entirety of the "Grades at a Glance" page (CTRL + A), then paste it into the text box above. Finally, click "Calculate GPA" to see your GPA.
        </p>
      </Container>

      <Container className="p-3">
        <h1 id="gpa"></h1>
        <p id="selected-count"></p>
      </Container>

      <Container>
        <div className="ScrollTable">
            <Table striped borderless hover className="Table multiCol" onClick={calculategpa}>
            <thead>
                <tr>
                <th scope="col" className="RightAlign">Course</th>
                <th scope="col" className="LeftAlign">Title</th>
                <th scope="col" className="HideColumn">CR Attempted</th>
                <th scope="col" className="HideMoreColumn">CR Earned</th>
                <th scope="col">Grade</th>
                <th scope="col" className="HideColumn">Division</th>
                <th scope="col" className="HideColumn">Instructor</th>
                <th scope="col">Affects GPA</th>
                </tr>
            </thead>
            <tbody id="grades-table">

            </tbody>
            </Table>
        </div>
      </Container>

    </div>
  );
}

function CustomButton(props) {
  return (
    <Button className="Button" size="lg" variant="primary" as="input" type="submit" onClick={props.onClick} value={props.value} />
  );
}

function clearText() {
  document.getElementById("eval-text").value = "";
  document.getElementById("eval-text").rows = 18;
}

function clearInfo() {
  document.getElementById("grades-table").innerHTML = "";
  document.getElementById("gpa").innerHTML = "";
  document.getElementById("selected-count").innerHTML = "";
}

function clear() {
  clearText();
  clearInfo();
}

function grade_point_equiv(grade, division) {
  if (grade in GRADE_POINT_EQUIVS) {
    return GRADE_POINT_EQUIVS[grade];
  } else if (division.includes('PE')) {
    // PE classes don't affect GPA
    return 0.0;
  } else {
    // Grade is already formatted as a grade point float (for Bryn Mawr and Haverford classes)
    // Or it's has no grade (for C/NC classes)
    var grade_point = parseFloat(grade);
    return isNaN(grade_point) ? 0.0 : grade_point;
  }
}

function parse_input() {
  var raw_str = document.getElementById("eval-text").value;
  var lines = raw_str.split('\n');

  // Remove term header lines
  var courses = lines.filter(function (line) {
    return line.trim().match(/[A-Z]{4}\s\d{3}/);
  });

  var course_list = [];

  for (const course of courses) {
    if (course.match(/Prior to Matriculation/)) {
      break; // don't include AP scores
    }
    var course_info = course.split('\t');
    course_info.shift();
    course_info.push(true); // Add 'affects_gpa' field

    if (course_info.length === COURSE_FIELDS.length) {
      var dict = Object.fromEntries(course_info.map(function (field, i) {

        return [COURSE_FIELDS[i], course_info[i]];
      }));

      if (grade_point_equiv(dict['grade'], dict['division']) === 0.0) {
        dict['affects_gpa'] = false;
      }
      course_list.push(dict);
    }
  }

  return course_list;
}

function populate_table() {
  let course_list = parse_input();
  let populated = false;

  clearInfo(); // Let me be clear
  course_list.forEach(function (course) {
    var row = document.createElement("tr");
    COURSE_FIELDS.forEach(function (field) {
      var cell = document.createElement("td");
      if (field === "course") {
        cell.className = "RightAlign";
      }
      if (field === "title") {
        cell.className = "LeftAlign";
      }
      if (field === "instructor" || field === "division" || field === "credits_attempted") {
        cell.className = "HideColumn";
      }
      if (field === "credits_earned") {
        cell.className = "HideMoreColumn";
      }

      if (field === "affects_gpa") {
        if (course[field]) {
          cell.innerHTML = "<input type=\"checkbox\" id=\"" + course["course"] + "\" checked></input>";
        }
      } else {
        cell.innerHTML = course[field];
      }
      row.appendChild(cell);
    });
    document.getElementById("grades-table").appendChild(row);
    populated = true;
  });

  if (populated) {
    document.getElementById("eval-text").rows = 6;
    calculategpa();
    if (document.getElementById('error-toast') != null) {
      const root = ReactDOM.createRoot(document.getElementById("formatting-error"));
      root.render(null);
    }
  } else {
    const root = ReactDOM.createRoot(document.getElementById("formatting-error"));
    root.render(<FormattingErrorToast />);
  }
}


function calculategpa() {
  let total_grade_points = 0;
  let total_credits = 0;
  let courses = 0;
  let gpa = null;

  for (let i = 0; i < document.getElementById('grades-table').rows.length; i++) {
    let row = document.getElementById('grades-table').rows[i];

    let checkbox = row.cells[COURSE_FIELDS.indexOf('affects_gpa')].children[0]; // Affected GPA checkbox
    if (checkbox && checkbox.checked) {
      let credits = parseFloat(row.cells[COURSE_FIELDS.indexOf('credits_earned')].innerHTML);
      let grade_points = grade_point_equiv(row.cells[COURSE_FIELDS.indexOf('grade')].innerHTML, row.cells[COURSE_FIELDS.indexOf('division')].innerHTML);
      total_grade_points += grade_points * credits;
      total_credits += credits;
      courses++;
    }

    gpa = (total_grade_points / total_credits).toFixed(ROUND_TO);
    document.getElementById('selected-count').innerText = " (" + courses + " courses selected)";
  }
  document.getElementById('gpa').innerHTML = "GPA: " + gpa;

  return true;
}

function fill_sample() {
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

  populate_table();
}

export default App;
