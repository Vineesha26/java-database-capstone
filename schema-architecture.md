# Architecture Summary

This Spring Boot application uses both MVC and REST controllers. Thymeleaf templates power the Admin and Doctor dashboards, while REST APIs serve patient- and appointment-facing modules (e.g., mobile or SPA clients). All incoming requests are funneled through Spring MVC controllers, which delegate to a shared service layer that encapsulates business rules, validation, and orchestration. The service layer interacts with repository interfaces to persist and retrieve data.

The application uses two data stores: **MySQL** for structured operational data (patients, doctors, appointments, admin/roles) modeled as **JPA entities**, and **MongoDB** for flexible, document-centric data (e.g., prescriptions and clinical notes) modeled as **document schemas**. Transactions and constraints live primarily in MySQL, while MongoDB supports rapid iteration on prescription structures. Cross-entity operations are coordinated in services, not controllers, preserving a clear separation of concerns.

---

# Numbered Flow of Data and Control

1. A user (Admin/Doctor/Patient) opens a dashboard or client screen and triggers an action (e.g., “View Appointments” or “Create Prescription”).
2. The request is routed to the appropriate **Spring MVC controller** (Thymeleaf-backed for Admin/Doctor UIs, REST controllers for client/mobile APIs).
3. The controller validates basic inputs and delegates to a **service** method that represents the business capability (e.g., scheduleAppointment, listPrescriptions).
4. The service applies **business logic** (rules, role checks, cross-entity validation) and orchestrates calls to one or more **repositories**.
5. **Repositories** query/update **MySQL** via **JPA** for relational data and **MongoDB** for document data, returning domain objects/DTOs to the service.
6. The service aggregates and transforms results into **view models** (for Thymeleaf) or **API DTOs** (for REST), handling errors and edge cases.
7. The controller returns a **Thymeleaf view** with model data or a **JSON response**; the UI updates accordingly, and the user sees the outcome (e.g., appointment confirmed, prescription listed).
