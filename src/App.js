import logo from './logo.svg';
import './App.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Form, Container, Table, Nav, Navbar } from 'react-bootstrap';

import FormattingErrorToast from './Components/FormattingErrorToast';
import { CustomButton } from './Components/CustomButton';
import { DepartmentDropdown } from './Components/DepartmentDropdown';

import 'bootstrap/dist/js/bootstrap.bundle.min';

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
const COURSE_FIELDS = [
  'course',
  'title',
  'credits_attempted',
  'credits_earned',
  'grade',
  'division',
  'instructor',
  'affects_gpa'
];

let useDeptMode = false;

function App() {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark">
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
              <Nav.Link href="/">
                <h4>
                  Swarthmore College <br /> <strong>GPA Calculator</strong>
                </h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav activeKey="/">
            <Nav.Item>
              <Nav.Link href="https://sccs.swarthmore.edu/docs">
                <h4>Docs</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <div id="form-barrier" className="p-3">
          <div id="formatting-error" />

          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                id="eval-text"
                as="textarea"
                rows={15}
                placeholder="Instructions: Go to mySwat, copy the entirety of the Grades at a Glance page (CTRL + A), then paste it into this text box."
              />
            </Form.Group>
          </Form>

          <CustomButton value="Calculate" onClick={populate_table} />
          <CustomButton value="Example" onClick={fill_sample} />
          <CustomButton value="Clear" onClick={clear} />

          <div id="dept-toggle-container" style={{ display: 'none' }}>
            <Form.Check
              type="checkbox"
              id="deptToggle"
              label="Select Departments"
              className="mb-3"
              onChange={e => {
                useDeptMode = e.target.checked;
                populate_table();
              }}
            />
          </div>

          <div
            id="dept-filter"
            className="mb-3 w-100 d-flex justify-content-center"
          />
        </div>
      </Container>

      <Container className="p-3">
        <p className="instructionsText">
          Instructions: Go to{' '}
          <a
            href="https://myswat.swarthmore.edu/"
            target="_blank"
            rel="noreferrer"
          >
            mySwat
          </a>
          , copy the entirety of the "Grades at a Glance" page (CTRL + A), then
          paste it into the text box above. Finally, click "Calculate GPA" to
          see your GPA.
        </p>
      </Container>

      <Container className="p-3">
        <h1 id="gpa"></h1>
        <p id="selected-count"></p>
      </Container>

      <Container>
        <div className="ScrollTable">
          <Table
            striped
            borderless
            hover
            className="Table multiCol"
            onClick={calculateGPA}
          >
            <thead>
              <tr>
                <th scope="col" className="RightAlign">
                  Course
                </th>
                <th scope="col" className="LeftAlign">
                  Title
                </th>
                <th scope="col" className="HideColumn">CR Attempted</th>
                <th scope="col" className="HideMoreColumn">CR Earned</th>
                <th scope="col">Grade</th>
                <th scope="col" className="HideColumn">Division</th>
                <th scope="col" className="HideColumn">Instructor</th>
                <th scope="col">Affects GPA</th>
              </tr>
            </thead>
            <tbody id="grades-table"></tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
}

function clearText() {
  const txt = document.getElementById('eval-text');
  txt.value = '';
  txt.rows = 15;
}

function clearInfo() {
  document.getElementById('grades-table').innerHTML = '';
  document.getElementById('gpa').innerHTML = '';
  document.getElementById('selected-count').innerHTML = '';
  const deptFilterDiv = document.getElementById('dept-filter');
  if (deptFilterDiv) deptFilterDiv.innerHTML = '';
}

function clear() {
  clearText();
  clearInfo();
  useDeptMode = false;
  const toggleContainer = document.getElementById('dept-toggle-container');
  if (toggleContainer) toggleContainer.style.display = 'none';
  const toggleCheckbox = document.getElementById('deptToggle');
  if (toggleCheckbox) toggleCheckbox.checked = false;
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
    const gp = parseFloat(grade);
    return isNaN(gp) ? 0.0 : gp;
  }
}

function parse_input() {
  const raw_str = document.getElementById('eval-text').value;
  const lines = raw_str.split('\n');
  // Remove term header lines
  const courses = lines.filter(line => line.trim().match(/[A-Z]{4}\s[A-Z0-9]{3}/));

  const course_list = [];
  let prior = false;

  for (const course of courses) {
    if (course.match(/Prior to Matriculation/)) {
      prior = true;
    }
    const parts = course.split('\t');
    parts.shift();
    parts.push(true); // Add 'affects_gpa' field

    if (parts.length === COURSE_FIELDS.length) {
      const dict = Object.fromEntries(
        parts.map((field, i) => [COURSE_FIELDS[i], parts[i]])
      );
      if (prior || grade_point_equiv(dict.grade, dict.division) === 0.0) {
        dict.affects_gpa = false;
      }
      course_list.push(dict);
    }
  }

  return course_list;
}

