package com.ers.config;

import com.ers.entity.Employee;
import com.ers.entity.User;
import com.ers.repository.EmployeeRepository;
import com.ers.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final EmployeeRepository empRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedEmployees();
    }

    private void seedUsers() {
        if (userRepo.count() > 0) return;
        userRepo.saveAll(List.of(
            User.builder().name("Arjun Sharma").email("arjun@corp.com")
                .password(encoder.encode("admin123")).role(User.Role.ADMIN).department("IT").build(),
            User.builder().name("Priya Nair").email("priya@corp.com")
                .password(encoder.encode("analyst123")).role(User.Role.ANALYST).department("Finance").build(),
            User.builder().name("Karthik Raj").email("karthik@corp.com")
                .password(encoder.encode("emp123")).role(User.Role.EMPLOYEE).department("Sales").build(),
            User.builder().name("Meena Pillai").email("meena@corp.com")
                .password(encoder.encode("emp123")).role(User.Role.EMPLOYEE).department("HR")
                .status(User.Status.INACTIVE).build(),
            User.builder().name("Vikram Das").email("vikram@corp.com")
                .password(encoder.encode("analyst123")).role(User.Role.ANALYST).department("Operations").build()
        ));
        log.info("Seeded 5 users");
    }

    private void seedEmployees() {
        if (empRepo.count() > 0) return;
        String[] names = {"Ananya K","Rohan M","Divya S","Suresh B","Lakshmi R",
                "Pradeep N","Sneha A","Arun V","Kavitha M","Rajesh P",
                "Sindhu T","Manoj K","Deepa R","Sanjay V","Pooja N",
                "Venkat S","Amitha R","Ganesh D","Nithya P","Aravind K"};
        String[] depts = {"Sales","Engineering","Marketing","Finance","HR","Operations"};
        Employee.Performance[] perfs = Employee.Performance.values();

        java.util.List<Employee> list = new java.util.ArrayList<>();
        for (int i = 0; i < names.length; i++) {
            list.add(Employee.builder()
                .employeeId(String.format("EMP%04d", 1001 + i))
                .name(names[i])
                .department(depts[i % depts.length])
                .salary(BigDecimal.valueOf(35000 + i * 4500L))
                .joinDate(LocalDate.of(2020 + (i % 5), (i % 12) + 1, 10 + (i % 15)))
                .status(i == 3 || i == 13 ? Employee.Status.INACTIVE : Employee.Status.ACTIVE)
                .performance(perfs[i % perfs.length])
                .uploadedBy("system")
                .build());
        }
        empRepo.saveAll(list);
        log.info("Seeded 20 employees");
    }
}