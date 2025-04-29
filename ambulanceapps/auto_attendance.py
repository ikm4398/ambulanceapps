import frappe

def create_or_update_attendance(doc, method=None):
    if not doc.get("shift"):
        return

    shift_details = frappe.get_doc("Shift Type", doc.get("shift"))
    shift_start_time = shift_details.start_time
    shift_end_time = shift_details.end_time
    late_entry_grace_period = shift_details.late_entry_grace_period
    early_exit_grace_period = shift_details.early_exit_grace_period

    # Get check-in time and calculate attendance date
    checkin_datetime = frappe.utils.get_datetime(doc.get("time"))
    attendance_date = checkin_datetime.date()  # Set attendance date from check-in time

    # Set expected shift start and end times
    expected_checkin = frappe.utils.get_datetime(f"{attendance_date} {shift_start_time}")
    expected_checkout = frappe.utils.get_datetime(f"{attendance_date} {shift_end_time}")

    late_entry = 0
    early_exit = 0

    if doc.get("log_type") == "IN":
        if checkin_datetime > expected_checkin:
            late_entry = (checkin_datetime - expected_checkin).total_seconds() / 60
            if late_entry <= late_entry_grace_period:
                late_entry = 0

    elif doc.get("log_type") == "OUT":
        if checkin_datetime < expected_checkout:
            early_exit = (expected_checkout - checkin_datetime).total_seconds() / 60
            if early_exit <= early_exit_grace_period:
                early_exit = 0

    attendance_exists = frappe.db.exists("Attendance", {
        "employee": doc.get("employee"),
        "attendance_date": attendance_date,  # Use check-in date as attendance date
        "docstatus": 1
    })

    if not attendance_exists:
        attendance = frappe.get_doc({
            "doctype": "Attendance",
            "employee": doc.get("employee"),
            "status": "Present",
            "company": "Deskgoo",  # Replace with actual company name
            "attendance_date": attendance_date,  # Set attendance date
            "shift": doc.get("shift"),
            "late_entry": late_entry,
            "early_exit": early_exit,
            "docstatus": 1
        })
        attendance.insert()
        attendance.submit()  # Submit the new record
        frappe.log_error(f"Attendance Created for {doc.get('employee')}: {attendance.name}")
    else:
        attendance = frappe.get_doc("Attendance", attendance_exists)

        if attendance.docstatus == 1:  # If submitted, cancel and amend
            attendance.cancel()
            amended_attendance = frappe.copy_doc(attendance)
            amended_attendance.docstatus = 0  # Set to Draft
            amended_attendance.insert()
            if doc.get("log_type") == "IN":
                amended_attendance.late_entry = late_entry
            elif doc.get("log_type") == "OUT":
                amended_attendance.early_exit = early_exit
            amended_attendance.submit()  # Submit the amended version
            frappe.log_error(f"Attendance Amended for {doc.get('employee')}: {amended_attendance.name}")
        else:
            if doc.get("log_type") == "IN":
                attendance.late_entry = late_entry
            elif doc.get("log_type") == "OUT":
                attendance.early_exit = early_exit
            attendance.save()
