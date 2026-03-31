const BASE_URL = 'http://localhost:3000/Employee';

class EmployeeModule {
  async request(url = BASE_URL, options = {}) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async getAllEmployees() {
    return this.request();
  }

  async getEmployeeById(id) {
    return this.request(`${BASE_URL}/${id}`);
  }

  async createEmployee(employee) {
    return this.request(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(employee)
    });
  }

  async updateEmployee(id, employee) {
    return this.request(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee)
    });
  }

  async updateEmployeeDelta(id, updates) {
    return this.request(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteEmployee(id) {
    return this.request(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
  }

  async searchEmployees(criteria = {}) {
    const employees = await this.getAllEmployees();
    const {
      query,
      dob,
      designation,
      minSalary,
      maxSalary
    } = criteria;

    return employees.filter((employee) => {
      const matchesQuery =
        !query || Object.values(employee).some((value) => String(value).toLowerCase().includes(String(query).toLowerCase()));

      const matchesDob = !dob || employee.dob === dob;
      const matchesDesignation =
        !designation || employee.designation.toLowerCase().includes(String(designation).toLowerCase());
      const matchesMinSalary =
        minSalary === undefined || Number(employee.salary) >= Number(minSalary);
      const matchesMaxSalary =
        maxSalary === undefined || Number(employee.salary) <= Number(maxSalary);

      return matchesQuery && matchesDob && matchesDesignation && matchesMinSalary && matchesMaxSalary;
    });
  }
}

module.exports = EmployeeModule;