function populate_table() {
  const course_list = parse_input();
  let populated = false;

  clearInfo(); // Let me be clear

  const toggleContainer = document.getElementById('dept-toggle-container');
  if (toggleContainer) toggleContainer.style.display = 'block';

  const deptFilterDiv = document.getElementById('dept-filter');
  deptFilterDiv.innerHTML = '';
  if (useDeptMode) {
    const depts = Array.from(new Set(course_list.map(c => c.course.split(' ')[0])));
    if (depts.length > 0) {
      const deptRoot = ReactDOM.createRoot(deptFilterDiv);
      deptRoot.render(<DepartmentDropdown departments={depts} onChange={calculateGPA} />);
    }
  }

  course_list.forEach(course => {
    const row = document.createElement('tr');
    COURSE_FIELDS.forEach(field => {
      const cell = document.createElement('td');
      if (field === 'affects_gpa') {
        if (course[field]) {
          cell.innerHTML = `<input type="checkbox" checked />`;
        }
        row.appendChild(cell);
        return;
      }
      cell.innerText = course[field];
      if (field === 'course') cell.className = 'RightAlign';
      if (field === 'title') cell.className = 'LeftAlign';
      if (['instructor', 'division', 'credits_attempted'].includes(field)) cell.className = 'HideColumn';
      if (field === 'credits_earned') cell.className = 'HideMoreColumn';
      row.appendChild(cell);
    });
    document.getElementById('grades-table').appendChild(row);
    populated = true;
  });

  if (populated) {
    document.getElementById('eval-text').rows = 6;
    calculateGPA();
    const errRoot = ReactDOM.createRoot(document.getElementById('formatting-error'));
    errRoot.render(null);
  } else {
    const errRoot = ReactDOM.createRoot(document.getElementById('formatting-error'));
    errRoot.render(<FormattingErrorToast />);
  }
}

function calculateGPA() {
  const selectedDepts = Array.from(
    document.querySelectorAll('.dept-checkbox:checked')
  ).map(cb => cb.value);

  let total_grade_points = 0;
  let total_credits = 0;
  let courses = 0;
  let gpa = null;

  const rows = document.getElementById('grades-table').rows;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const courseCode = row.cells[COURSE_FIELDS.indexOf('course')].innerText;
    const dept = courseCode.split(' ')[0];
    if (useDeptMode && !selectedDepts.includes(dept)) continue;

    const checkbox = row.cells[COURSE_FIELDS.indexOf('affects_gpa')].children[0]; // Affected GPA checkbox
    if (checkbox && checkbox.checked) {
      const credits = parseFloat(
        row.cells[COURSE_FIELDS.indexOf('credits_earned')].innerText
      );
      const grade_points = grade_point_equiv(
        row.cells[COURSE_FIELDS.indexOf('grade')].innerText,
        row.cells[COURSE_FIELDS.indexOf('division')].innerText
      );
      total_grade_points += grade_points * credits;
      total_credits += credits;
      courses++;
    }
    gpa = (total_grade_points / total_credits).toFixed(ROUND_TO);
    document.getElementById('selected-count').innerText = ` (${courses} courses selected)`;
  }
  if (isNaN(gpa)) gpa = '0.00';
  document.getElementById('gpa').innerText = `GPA: ${gpa}`;

  return true;
}

function fill_sample() {
  document.getElementById('eval-text').value =
    "Grades at a Glance\n" +
    "Unofficial Grade Report - including PE courses\t\n" +
    "Name\tCollege ID\tClass Year\tMajors\tMinors\tHonors\n" +
    "John A. Doe\t123456789\t2025\tComputer Science\t \t \n" +
    "Term\tCourse\tCourse Title\tCredits Attempted\tCredits Earned\tGrade\tDistribution\tInstructor\n" +
    "202202 Spring 2022\tLING 050 01W\tSyntax (W)\t1\t1\tA-\tSS, W\tIrwin, Patricia\n" +
    " \tCPSC 075 01\tCompilers\t1\t1\tD\tNS, NSEP\tPalmer, Zachary\n" +
    " \tTHEA 004E 01\tSound Design\t1\t1\tB\tHU\tAtkinson, Elizabeth\n" +
    " \tENGL 028 01\tMilton\t1\t1\tA\tHU\tSong, Eric\n" +
    "Credits Earned\t \t \t \t4\t \t \t \n" +
    "202104 Fall 2021\tENGL 035 01\tRise of the Novel(W)\t1\t1\tA-\tHU, W\tBuurma, Rachel\n" +
    " \tENGR 015 01\tFund Digital&Embedded System\t1\t1\tA-\tNS, NSEP\tPhillips, Stephen\n" +
    " \tPHED 071CS 01\tCS: Fencing\t0\t0\t1\tPE\t \n" +
    " \tCPSC 073 01\tProgramming Languages\t1\t1\tA\tNS, NSEP\tPalmer, Zachary\n" +
    " \tMATH 027 02\tLinear Algebra\t1\t1\tC\tNS\tLorman, Vitaly\n" +
    "Credits Earned\t \t \t \t4\t \t \t \n" +
    "202102 Spring 2021\tPSYC 001 01\tR:Introduction to Psychology\t1\t1\tA\tSS\tBlanchar, John\n" +
    " \tCPSC 031 01\tR:Intro to Computer Systems\t1\t1\tA\tNS, NSEP\tNewhall, Tia\n" +
    " \tENGL 046 01\tR:Tolkien & Pullman: Lit Roots\t1\t1\tA-\tHU\tWilliamson, Craig\n" +
    " \tMATH 029 01\tR:Discrete Mathematics\t1\t1\tB\tNS\tCrawford, Thomas\n" +
    " \tPHED 071CS 01\tCS: Fencing\t0\t0\t1\tPE\t \n" +
    "Credits Earned\t \t \t \t4\t \t \t \n" +
    "Total Credits Earned\t \t \t \t12\t \t \t \n" +
    "release 1.0 Set Screen Reader Mode On\n";

  populate_table();
}

export default App;
