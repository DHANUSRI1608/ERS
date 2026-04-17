package com.ers.repository;
import com.ers.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeId(String employeeId);
    boolean existsByEmployeeId(String employeeId);
    List<Employee> findByDepartment(String department);

    @Query("SELECT e.department, COUNT(e), SUM(e.salary), AVG(e.salary) FROM Employee e GROUP BY e.department ORDER BY e.department")
    List<Object[]> getDepartmentStats();

    @Query("SELECT COALESCE(SUM(e.salary), 0) FROM Employee e WHERE e.status = 'ACTIVE'")
    Double getTotalSalaryOfActive();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = 'ACTIVE'")
    Long countActive();
}