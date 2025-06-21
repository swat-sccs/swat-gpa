import React from 'react';

export function DepartmentDropdown({ departments, onChange }) {
  return (
    <div className="department-dropdown mb-3">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="deptDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Choose Departments
      </button>
      <ul className="dropdown-menu" aria-labelledby="deptDropdown">
        {departments.map((dept) => (
          <li key={dept}>
            <label className="dropdown-item">
              <input
                type="checkbox"
                className="dept-checkbox"
                value={dept}
                onChange={onChange}
              />{' '}
              {dept}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
